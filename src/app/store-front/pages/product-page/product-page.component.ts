import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarruselComponent } from "../../../products/components/product-carrusel/product-carrusel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarruselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  productsService = inject(ProductsService);
  route = inject(ActivatedRoute);
  slugParam = this.route.snapshot.params['idSlug'];
  productResource = rxResource({
    request: () => ({ idSlug: this.slugParam }),
    loader: ({ request }) => {
      return this.productsService.getProductsBySlug(request.idSlug);
    },
  });
}
