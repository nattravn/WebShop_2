import { Category } from './category.model';

export class CategoryDialog {
	public currentPage: number;
	public totalPages: number;
	public order: string;
	public sortKey: string;
	public row: Category;

	constructor(init?: Partial<CategoryDialog>) {
		Object.assign(this, init);
	}
}
