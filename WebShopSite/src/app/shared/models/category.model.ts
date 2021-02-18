import { MatTableDataSource } from '@angular/material/table';
import { SubCategory } from './sub-category.model';

export class Category {
    id: number;
    name: string;
    route: string;
    //subCategories?: SubCategory[] | MatTableDataSource<SubCategory>;
    subCategories?: MatTableDataSource<SubCategory>;
}
