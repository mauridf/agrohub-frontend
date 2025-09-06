import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../api';

export interface Cultura {
  id?: string;
  nome: string;
  ciclo: 'Perene' | 'Anual';
  variedade: string;
}

@Injectable({
  providedIn: 'root'
})
export class CulturaService {
  constructor(private http: HttpClient) {}

  list(): Observable<Cultura[]> {
    return this.http.get<Cultura[]>(`${environment.apiUrl}${API.culturas}`);
  }

  getById(id: string): Observable<Cultura> {
    return this.http.get<Cultura>(`${environment.apiUrl}${API.culturas}/${id}`);
  }

  create(cultura: Cultura): Observable<Cultura> {
    return this.http.post<Cultura>(`${environment.apiUrl}${API.culturas}`, cultura);
  }

  update(id: string, cultura: Cultura): Observable<Cultura> {
    return this.http.put<Cultura>(`${environment.apiUrl}${API.culturas}/${id}`, cultura);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${API.culturas}/${id}`);
  }
}
