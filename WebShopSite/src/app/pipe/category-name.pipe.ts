import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../shared/models/category.model';

@Pipe({
    name: 'categoryName'
})
export class CategoryNamePipe implements PipeTransform {

    transform(categories: Category[], categoryId?: number): any {

        const category = categories.find(item => item.id === categoryId);

        return category.name;
    }

}
