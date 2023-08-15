export class SubCategory {
	public id: number;
	public name: string;
	public route: string;
	public categoryId: number;

	constructor(init?: Partial<SubCategory>) {
		Object.assign(this, init);
	}
}
