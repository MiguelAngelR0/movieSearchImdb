import { Component, effect, input, output, signal } from '@angular/core';
import { ImdbSortField, ImdbSortOrder } from '../../interfaces/imdbSearchParams';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sort-buttons',
  imports: [ButtonModule],
  templateUrl: './sort-buttons.html',
  styles: ``
})
export class SortButtons {
  sortField = signal<ImdbSortField>('id');
  sortOrder = signal<ImdbSortOrder>('ASC');
  activeSort = signal<ImdbSortField | null>(null);

  currentSortField = input<ImdbSortField>();
  currentSortOrder = input<ImdbSortOrder>();

  constructor() {
    // Sincronizar el estado cuando cambia desde el padre
    effect(() => {
      const field = this.currentSortField();
      const order = this.currentSortOrder();

      if (field) {
        this.sortField.set(field);
        this.activeSort.set(field);
      }
      if (order) {
        this.sortOrder.set(order);
      }
    });
  }


  // Output para emitir cambios al componente padre
  sortChange = output<{ sortField: ImdbSortField; sortOrder: ImdbSortOrder }>();

  toggleSortOrder(field: ImdbSortField) {
    if (this.activeSort() === field) {
      // Si ya está activo, cambiar el orden
      this.sortOrder.update(order => order === 'ASC' ? 'DESC' : 'ASC');
      // Actualizar sortField también
      this.sortField.set(field);
    } else {
      // Si es nuevo, activarlo con el orden por defecto
      this.activeSort.set(field);
      this.sortField.set(field);

      if (field === 'averageRating') {
        this.sortOrder.set('ASC');
      } else if (field === 'numVotes') {
        this.sortOrder.set('DESC');
      } else if (field === 'startYear') {
        this.sortOrder.set('DESC');
      }
    }

    // Emitir el cambio al componente padre
    this.sortChange.emit({
      sortField: this.sortField(),
      sortOrder: this.sortOrder()
    });
  }

  isActiveSort(field: ImdbSortField): boolean {
    return this.activeSort() === field;
  }
}
