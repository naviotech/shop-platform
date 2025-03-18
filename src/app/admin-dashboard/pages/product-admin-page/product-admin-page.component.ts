import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetailComponent } from "../../components/product-detail/product-detail.component";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  activateroute = inject(ActivatedRoute)
  router = inject(Router)
  productService = inject(ProductsService)
  productId = toSignal(
    this.activateroute.params.pipe(map(params=>params['id']))
  )

  productResource = rxResource({
    request: ()=>({id: this.productId()}),
    loader: ({request})=>{
      return this.productService.getProductById(request.id)
    }
  })

  redirectError = effect(()=>{
    if(this.productResource.error()){
      this.router.navigate(['/admin/products'])
    }
  })
}
