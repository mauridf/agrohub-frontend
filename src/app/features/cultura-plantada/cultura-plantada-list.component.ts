import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../shared/components/table/table.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CulturaPlantadaService, CulturaPlantada } from '../../core/services/cultura-plantada.service';
import { AuthService } from '../../core/services/auth.service';
import { ProdutorService } from '../../core/services/produtor.service';
import { FazendaService, Fazenda } from '../../core/services/fazenda.service';
import { CulturaService, Cultura } from '../../core/services/cultura.service';
import { CulturaPlantadaFormComponent } from './cultura-plantada-form.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cultura-plantada-list',
  standalone: true,
  imports: [CommonModule, TableComponent, MatDialogModule, MatButtonModule, MatIconModule, CulturaPlantadaFormComponent],
  template: `
    <div class="cultura-plantada-list">
      <button mat-raised-button color="primary" *ngIf="canCreate" (click)="openForm()">NOVO</button>

      <ng-container *ngIf="culturasPlantadas.length; else noData">
        <app-table
          [data]="culturasPlantadas"
          [displayedColumns]="columns"
          [editEnabled]="canEdit"
          [deleteEnabled]="canDelete"
          (edit)="edit($event)"
          (delete)="delete($event)">
        </app-table>
      </ng-container>

      <ng-template #noData>
        <p>Sem Culturas Plantadas Cadastradas</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .cultura-plantada-list { padding: 1rem; }
    button { margin-bottom: 1rem; }
  `]
})
export class CulturaPlantadaListComponent implements OnInit {
  culturasPlantadas: CulturaPlantada[] = [];
  columns = ['fazenda', 'cultura', 'safra', 'areaPlantadaHa', 'acoes'];
  canCreate = false;
  canEdit = false;
  canDelete = false;

  fazendas: Fazenda[] = [];
  culturas: Cultura[] = [];

  private cpService = inject(CulturaPlantadaService);
  private auth = inject(AuthService);
  private produtorService = inject(ProdutorService);
  private fazendaService = inject(FazendaService);
  private culturaService = inject(CulturaService)
  private dialog = inject(MatDialog);

  ngOnInit() {
        const role = this.auth.getRole();
        const usuarioId = this.auth.getUserId();

        if (role === 'ADM') {
        this.canCreate = false;
        this.canEdit = true;
        this.canDelete = true;

        // Carregar fazendas e culturas primeiro
        forkJoin({
            fazendas: this.fazendaService.list(),
            culturas: this.culturaService.list()
        }).subscribe(({ fazendas, culturas }) => {
            this.fazendas = fazendas;
            this.culturas = culturas;
            this.loadAll();
        });
        } else {
        if (!usuarioId) { console.error('Usuário não logado'); return; }
        this.canCreate = true;
        this.canEdit = true;
        this.canDelete = false;

        this.produtorService.getByUsuario(usuarioId).subscribe(produtor => {
            this.fazendaService.getByProdutor(produtor.id).subscribe(fazendas => {
            this.fazendas = fazendas;

            this.culturaService.list().subscribe(culturas => {
                this.culturas = culturas;

                const requests = fazendas
                .filter(f => f.id)
                .map(f => this.cpService.listByFazenda(f.id!));

                forkJoin(requests).subscribe(results => {
                const flatList = results.flat();

                // substituir ids por nomes
                this.culturasPlantadas = flatList.map(cp => ({
                    ...cp,
                    fazendaNome: this.fazendas.find(f => f.id === cp.fazenda.id)?.nome || 'N/D',
                    culturaNome: this.culturas.find(c => c.id === cp.cultura.id)?.nome || 'N/D'
                }));
                });
            });
            });
        });
        }
    }

  loadAll() {
    this.cpService.list().subscribe(list => this.culturasPlantadas = list);
  }

  openForm(culturaPlantada?: CulturaPlantada) {
    const dialogRef = this.dialog.open(CulturaPlantadaFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: culturaPlantada
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.ngOnInit();
    });
  }

  edit(culturaPlantada: CulturaPlantada) {
    this.openForm(culturaPlantada);
  }

  delete(culturaPlantada: CulturaPlantada) {
    if (!this.canDelete) return;
    if (!confirm(`Deseja realmente excluir a cultura plantada na fazenda ${culturaPlantada.fazenda.nome}?`)) return;
    this.cpService.delete(culturaPlantada.id!).subscribe(() => this.loadAll());
  }
}
