import { Record } from '@admin-panel/models/record.model';
import { Clothing } from './clothing.model';

export class ProductTable {
	public currentPage: number;

	public totalItems: number;

	public totalPages: number;

	public items: Record[] | Clothing[];
}
