import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CulturaService, Cultura } from '../../core/services/cultura.service';

@Component({
  selector: 'app-cultura-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card style="max-height: 80vh; overflow-y: auto; padding: 2rem;">
      <h2>{{ data ? 'Editar Cultura' : 'Cadastrar Cultura' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Ciclo</mat-label>
          <input matInput formControlName="ciclo" placeholder="Perene ou Anual">
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Variedade</mat-label>
          <input matInput formControlName="variedade">
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
export class CulturaFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CulturaService,
    private dialogRef: MatDialogRef<CulturaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Cultura
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.data?.nome || '', Validators.required],
      ciclo: [this.data?.ciclo || '', Validators.required],
      variedade: [this.data?.variedade || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const cultura: Cultura = this.form.value;

    if (this.data) {
      this.service.update(this.data.id!, cultura).subscribe(() => this.dialogRef.close(true));
    } else {
      this.service.create(cultura).subscribe(() => this.dialogRef.close(true));
    }
  }

  close() { this.dialogRef.close(false); }
}
