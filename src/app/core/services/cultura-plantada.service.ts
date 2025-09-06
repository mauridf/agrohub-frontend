import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../api';
import { Fazenda } from './fazenda.service';
import { Cultura } from './cultura.service';

export interface CulturaPlantada {
  id?: string;
  fazenda: Fazenda;
  cultura: Cultura;
  safra: string;
  areaPlantadaHa: number;
  dataPlantio: string;
  dataColheitaPrevista: string;
  dataColheitaReal?: string | null;
  produtividadeEsperadaSacasHa: number;
  produtividadeObtidaSacasHa?: number | null;
  custoTotal: number;
  receitaTotal?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class CulturaPlantadaService {
  constructor(private http: HttpClient) {}

  list(): Observable<CulturaPlantada[]> {
    return this.http.get<CulturaPlantada[]>(`${environment.apiUrl}${API.culturaPlantada}`);
  }

  listByFazenda(fazendaId: string): Observable<CulturaPlantada[]> {
    return this.http.get<CulturaPlantada[]>(`${environment.apiUrl}${API.culturaPlantada}/fazenda/${fazendaId}`);
  }

  getById(id: string): Observable<CulturaPlantada> {
    return this.http.get<CulturaPlantada>(`${environment.apiUrl}${API.culturaPlantada}/${id}`);
  }

  create(cp: CulturaPlantada): Observable<CulturaPlantada> {
    return this.http.post<CulturaPlantada>(`${environment.apiUrl}${API.culturaPlantada}`, cp);
  }

  update(id: string, cp: CulturaPlantada): Observable<CulturaPlantada> {
    return this.http.put<CulturaPlantada>(`${environment.apiUrl}${API.culturaPlantada}/${id}`, cp);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${API.culturaPlantada}/${id}`);
  }
}
