import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_API = 'http://localhost:8080/api/auth/';

  constructor(private http: HttpClient) { }

  login(credintials): Observable<any> {
    return this.http.post(`${this.AUTH_API}signin`, {
      username: credintials.username,
      password: credintials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(`${this.AUTH_API}signup`, {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }
}
