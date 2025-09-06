import { Component, OnInit, inject } from '@angular/core';
import { ProdutorService, Produtor } from '../../core/services/produtor.service';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProdutorFormComponent } from './form.componet';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-produtor-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ProdutorFormComponent
  ],
  template: `
    <div class="produtor-list">
      <!-- NOVO só aparece para PROD sem produtor -->
      <button mat-raised-button color="primary" *ngIf="canCreate" (click)="openForm()">NOVO</button>

      <ng-container *ngIf="produtores.length; else noUsers">
        <app-table
            [data]="produtores"
            [displayedColumns]="columns"
            [editEnabled]="canEdit"
            [deleteEnabled]="canDelete"
            (edit)="edit($event)"
            (delete)="delete($event)">
        </app-table>
      </ng-container>

      <ng-template #noUsers>
        <p>Sem Produtores Cadastrados</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .produtor-list { padding: 1rem; }
    button { margin-bottom: 1rem; }
  `]
})
export class ProdutorListComponent implements OnInit {
  produtores: Produtor[] = [];
  columns = ['nome', 'cpf', 'acoes'];
  canCreate = false;
  canEdit = false;
  canDelete = false;

  private produtorService = inject(ProdutorService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    const role = this.auth.getRole();
    const usuarioId = this.auth.getUserId();

    if (role === 'ADM') {
      this.canCreate = false;
      this.canEdit = true;
      this.canDelete = true;
      this.loadProdutores();
    } else {
      // PRODUTOR
      this.produtorService.getByUsuario(usuarioId!).subscribe({
        next: produtor => {
          if (produtor) {
            this.produtores = [produtor];
            this.canCreate = false;
            this.canEdit = true;
            this.canDelete = false;
          } else {
            this.canCreate = true;
            this.canEdit = false;
            this.canDelete = false;
          }
        },
        error: () => {
          // Nenhum produtor encontrado
          this.canCreate = true;
          this.canEdit = false;
          this.canDelete = false;
        }
      });
    }
  }

  loadProdutores() {
    this.produtorService.list().subscribe(list => this.produtores = list);
  }

  openForm(produtor?: Produtor) {
    const dialogRef = this.dialog.open(ProdutorFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: produtor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // recarregar produtores após criação/edição
        const role = this.auth.getRole();
        if (role === 'ADM') this.loadProdutores();
        else this.ngOnInit(); // para PROD, recarrega estado do usuário
      }
    });
  }

  edit(produtor: Produtor) {
    this.openForm(produtor);
  }

  delete(produtor: Produtor) {
    if (!this.canDelete) return; // segurança extra
    if (!confirm(`Deseja realmente excluir o produtor ${produtor.nome}?`)) return;
    this.produtorService.delete(produtor.id!).subscribe(() => this.loadProdutores());
  }
}