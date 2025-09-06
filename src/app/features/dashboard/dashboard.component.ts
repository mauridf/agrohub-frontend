import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="dashboard">
      <h1>Bem-vindo ao AgroHub</h1>
      <p>Aqui virá o dashboard futuramente.</p>
      <button mat-raised-button color="warn" (click)="logout()">Sair</button>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; }
  `]
})
export class DashboardComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
