import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FazendaService, Fazenda } from '../../core/services/fazenda.service';
import { ProdutorService } from '../../core/services/produtor.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-fazenda-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card style="max-height: 80vh; overflow-y: auto; padding: 2rem;">
      <h2>{{ data ? 'Editar Fazenda' : 'Cadastrar Fazenda' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Cidade</mat-label>
          <input matInput formControlName="cidade">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Estado</mat-label>
          <input matInput formControlName="estado">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Área Total (ha)</mat-label>
          <input matInput type="number" formControlName="areaTotalHa">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Área Agricultável (ha)</mat-label>
          <input matInput type="number" formControlName="areaAgricultavelHa">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Área Vegetação (ha)</mat-label>
          <input matInput type="number" formControlName="areaVegetacaoHa">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Área Construída (ha)</mat-label>
          <input matInput type="number" formControlName="areaConstruidaHa">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Endereço</mat-label>
          <input matInput formControlName="endereco">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Latitude</mat-label>
          <input matInput type="number" formControlName="latitude">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Longitude</mat-label>
          <input matInput type="number" formControlName="longitude">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Inscrição Estadual</mat-label>
          <input matInput formControlName="inscricaoEstadual">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Código CAR</mat-label>
          <input matInput formControlName="codigoCar">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>CCIR</mat-label>
          <input matInput formControlName="ccir">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Fonte de Água</mat-label>
          <input matInput formControlName="fonteAgua">
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
export class FazendaFormComponent implements OnInit {
  form!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private service: FazendaService,
    private auth: AuthService,
    private dialogRef: MatDialogRef<FazendaFormComponent>,
    private produtorService: ProdutorService,
    @Inject(MAT_DIALOG_DATA) public data?: Fazenda,
  ) {}

  ngOnInit() {
    const usuarioId = this.auth.getUserId();

    if (this.data) {
        // edição: já temos a fazenda
        this.form = this.fb.group({
        produtor: [{ id: this.data.produtor?.id || '' }],
        nome: [this.data.nome, Validators.required],
        areaTotalHa: [this.data.areaTotalHa, Validators.required],
        areaAgricultavelHa: [this.data.areaAgricultavelHa, Validators.required],
        areaVegetacaoHa: [this.data.areaVegetacaoHa, Validators.required],
        areaConstruidaHa: [this.data.areaConstruidaHa, Validators.required],
        endereco: [this.data.endereco, Validators.required],
        cidade: [this.data.cidade, Validators.required],
        estado: [this.data.estado, Validators.required],
        latitude: [this.data.latitude || 0],
        longitude: [this.data.longitude || 0],
        inscricaoEstadual: [this.data.inscricaoEstadual, Validators.required],
        codigoCar: [this.data.codigoCar, Validators.required],
        ccir: [this.data.ccir, Validators.required],
        fonteAgua: [this.data.fonteAgua, Validators.required],
        });
    } else {
        // cadastro: buscar produtorId
        this.produtorService.getByUsuario(usuarioId!).subscribe(produtor => {
        const produtorId = produtor.id;
        this.form = this.fb.group({
            produtor: [{ id: produtorId }],
            nome: ['', Validators.required],
            areaTotalHa: [0, Validators.required],
            areaAgricultavelHa: [0, Validators.required],
            areaVegetacaoHa: [0, Validators.required],
            areaConstruidaHa: [0, Validators.required],
            endereco: ['', Validators.required],
            cidade: ['', Validators.required],
            estado: ['', Validators.required],
            latitude: [0],
            longitude: [0],
            inscricaoEstadual: ['', Validators.required],
            codigoCar: ['', Validators.required],
            ccir: ['', Validators.required],
            fonteAgua: ['', Validators.required],
        });
        });
    }
  }


  onSubmit() {
    if (this.form.invalid) return;
    const fazenda: Fazenda = this.form.value;

    if (this.data) {
      this.service.update(this.data.id!, fazenda).subscribe(() => this.dialogRef.close(true));
    } else {
      this.service.create(fazenda).subscribe(() => this.dialogRef.close(true));
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
