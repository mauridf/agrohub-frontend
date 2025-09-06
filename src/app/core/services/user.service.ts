import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../api';

export interface Usuario {
  id?: string;
  email: string;
  senha?: string;
  role: 'ADM' | 'PROD';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${environment.apiUrl}${API.usuarios}`);
  }

  getById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}${API.usuarios}/${id}`);
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiUrl}${API.usuarios}`, usuario);
  }

  update(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${environment.apiUrl}${API.usuarios}/${id}`, usuario);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${API.usuarios}/${id}`);
  }
}
