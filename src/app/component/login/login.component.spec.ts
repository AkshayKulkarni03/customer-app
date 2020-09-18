import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AuthService } from './../../shared/services/auth/auth.service';
import { TokenStorageService } from './../../shared/services/token/token-storage.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
  }));

  it('should submit login request', () => {
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
    fixture.detectChanges();

    formNativeElement.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith({ username: 'test 1', password: 'test@password' });

  });
});
function newEvent(eventName: string) {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, false, false, null);
  return event;
}