import { Record } from 'src/app/admin-panel/models/record.model';
import { Clothing } from './clothing.model';

export class ProductUpdate<T> {

	public currentPage: number

	public totalPages: number

	public order: string
	
	public sortKey: string

	public row: T
}
