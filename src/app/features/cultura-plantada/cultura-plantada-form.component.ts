import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CulturaPlantadaService, CulturaPlantada } from '../../core/services/cultura-plantada.service';
import { FazendaService, Fazenda } from '../../core/services/fazenda.service';
import { CulturaService, Cultura } from '../../core/services/cultura.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { ProdutorService } from '../../core/services/produtor.service';

@Component({
  selector: 'app-cultura-plantada-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card style="max-height: 80vh; overflow-y: auto; padding: 2rem;">
      <h2>{{ data ? 'Editar Cultura Plantada' : 'Cadastrar Cultura Plantada' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Fazenda</mat-label>
          <select matNativeControl formControlName="fazendaId">
            <option *ngFor="let f of fazendas" [value]="f.id">{{ f.nome }}</option>
          </select>
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Cultura</mat-label>
          <select matNativeControl formControlName="culturaId">
            <option *ngFor="let c of culturas" [value]="c.id">{{ c.nome }}</option>
          </select>
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Safra</mat-label>
          <input matInput formControlName="safra">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Área Plantada (ha)</mat-label>
          <input matInput type="number" formControlName="areaPlantadaHa">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Data Plantio</mat-label>
          <input matInput type="date" formControlName="dataPlantio">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Data Colheita Prevista</mat-label>
          <input matInput type="date" formControlName="dataColheitaPrevista">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Produtividade Esperada (sacas/ha)</mat-label>
          <input matInput type="number" formControlName="produtividadeEsperadaSacasHa">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Custo Total</mat-label>
          <input matInput type="number" formControlName="custoTotal">
        </mat-form-field>

        <div class="buttons">
          <button mat-raised-button color="primary" type="submit">{{ data ? 'Atualizar' : 'Cadastrar' }}</button>
          <button mat-button type="button" (click)="close()">Cancelar</button>
        </div>

      </form>
    </mat-card>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 1rem; }
    .buttons { display: flex; gap: 1rem; justify-content: flex-end; }
  `]
})
export class CulturaPlantadaFormComponent implements OnInit {
  form!: FormGroup;
  fazendas: Fazenda[] = [];
  culturas: Cultura[] = [];

  constructor(
    private fb: FormBuilder,
    private cpService: CulturaPlantadaService,
    private fazendaService: FazendaService,
    private culturaService: CulturaService,
    private produtorService: ProdutorService,
    private auth: AuthService,
    private dialogRef: MatDialogRef<CulturaPlantadaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: CulturaPlantada
  ) {}
  
  ngOnInit() {
    const usuarioId = this.auth.getUserId();
    const role = this.auth.getRole();

    // Carregar todas as culturas
    this.culturaService.list().subscribe(c => this.culturas = c);

    if (role === 'ADM') {
      // ADM: pegar todas as fazendas
      this.fazendaService.list().subscribe(f => this.fazendas = f);
    } else {
      if (!usuarioId) {
        console.error('Usuário não logado');
        return;
      }
      // PRODUTOR: pegar o produtor pelo usuário
      this.produtorService.getByUsuario(usuarioId).subscribe(produtor => {
        // agora sim pegar as fazendas do produtor correto
        this.fazendaService.getByProdutor(produtor.id!).subscribe(f => this.fazendas = f);
      });
    }

    // Inicializar formulário
    if (this.data) {
      // edição
      this.form = this.fb.group({
        fazendaId: [this.data.fazenda?.id || '', Validators.required],
        culturaId: [this.data.cultura?.id || '', Validators.required],
        safra: [this.data.safra || '', Validators.required],
        areaPlantadaHa: [this.data.areaPlantadaHa || 0, Validators.required],
        dataPlantio: [this.data.dataPlantio || '', Validators.required],
        dataColheitaPrevista: [this.data.dataColheitaPrevista || '', Validators.required],
        produtividadeEsperadaSacasHa: [this.data.produtividadeEsperadaSacasHa || 0, Validators.required],
        custoTotal: [this.data.custoTotal || 0, Validators.required],
      });
    } else {
      // cadastro
      this.form = this.fb.group({
        fazendaId: ['', Validators.required],
        culturaId: ['', Validators.required],
        safra: ['', Validators.required],
        areaPlantadaHa: [0, Validators.required],
        dataPlantio: ['', Validators.required],
        dataColheitaPrevista: ['', Validators.required],
        produtividadeEsperadaSacasHa: [0, Validators.required],
        custoTotal: [0, Validators.required],
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    const cp: CulturaPlantada = {
      ...this.data,
      fazenda: { id: this.form.value.fazendaId } as Fazenda,
      cultura: { id: this.form.value.culturaId } as Cultura,
      safra: this.form.value.safra,
      areaPlantadaHa: this.form.value.areaPlantadaHa,
      dataPlantio: this.form.value.dataPlantio,
      dataColheitaPrevista: this.form.value.dataColheitaPrevista,
      produtividadeEsperadaSacasHa: this.form.value.produtividadeEsperadaSacasHa,
      custoTotal: this.form.value.custoTotal
    };

    if (this.data) this.cpService.update(this.data.id!, cp).subscribe(() => this.dialogRef.close(true));
    else this.cpService.create(cp).subscribe(() => this.dialogRef.close(true));
  }

  close() { this.dialogRef.close(false); }
}
