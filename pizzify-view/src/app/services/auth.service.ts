import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { getHash } from '../../utils';
import { ILogInResponse, IUserCredentials } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  constructor(private http: HttpClient) {}

  logIn(credentials: IUserCredentials, event: ()=>void) {
    const passwordHash = getHash(credentials.password);
    return this.http.post<ILogInResponse>(
      '/api/v1/auth/sign-in',
      {
        username: credentials.username,
        password: passwordHash
      },
      this.httpOptions
    ).pipe(retry(2)).subscribe((response)=>{
      window.localStorage.setItem('accessToken', response.access_token)
      event();
    })
  }

  handleError(err: any, caught: any) {
    return new Observable(()=>err)
  }
}
