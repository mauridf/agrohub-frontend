import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../api';

export interface Fazenda {
  id?: string;
  produtor?: { id: string };
  nome: string;
  areaTotalHa: number;
  areaAgricultavelHa: number;
  areaVegetacaoHa: number;
  areaConstruidaHa: number;
  endereco: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  inscricaoEstadual: string;
  codigoCar: string;
  ccir: string;
  fonteAgua: string;
}

@Injectable({
  providedIn: 'root'
})
export class FazendaService {
  constructor(private http: HttpClient) {}

  list(): Observable<Fazenda[]> {
    return this.http.get<Fazenda[]>(`${environment.apiUrl}${API.fazendas}`);
  }

  getById(id: string): Observable<Fazenda> {
    return this.http.get<Fazenda>(`${environment.apiUrl}${API.fazendas}/${id}`);
  }

  getByProdutor(produtorId: string): Observable<Fazenda[]> {
    return this.http.get<Fazenda[]>(`${environment.apiUrl}${API.fazendas}/produtor/${produtorId}`);
  }

  create(fazenda: Fazenda): Observable<Fazenda> {
    return this.http.post<Fazenda>(`${environment.apiUrl}${API.fazendas}`, fazenda);
  }

  update(id: string, fazenda: Fazenda): Observable<Fazenda> {
    return this.http.put<Fazenda>(`${environment.apiUrl}${API.fazendas}/${id}`, fazenda);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${API.fazendas}/${id}`);
  }
}