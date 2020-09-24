import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from './token-storage.service';


describe('TokenStorageService', () => {
  let service: TokenStorageService;
  const mockSessionStorage = (() => {
    let store = {};
    return {
      getItem: (key) => {
        return store[key];
      },

      setItem: (key, value) => {
        store[key] = value + '';
      },
      removeItem: (key) => {
        delete store[key];
      },

      clear: () => {
        store = {};
      }
    };
  })();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenStorageService);

    Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage, writable: true });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save token for logged in user in session storage', () => {

    service.saveToken('test user token');

    expect(window.sessionStorage.getItem('auth-token')).toEqual('test user token');
  });

  it('should get token for logged in user from session storage', () => {

    const token = service.getToken();

    expect(window.sessionStorage.getItem('auth-token')).toEqual(token);
  });
  it('should save user in session storage', () => {
    const userData = {
      accessToken: 'test access token',
      userName: 'test 1',
      roles: ['ROLE_USER']
    };

    service.saveUser(userData);

    expect(window.sessionStorage.getItem('auth-user')).toEqual(JSON.stringify(userData));
  });

  it('should get user from session storage', () => {
    const userData = {
      accessToken: 'test access token',
      userName: 'test 1',
      roles: ['ROLE_USER']
    };

    service.saveUser(userData);
    const user = service.getUser();

    expect(user).toEqual(JSON.parse(window.sessionStorage.getItem('auth-user')));
  });

  it('should sign out and clear all session storage', () => {
    service.signOut();

    expect(window.sessionStorage.getItem('auth-user')).toBeUndefined();
  });


});
