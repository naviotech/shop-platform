import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  router = inject(ActivatedRoute);

  currentPage = toSignal(
    this.router.queryParams.pipe(
      map((params) => +params['page'] || 1),
      map((page) => (isNaN(page) ? 1 : page))
    ),
    {
      initialValue: 1,
    }
  );
}
