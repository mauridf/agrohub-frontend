import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
  <div class="login-container">
    <mat-card>
      <h2>AgroHub</h2>
      <form [formGroup]="form" (ngSubmit)="onLogin()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput type="password" formControlName="senha">
        </mat-form-field>

        <button mat-raised-button color="primary" class="full-width">Entrar</button>
      </form>
      <a (click)="goRegister()" class="register-link">Cadastrar Usuário</a>
    </mat-card>
  </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      height: 100vh;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to bottom right, #4caf50, #8bc34a);
    }
    mat-card {
      width: 400px;
      padding: 2rem;
      text-align: center;
    }
    .full-width { width: 100%; }
    .register-link {
      display: block;
      margin-top: 1rem;
      cursor: pointer;
      color: #2e7d32;
      font-weight: bold;
    }
  `]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [''],
      senha: ['']
    });
  }

  onLogin() {
    const { email, senha } = this.form.value;
    if (!email || !senha) return;
    this.auth.login(email, senha).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => console.error(err)
    });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}