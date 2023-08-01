import { TemplateRef } from '@angular/core';
import { Category } from 'src/app/admin-panel/models/category.model';

export class DialogData {
	public headerText: string;
	public category: Category;
	public createNew: boolean;
	public template: TemplateRef<any>;
}
