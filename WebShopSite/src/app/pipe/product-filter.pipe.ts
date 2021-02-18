import { Pipe, PipeTransform } from '@angular/core';
import { BaseProduct } from '../shared/models/base-product.model';

@Pipe({
    name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {
    transform(products: BaseProduct[], subCategoryId: number): BaseProduct[] {
        if (!products || !subCategoryId) {
            return products;
        }
        return products.filter( product => product.subCategoryId === subCategoryId);
    }
}
