import { Component, OnInit, inject } from '@angular/core';
import { UserService, Usuario } from '../../core/services/user.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from './form.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="user-list">
      <!-- <button mat-raised-button color="primary" (click)="openForm()">NOVO</button> -->

      <ng-container *ngIf="usuarios.length; else noUsers">
        <app-table
            [data]="usuarios"
            [displayedColumns]="columns"
            (edit)="edit($event)"
            (delete)="delete($event)">
        </app-table>
      </ng-container>

      <ng-template #noUsers>
        <p>Sem Usuários Cadastrados</p>
      </ng-template>
      
    </div>
  `,
  styles: [`
    .user-list { padding: 1rem; }
    button { margin-bottom: 1rem; }
  `]
})
export class UserListComponent implements OnInit {
  usuarios: Usuario[] = [];
  columns = ['email', 'role', 'acoes'];
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.list().subscribe(users => this.usuarios = users);
  }

  openForm(usuario?: Usuario) {
    const dialogRef = this.dialog.open(UserFormComponent, { data: usuario });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadUsers(); });
  }

  edit(usuario: Usuario) {
    this.openForm(usuario);
  }

  delete(usuario: Usuario) {
    if (!confirm(`Deseja realmente excluir o usuário ${usuario.email}?`)) return;
    this.userService.delete(usuario.id!).subscribe(() => this.loadUsers());
  }
}
