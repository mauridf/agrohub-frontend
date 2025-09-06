import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CulturaService, Cultura } from '../../core/services/cultura.service';
import { AuthService } from '../../core/services/auth.service';
import { CulturaFormComponent } from './cultura-form.component';

@Component({
  selector: 'app-cultura-list',
  standalone: true,
  imports: [CommonModule, TableComponent, MatDialogModule, MatButtonModule, MatIconModule, CulturaFormComponent],
  template: `
    <div class="cultura-list">
      <button mat-raised-button color="primary" *ngIf="canCreate" (click)="openForm()">NOVO</button>

      <ng-container *ngIf="culturas.length; else noData">
        <app-table
          [data]="culturas"
          [displayedColumns]="columns"
          [editEnabled]="canEdit"
          [deleteEnabled]="canDelete"
          (edit)="edit($event)"
          (delete)="delete($event)">
        </app-table>
      </ng-container>

      <ng-template #noData>
        <p>Sem Culturas Cadastradas</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .cultura-list { padding: 1rem; }
    button { margin-bottom: 1rem; }
  `]
})
export class CulturaListComponent implements OnInit {
  culturas: Cultura[] = [];
  columns = ['nome', 'ciclo', 'variedade', 'acoes'];
  canCreate = true;
  canEdit = true;
  canDelete = true;

  private service = inject(CulturaService);
  private auth = inject(AuthService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadCulturas();
  }

  loadCulturas() {
    this.service.list().subscribe(list => this.culturas = list);
  }

  openForm(cultura?: Cultura) {
    const dialogRef = this.dialog.open(CulturaFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: cultura
    });

    dialogRef.afterClosed().subscribe(result => { if (result) this.loadCulturas(); });
  }

  edit(cultura: Cultura) { this.openForm(cultura); }

  delete(cultura: Cultura) {
    if (!confirm(`Deseja realmente excluir a cultura ${cultura.nome}?`)) return;
    this.service.delete(cultura.id!).subscribe(() => this.loadCulturas());
  }
}
