import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <h1>DASHBOARD - AGROHUB</h1>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 64px - 40px); /* desconta header e footer */
      font-size: 2rem;
      font-weight: bold;
      color: #2e7d32;
    }
  `]
})
export class DashboardComponent {}
