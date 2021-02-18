import { TemplateRef } from '@angular/core';
import { Category } from 'src/app/shared/models/category.model';

export class DialogData {
    headerText: string;
    category: Category;
    createNew: boolean;
    template: TemplateRef<any>;
}
