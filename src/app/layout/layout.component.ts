import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule
  ],
  template: `
  <mat-sidenav-container class="sidenav-container">
    <mat-sidenav mode="side" opened>
      <mat-nav-list>
        <a mat-list-item *ngFor="let item of menuItems" [routerLink]="item.route">
          <mat-icon>{{item.icon}}</mat-icon>
          <span>{{item.label}}</span>
        </a>
        <a mat-list-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </a>
      </mat-nav-list>
    </mat-sidenav>

    <mat-sidenav-content>
      <mat-toolbar color="primary">
        <span>AgroHub</span>
      </mat-toolbar>

      <div class="content">
        <router-outlet></router-outlet>
      </div>

      <footer class="footer">
        <p>© {{year}} AgroHub</p>
      </footer>
    </mat-sidenav-content>
  </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container { height: 100vh; }
    mat-toolbar { position: sticky; top: 0; z-index: 2; }
    .content { padding: 1rem; min-height: calc(100vh - 64px - 40px); }
    .footer { height: 40px; text-align: center; background: #f1f8e9; display:flex; align-items:center; justify-content:center; }
    mat-nav-list a { display: flex; align-items: center; gap: 8px; }
  `]
})

export class LayoutComponent {
  year = new Date().getFullYear();
  role: string | null;

  menuItems: MenuItem[] = []; // 👈 declara o tipo correto

  constructor(private auth: AuthService) {
    this.role = this.auth.getRole();
    this.menuItems = [
      { label: 'Usuários', icon: 'group', route: '/usuarios', roles: ['ADM'] },
      { label: 'Produtores', icon: 'person', route: '/produtores', roles: ['ADM','PROD'] },
      { label: 'Fazendas', icon: 'agriculture', route: '/fazendas', roles: ['ADM','PROD'] },
      { label: 'Culturas', icon: 'eco', route: '/culturas', roles: ['ADM','PROD'] },
      { label: 'Culturas Plantadas', icon: 'yard', route: '/culturaplantada', roles: ['ADM','PROD'] },
      { label: 'Máquinas', icon: 'precision_manufacturing', route: '/maquinas', roles: ['ADM','PROD'] },
      { label: 'Funcionários', icon: 'badge', route: '/funcionarios', roles: ['ADM','PROD'] },
      { label: 'Insumos', icon: 'inventory', route: '/insumos', roles: ['ADM','PROD'] },
      { label: 'Estoque de Insumos', icon: 'warehouse', route: '/estoque-insumos', roles: ['ADM','PROD'] },
      { label: 'Compras de Insumos', icon: 'shopping_cart', route: '/compras-insumos', roles: ['ADM','PROD'] },
      { label: 'Vendas da Produção', icon: 'point_of_sale', route: '/vendas', roles: ['ADM','PROD'] },
      { label: 'Custos Operacionais', icon: 'attach_money', route: '/custos', roles: ['ADM','PROD'] },
      { label: 'Contratos', icon: 'description', route: '/contratos', roles: ['ADM','PROD'] },
      { label: 'Alertas', icon: 'notifications', route: '/alertas', roles: ['ADM','PROD'] }
    ].filter(item => item.roles.includes(this.role ?? ''));
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}
