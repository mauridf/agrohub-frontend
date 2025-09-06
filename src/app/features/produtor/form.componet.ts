import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ProdutorService, Produtor } from '../../core/services/produtor.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-produtor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <mat-card style="max-height: 80vh; overflow-y: auto; padding: 2rem;">
      <h2>{{ data ? 'Editar Produtor' : 'Cadastrar Produtor' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>RG</mat-label>
          <input matInput formControlName="rg">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Inscrição Estadual</mat-label>
          <input matInput formControlName="inscricaoEstadual">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Data de Nascimento</mat-label>
          <input matInput type="date" formControlName="dataNascimento">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Telefone</mat-label>
          <input matInput formControlName="telefone">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Endereço</mat-label>
          <input matInput formControlName="endereco">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cidade</mat-label>
          <input matInput formControlName="cidade">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Estado</mat-label>
          <input matInput formControlName="estado">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Dados Bancários</mat-label>
          <input matInput formControlName="dadosBancarios">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>CAR</mat-label>
          <input matInput formControlName="car">
        </mat-form-field>

        <div class="buttons">
          <button mat-raised-button color="primary" type="submit">{{ data ? 'Atualizar' : 'Cadastrar' }}</button>
          <button mat-button type="button" (click)="close()">Cancelar</button>
        </div>
      </form>
    </mat-card>
  `,
  styles: [`
    mat-card { padding: 2rem; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .buttons { display: flex; gap: 1rem; justify-content: flex-end; }
  `]
})
export class ProdutorFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private produtorService: ProdutorService,
    private auth: AuthService,
    private dialogRef: MatDialogRef<ProdutorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Produtor // 👈 aqui pegamos os dados do modal
  ) {}

  ngOnInit() {
    const usuarioId = this.auth.getUserId(); // garantir que não é null antes de enviar
    this.form = this.fb.group({
      usuario: [{ id: usuarioId || '' }],
      nome: [this.data?.nome || '', Validators.required],
      cpf: [this.data?.cpf || '', Validators.required],
      rg: [this.data?.rg || '', Validators.required],
      inscricaoEstadual: [this.data?.inscricaoEstadual || '', Validators.required],
      dataNascimento: [this.data?.dataNascimento || '', Validators.required],
      telefone: [this.data?.telefone || '', Validators.required],
      endereco: [this.data?.endereco || '', Validators.required],
      cidade: [this.data?.cidade || '', Validators.required],
      estado: [this.data?.estado || '', Validators.required],
      dadosBancarios: [this.data?.dadosBancarios || '', Validators.required],
      car: [this.data?.car || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const produtor: Produtor = this.form.value;

    if (this.data) {
      this.produtorService.update(this.data.id!, produtor).subscribe(() => this.dialogRef.close(true));
    } else {
      this.produtorService.create(produtor).subscribe(() => this.dialogRef.close(true));
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
