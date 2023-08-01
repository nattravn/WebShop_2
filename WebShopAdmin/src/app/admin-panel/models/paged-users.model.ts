import { User } from './user.model';

export class PagedUsers {
	public currentPage: number;

	public totalItems: number;

	public totalPages: number;

	public items: User[];
}
