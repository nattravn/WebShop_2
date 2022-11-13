import { Record } from 'src/app/admin-panel/models/record.model';
import { Clothing } from './clothing.model';

export class PagedProducts {

	public currentPage: number

	public totalItems: number

	public totalPages: number

	public items: Record[] | Clothing[]
}
