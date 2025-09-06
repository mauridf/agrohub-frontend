import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, TitleCasePipe],
  template: `
    <table mat-table [dataSource]="data" class="mat-elevation-z2 full-width">
      <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column">
        <th mat-header-cell *matHeaderCellDef>{{ column | titlecase }}</th>
        <td mat-cell *matCellDef="let element">{{ element[column] }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    .full-width { width: 100%; margin-top: 1rem; }
  `]
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
}
