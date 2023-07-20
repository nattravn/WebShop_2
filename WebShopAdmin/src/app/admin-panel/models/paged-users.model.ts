import { Record } from 'src/app/admin-panel/models/record.model';
import { Clothing } from './clothing.model';
import { User } from './user.model';

export class PagedUsers {

	public currentPage: number

	public totalItems: number

	public totalPages: number

	public items: User[]
}
