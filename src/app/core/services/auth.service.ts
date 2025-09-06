import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API } from '../api';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'agrohub_token';
  private roleKey = 'agrohub_role';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {
    return this.http.post<{ token: string; role: string }>(
      `${environment.apiUrl}${API.auth.login}`,
      { email, senha }
    ).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.roleKey, res.role);
      })
    );
  }

  register(email: string, senha: string, role: string) {
  return this.http.post(`${environment.apiUrl}${API.auth.register}`, { email, senha, role });
}

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRole() {
    return localStorage.getItem(this.roleKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }
}
