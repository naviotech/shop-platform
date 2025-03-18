import { Product } from '@/products/interfaces/product.interface';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { ProductCarruselComponent } from '../../../products/components/product-carrusel/product-carrusel.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@/utils/form-utils';
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  imports: [ProductCarruselComponent, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product = input.required<Product>();
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  productService = inject(ProductsService);
  router = inject(Router);
  wasSaved = signal(false);
  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([])
  imagesToCarrusel = computed(()=>{
    const currentProductImages = [...this.product().images, ...this.tempImages()]
    return currentProductImages
  })
  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [['']],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formData: Partial<Product>) {
    this.productForm.reset({
      title: formData.title,
      description: formData.description,
      slug: formData.slug,
      price: formData.price,
      stock: formData.stock,
      sizes: formData.sizes,
      images: formData.images,
      tags: formData.tags?.join(','),
      gender: formData.gender,
    });
  }
  onSizeChange(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }
  async onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const productLike: Partial<Product> = {
      ...(this.productForm.value as any),
      tags: this.productForm.value.tags
        ?.toLowerCase()
        .split(',')
        .map((tag) => tag.trim() ?? []),
    };
    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike,this.imageFileList)
      );

      this.router.navigate(['/admin/product', product.id]);
    } else {
      await firstValueFrom(
        this.productService.updatedProduct(productLike, this.product().id, this.imageFileList)
      );
    }
    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }

  onFilesChanged(event:Event){
    const files = (event.target as HTMLInputElement).files
    this.imageFileList = files ?? undefined
    const imageUrls = Array.from(files ?? []).map((file)=> URL.createObjectURL(file))
    this.tempImages.set(imageUrls)
  }
}
