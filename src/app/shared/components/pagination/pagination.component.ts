import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  currentPage = input<number>(1);
  totalpages = input<number>(0);

  activePage = linkedSignal(this.currentPage);
  
  getPagesList = computed(() => {
    return Array.from({ length: this.totalpages() }, (_, i) => i + 1);
  });
}
