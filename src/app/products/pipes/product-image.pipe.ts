import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.BASEURL;
const imageFallback = './assets/images/no-image.jpg';
@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null): string {
    if(value === null){
      return imageFallback
    }
    if(typeof value === 'string' && value.startsWith('blob:')){
      return value
    }
    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }
    const image = value[0];
    if (!image) {
      return imageFallback;
    }

    return `${baseUrl}/files/product/${image}`;
  }
}
