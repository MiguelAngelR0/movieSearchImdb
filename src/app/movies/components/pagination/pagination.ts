import { Component, input, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pagination',
  imports: [ButtonModule],
  templateUrl: './pagination.html',
  styles: ``
})
export class Pagination {

  cursorHistory = input<string[]>([]);
  isLoadingNextPage = input(false);
  hasNextPage = input(false);

  goToPageEmit = output<number>();
  loadNextPage = output<void>();

  goToPage(pageNumber: number) {
    this.goToPageEmit.emit(pageNumber);
  }

  trackFn(index: number) {
    return index;
  }

}
