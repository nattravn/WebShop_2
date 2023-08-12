import { SubCategory } from './sub-category.model';

export class Category {
	public id: number;
	public name: string;
	public route: string;
	public implemented?: boolean;
	public subCategories?: SubCategory[];
}
