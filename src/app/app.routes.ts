import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { UserListComponent } from './features/usuario/list.component';
import { ProdutorListComponent } from './features/produtor/list.component';
import { FazendaListComponent } from './features/fazenda/fazenda-list.component';
import { CulturaListComponent } from './features/cultura/cultura-list.component';
import { CulturaPlantadaListComponent } from './features/cultura-plantada/cultura-plantada-list.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UserListComponent },
      { path: 'produtores', component: ProdutorListComponent },
      { path: 'fazendas', component: FazendaListComponent },
      { path: 'culturas', component: CulturaListComponent },
      { path: 'culturaplantada', component: CulturaPlantadaListComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
