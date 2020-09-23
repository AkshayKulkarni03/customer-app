import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const backenURL = 'http://localhost:8080/api/auth/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with post service call', (done) => {
    const loginInput = { userName: 'test1', password: 'test password' };
    const userData = {
      accessToken: 'test access token',
      userName: 'test 1',
      roles: ['ROLE_USER']
    };

    service.login(loginInput).subscribe(user => {
      expect(user.accessToken).toEqual('test access token');
      expect(user.roles).toEqual(['ROLE_USER']);
      done();
    });

    const req = httpMock.expectOne(`${backenURL}signin`);

    expect(req.request.method).toEqual('POST');
    expect(req.cancelled).toEqual(false);
    expect(req.request.headers.getAll('Content-Type')).toEqual(['application/json']);

    req.flush(userData);
  });

  it('should fail to login for POST service call', () => {
    const loginInput = { userName: 'test1', password: 'test password' };

    service.login(loginInput).subscribe(
      () => fail('should throw error for service call'),
      (error: HttpErrorResponse) => expect(error.status).toEqual(500)
    );

    const req = httpMock.expectOne(`${backenURL}signin`);

    expect(req.request.method).toEqual('POST');
    expect(req.cancelled).toEqual(false);
    expect(req.request.headers.getAll('Content-Type')).toEqual(['application/json']);

    req.flush('error 500 in service call', { status: 500, statusText: 'INTERNAL SERVER ERROR' });
  });

  it('should regiser new user with post service call', (done) => {
    const registerUserInput = { userName: 'test1', email: 'test@email.com', password: 'test@password' };
    const userData = {
      userName: 'test1',
      roles: ['ROLE_USER']
    };

    service.register(registerUserInput).subscribe(user => {
      expect(user.userName).toEqual('test1');
      expect(user.roles).toEqual(['ROLE_USER']);
      done();
    });

    const req = httpMock.expectOne(`${backenURL}signup`);

    expect(req.request.method).toEqual('POST');
    expect(req.cancelled).toEqual(false);
    expect(req.request.headers.getAll('Content-Type')).toEqual(['application/json']);

    req.flush(userData);
  });

  it('should fail to register new user for POST service call', () => {
    const registerUserInput = { userName: 'test1', email: 'test email.com', password: 'test@password' };

    service.register(registerUserInput).subscribe(
      () => fail('should throw error for service call'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(400);
        expect(error.type).toEqual('Error 400');
      });

    const req = httpMock.expectOne(`${backenURL}signup`);

    expect(req.request.method).toEqual('POST');
    expect(req.cancelled).toEqual(false);
    expect(req.request.headers.getAll('Content-Type')).toEqual(['application/json']);

    req.error(new ErrorEvent('Error 400', { message: 'email syntax is not correct' }), { status: 400, statusText: 'BAD REQUEST' });
  });

});
