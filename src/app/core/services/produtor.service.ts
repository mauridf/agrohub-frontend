import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../api';

export interface Produtor {
  id: string;
  usuario: { id: string };
  nome: string;
  cpf: string;
  rg: string;
  inscricaoEstadual: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  dadosBancarios: string;
  car: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutorService {
  constructor(private http: HttpClient) {}

  list(): Observable<Produtor[]> {
    return this.http.get<Produtor[]>(`${environment.apiUrl}${API.produtores}`);
  }

  getById(id: string): Observable<Produtor> {
    return this.http.get<Produtor>(`${environment.apiUrl}${API.produtores}/${id}`);
  }

  getByUsuario(usuarioId: string): Observable<Produtor> {
    return this.http.get<Produtor>(`${environment.apiUrl}${API.produtores}/usuario/${usuarioId}`);
  }

  create(produtor: Produtor): Observable<Produtor> {
    return this.http.post<Produtor>(`${environment.apiUrl}${API.produtores}`, produtor);
  }

  update(id: string, produtor: Produtor): Observable<Produtor> {
    return this.http.put<Produtor>(`${environment.apiUrl}${API.produtores}/${id}`, produtor);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${API.produtores}/${id}`);
  }
}
