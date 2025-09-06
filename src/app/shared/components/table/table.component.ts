import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, CommonModule, TitleCasePipe, MatIconModule, MatButtonModule],
  template: `
    <table mat-table [dataSource]="data" class="mat-elevation-z2 full-width">

      <ng-container *ngFor="let column of displayedColumns" [matColumnDef]="column" >
        <th mat-header-cell *matHeaderCellDef>{{ column | titlecase }}</th>
        <td mat-cell *matCellDef="let element">
          <ng-container *ngIf="column === 'acoes'">
            <button mat-icon-button color="primary" (click)="edit.emit(element)" *ngIf="editEnabled">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="delete.emit(element)" *ngIf="deleteEnabled">
              <mat-icon>delete</mat-icon>
            </button>
          </ng-container>
          <ng-container *ngIf="column !== 'acoes'">
            {{ element[column + 'Nome'] ?? element[column] }}
          </ng-container>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`.full-width { width: 100%; margin-top: 1rem; }`]
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];

  // ✅ Novos inputs para controlar visibilidade dos botões
  @Input() editEnabled = true;
  @Input() deleteEnabled = true;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
}
