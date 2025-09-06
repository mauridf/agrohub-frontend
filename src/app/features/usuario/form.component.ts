import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserService, Usuario } from '../../core/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule
  ],
  template: `
    <mat-card>
      <h2>{{ data ? 'Editar Usuário' : 'Cadastrar Usuário' }}</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="!data">
          <mat-label>Senha</mat-label>
          <input matInput type="password" formControlName="senha">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="ADM">ADM</mat-option>
            <mat-option value="PROD">PROD</mat-option>
          </mat-select>
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
    mat-card { padding: 2rem; }
    .buttons { display: flex; gap: 1rem; justify-content: flex-end; }
  `]
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Usuario  // 👈 aqui usamos `data` para evitar conflito
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [this.data?.email || '', Validators.required],
      senha: ['', this.data ? [] : Validators.required],
      role: [this.data?.role || 'PROD', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const usuario: Usuario = this.form.value;

    if (this.data) {
      this.userService.update(this.data.id!, usuario).subscribe(() => this.dialogRef.close(true));
    } else {
      this.userService.create(usuario).subscribe(() => this.dialogRef.close(true));
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
