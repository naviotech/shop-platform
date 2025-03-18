import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  Gender,
  Product,
  ProductsResponse,
} from '../interfaces/product.interface';
import { environment } from 'src/environments/environment';
import { User } from '@/auth/interfaces/user.interface';

const baseUrl = environment.BASEURL;
interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  #http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.#http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(tap((data) => this.productsCache.set(key, data)));
  }

  getProductsBySlug(idSlug: string): Observable<Product> {
    const key = idSlug;

    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }
    return this.#http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((product) => this.productCache.set(key, product)));
  }

  getProductById(id: string): Observable<Product> {
    const key = id;
    if (id === 'new') {
      return of(emptyProduct);
    }
    if (this.productCache.has(key)) {
      return of(this.productCache.get(key)!);
    }
    return this.#http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((product) => this.productCache.set(key, product)));
  }

  updatedProduct(product: Partial<Product>, id: string, imageFileList?: FileList): Observable<Product> {
    const currentImages = product.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...product,
        images: [...currentImages, ...imageNames],
      })),
      switchMap((updatedProduct) =>
        this.#http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
      ),
      tap((product) => this.updatedCache(product))
    );
  }

  createProduct(product: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.uploadImages(imageFileList).pipe(
      map((imageNames) => ({
        ...product,
        images: imageNames, 
      })),
      switchMap((productWithImages) =>
        this.#http.post<Product>(`${baseUrl}/products`, productWithImages)
      ),
      tap((product) => this.updatedCache(product))
    );
  }

  updatedCache(product: Product) {
    this.productCache.set(product.id, product);
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === product.id ? product : currentProduct;
        }
      );
    });
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    const uploadObservables = Array.from(images).map((imageFile) =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables);
  }
  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);
    return this.#http
      .post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}
