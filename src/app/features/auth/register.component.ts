import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
  <div class="register-container">
    <mat-card>
      <h2>Cadastrar Usuário</h2>
      <form [formGroup]="form" (ngSubmit)="onRegister()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput type="password" formControlName="senha">
        </mat-form-field>

        <button mat-raised-button color="accent" class="full-width">Cadastrar</button>
      </form>
    </mat-card>
  </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      height: 100vh;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to bottom right, #8bc34a, #c8e6c9);
    }
    mat-card {
      width: 400px;
      padding: 2rem;
      text-align: center;
    }
    .full-width { width: 100%; }
  `]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [''],
      senha: ['']
    });
  }

  onRegister() {
    const { email, senha } = this.form.value;
    if (!email || !senha) return;
    this.auth.register(email, senha).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => console.error(err)
    });
  }
}