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


  sortChange = output<{ sortField: ImdbSortField; sortOrder: ImdbSortOrder }>();

  toggleSortOrder(field: ImdbSortField) {
    if (this.activeSort() === field) {
      this.sortOrder.update(order => order === 'ASC' ? 'DESC' : 'ASC');

      this.sortField.set(field);
    } else {
      this.activeSort.set(field);
      this.sortField.set(field);

      if (field === 'averageRating') {
        this.sortOrder.set('ASC');
      } else if (field === 'startYear') {
        this.sortOrder.set('DESC');
      }
    }

    this.sortChange.emit({
      sortField: this.sortField(),
      sortOrder: this.sortOrder()
    });
  }

  isActiveSort(field: ImdbSortField): boolean {
    return this.activeSort() === field;
  }
}
