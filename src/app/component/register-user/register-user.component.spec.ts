import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { AuthService } from './../../shared/services/auth/auth.service';
import { RegisterUserComponent } from './register-user.component';


describe('RegisterUserComponent', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterUserComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fail to register new user with service giving error', () => {

    const formNativeElement = fixture.debugElement.query(By.css('form'));
    expect(formNativeElement).toBeDefined();

    const userNameField = fixture.debugElement.query(By.css('input[type=text]'));
    expect(userNameField).toBeDefined();
    const userNameNativeElement = userNameField.nativeElement;
    expect(userNameNativeElement).toBeDefined();

    const emailField = fixture.debugElement.query(By.css('input[type=email]'));
    expect(emailField).toBeDefined();
    const emailNativeElement = emailField.nativeElement;
    expect(emailNativeElement).toBeDefined();

    const paswordField = fixture.debugElement.query(By.css('input[type=password]'));
    expect(paswordField).toBeDefined();
    const passWordNativeElement = paswordField.nativeElement;
    expect(passWordNativeElement).toBeDefined();

    fixture.detectChanges();

    userNameNativeElement.value = 'test 2';
    userNameNativeElement.dispatchEvent(newEvent('input'));

    fixture.detectChanges();

    emailNativeElement.value = 'test2@test.test';
    emailNativeElement.dispatchEvent(newEvent('input'));

    fixture.detectChanges();

    passWordNativeElement.value = 'test2@password';
    passWordNativeElement.dispatchEvent(newEvent('input'));

    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(authService, 'register').and.callThrough().and.returnValue(
      throwError(new ErrorEvent('Error in registering user', { error: { message: 'error 500' } })));


    fixture.detectChanges();

    formNativeElement.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalled();
    expect(authService.register).toHaveBeenCalledWith({ username: 'test 2', email: 'test2@test.test', password: 'test2@password' });
    expect(component.isSignUpFailed).toEqual(true);
    expect(component.errorMessage).toEqual('error 500');

  });

  it('should register new user with auth service call', () => {

    const formNativeElement = fixture.debugElement.query(By.css('form'));
    expect(formNativeElement).toBeDefined();

    const userNameField = fixture.debugElement.query(By.css('input[type=text]'));
    expect(userNameField).toBeDefined();
    const userNameNativeElement = userNameField.nativeElement;
    expect(userNameNativeElement).toBeDefined();

    const emailField = fixture.debugElement.query(By.css('input[type=email]'));
    expect(emailField).toBeDefined();
    const emailNativeElement = emailField.nativeElement;
    expect(emailNativeElement).toBeDefined();

    const paswordField = fixture.debugElement.query(By.css('input[type=password]'));
    expect(paswordField).toBeDefined();
    const passWordNativeElement = paswordField.nativeElement;
    expect(passWordNativeElement).toBeDefined();

    fixture.detectChanges();

    userNameNativeElement.value = 'test 1';
    userNameNativeElement.dispatchEvent(newEvent('input'));

    fixture.detectChanges();

    emailNativeElement.value = 'test1@test.com';
    emailNativeElement.dispatchEvent(newEvent('input'));

    fixture.detectChanges();

    passWordNativeElement.value = 'test1@password';
    passWordNativeElement.dispatchEvent(newEvent('input'));

    const userData = {
      userName: 'test1',
      roles: ['ROLE_USER']
    };

    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(authService, 'register').and.callThrough().and.returnValue(of(userData));


    fixture.detectChanges();

    formNativeElement.triggerEventHandler('submit', null);

    expect(component.onSubmit).toHaveBeenCalled();
    expect(authService.register).toHaveBeenCalledWith({ username: 'test 1', email: 'test1@test.com', password: 'test1@password' });
    expect(component.isSignUpFailed).toEqual(false);
    expect(component.isSuccessful).toEqual(true);

  });
});

function newEvent(eventName: string): Event {
  const event = document.createEvent('CustomEvent');
  event.initCustomEvent(eventName, false, false, null);
  return event;
}
