import { Category } from './category.model';

export class CategoryUpdate {
	public currentPage: number;
	public totalPages: number;
	public order: string;
	public sortKey: string;
	public row: Category;

	constructor(init?: Partial<CategoryUpdate>) {
		Object.assign(this, init);
	}
}
