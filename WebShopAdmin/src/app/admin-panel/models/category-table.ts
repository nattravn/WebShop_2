import { Category } from './category.model';

export class CategoryTable {
	public currentPage: number;

	public totalItems: number;

	public totalPages: number;

	public items: Category[];
}
