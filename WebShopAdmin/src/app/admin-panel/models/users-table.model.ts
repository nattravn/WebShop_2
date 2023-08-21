import { User } from './user.model';

export class UsersTable {
	public currentPage: number;

	public totalItems: number;

	public totalPages: number;

	public items: User[];
}
