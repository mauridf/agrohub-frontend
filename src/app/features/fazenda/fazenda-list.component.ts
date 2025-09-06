import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FazendaService, Fazenda } from '../../core/services/fazenda.service';
import { AuthService } from '../../core/services/auth.service';
import { FazendaFormComponent } from './fazenda-form.component';
import { ProdutorService } from '../../core/services/produtor.service';

@Component({
  selector: 'app-fazenda-list',
  standalone: true,
  imports: [CommonModule, TableComponent, MatDialogModule, MatButtonModule, MatIconModule, FazendaFormComponent],
  template: `
    <div class="fazenda-list">
      <button mat-raised-button color="primary" *ngIf="canCreate" (click)="openForm()">NOVO</button>

      <ng-container *ngIf="fazendas.length; else noData">
        <app-table
          [data]="fazendas"
          [displayedColumns]="columns"
          [editEnabled]="canEdit"
          [deleteEnabled]="canDelete"
          (edit)="edit($event)"
          (delete)="delete($event)">
        </app-table>
      </ng-container>

      <ng-template #noData>
        <p>Sem Fazendas Cadastradas</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .fazenda-list { padding: 1rem; }
    button { margin-bottom: 1rem; }
  `]
})
export class FazendaListComponent implements OnInit {
  fazendas: Fazenda[] = [];
  columns = ['nome', 'cidade', 'estado', 'acoes'];
  canCreate = false;
  canEdit = false;
  canDelete = false;

  private service = inject(FazendaService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);
  private produtorService = inject(ProdutorService);

  ngOnInit() {
  const role = this.auth.getRole();
  const usuarioId = this.auth.getUserId();

  if (role === 'ADM') {
    this.canCreate = false;
    this.canEdit = true;
    this.canDelete = true;
    this.loadFazendas();
  } else {
    // PRODUTOR: buscar produtor para pegar id
    this.canCreate = true;
    this.canEdit = true;
    this.canDelete = true;

    this.produtorService.getByUsuario(usuarioId!).subscribe({
      next: produtor => {
        if (produtor?.id) {
          this.service.getByProdutor(produtor.id).subscribe(list => this.fazendas = list);
        } else {
          this.fazendas = [];
        }
      },
      error: () => this.fazendas = []
    });
  }
}


  loadFazendas() {
    this.service.list().subscribe(list => this.fazendas = list);
  }

  openForm(fazenda?: Fazenda) {
    const dialogRef = this.dialog.open(FazendaFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: fazenda
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const role = this.auth.getRole();
        if (role === 'ADM') this.loadFazendas();
        else this.ngOnInit();
      }
    });
  }

  edit(fazenda: Fazenda) {
    this.openForm(fazenda);
  }

  delete(fazenda: Fazenda) {
    if (!confirm(`Deseja realmente excluir a fazenda ${fazenda.nome}?`)) return;
    this.service.delete(fazenda.id!).subscribe(() => this.loadFazendas());
  }
}
