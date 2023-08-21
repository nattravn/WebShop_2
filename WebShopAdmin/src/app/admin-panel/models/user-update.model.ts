export class UserUpdate {
	public id: string;
	public userName: string;
	public email: string;
	public password: string;
	public fullName: string;
	public roleName: string;

	constructor(init?: Partial<UserUpdate>) {
		Object.assign(this, init);
	}
}
