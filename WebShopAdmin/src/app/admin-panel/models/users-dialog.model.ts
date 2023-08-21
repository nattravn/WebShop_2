import { UserUpdate } from './user-update.model';

export class UsersDialog {
	public currentPage: number;
	public totalPages: number;
	public order: string;
	public sortKey: string;
	public row: UserUpdate;

	constructor(init?: Partial<UsersDialog>) {
		Object.assign(this, init);
	}
}
