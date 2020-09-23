import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { AuthService } from './../../shared/services/auth/auth.service';
import { TokenStorageService } from './../../shared/services/token/token-storage.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const { location } = window;
  let tokenSorage: TokenStorageService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthService, TokenStorageService,
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tokenSorage = TestBed.inject(TokenStorageService);
    authService = TestBed.inject(AuthService);
  });

  afterAll(() => {
    window.location = location;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test oninit', fakeAsync(() => {
    const data = {
      accesToken: 'test access token',
      userName: 'test 1',
      roles: ['ROLE_USER']
    };
    spyOn(tokenSorage, 'getToken').and.callThrough().and.returnValue('test token');
    spyOn(tokenSorage, 'getUser').and.callThrough().and.returnValue(data);

    component.ngOnInit();
    tick();
    flush();

    expect(component.isLoggedIn).toEqual(true);
    expect(tokenSorage.getToken).toHaveBeenCalled();
    expect(tokenSorage.getUser).toHaveBeenCalled();
    expect(component.roles).toEqual(['ROLE_USER']);
  }));

  it('should fail to login on user name password entry', () => {
    component.isLoggedIn = false;
    component.isLoginFailed = true;
    component.roles = [];


    fixture.detectChanges();

    const formNativeElement = fixture.debugElement.query(By.css('form'));
    expect(formNativeElement).toBeDefined();

    const userNameField = fixture.debugElement.query(By.css('input[type=text]'));
    expect(userNameField).toBeDefined();
    const userNameNativeElement = userNameField.nativeElement;
    expect(userNameNativeElement).toBeDefined();

    const paswordField = fixture.debugElement.query(By.css('input[type=password]'));
    expect(paswordField).toBeDefined();
    const passWordNativeElement = paswordField.nativeElement;
    expect(passWordNativeElement).toBeDefined();

    fixture.detectChanges();

    userNameNativeElement.value = 'test 2';
    userNameNativeElement.dispatchEvent(newEvent('input'));

    fixture.detectChanges();

    passWordNativeElement.value = 'test2@password';
    passWordNativeElement.dispatchEvent(newEvent('input'));

    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(authService, 'login').and.callThrough().and.returnValue(throwError(new ErrorEvent('Error in login', { error: { message: 'error 500' } })));


    fixture.detectChanges();

    formNativeElement.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith({ username: 'test 2', password: 'test2@password' });
    expect(component.isLoginFailed).toEqual(true);
    expect(component.errorMessage).toEqual('error 500');

  });

  it('should submit login request', () => {
    delete window.location;
    window.location = { ...window.location, reload: () => jest.fn() };

    const userNameField = fixture.debugElement.query(By.css('input[type=text]'));
    expect(userNameField).toBeDefined();
    const userNameNativeElement = userNameField.nativeElement;
    expect(userNameNativeElement).toBeDefined();
    const paswordField = fixture.debugElement.query(By.css('input[type=password]'));
    expect(paswordField).toBeDefined();
    const passWordNativeElement = paswordField.nativeElement;
    expect(passWordNativeElement).toBeDefined();
    const formNativeElement = fixture.debugElement.query(By.css('form'));
    expect(formNativeElement).toBeDefined();

    fixture.detectChanges();

    userNameNativeElement.value = 'test 1';
    userNameNativeElement.dispatchEvent(newEvent('input'));

    fixture.detectChanges();

    passWordNativeElement.value = 'test@password';
    passWordNativeElement.dispatchEvent(newEvent('input'));

    const data = {
      accesToken: 'test access token',
      userName: 'test 1',
      roles: ['ROLE_USER']
    };

    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(authService, 'login').and.callThrough().and.returnValue(of(data));
    spyOn(tokenSorage, 'saveToken').and.callThrough();
    spyOn(tokenSorage, 'saveUser').and.callThrough();
    spyOn(tokenSorage, 'getUser').and.callThrough().and.returnValue(data);
    spyOn(window.location, 'reload').and.callThrough();

    fixture.detectChanges();

    formNativeElement.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith({ username: 'test 1', password: 'test@password' });

    expect(window.location.reload).toHaveBeenCalled();

  });

});


function newEvent(eventName: string): Event {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, false, false, null);
  return event;
}
