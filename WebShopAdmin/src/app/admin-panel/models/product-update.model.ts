export class ProductUpdate<T> {
	public currentPage: number;
	public totalPages: number;
	public order: string;
	public sortKey: string;
	public row: T;

	constructor(init?: Partial<ProductUpdate<T>>) {
		Object.assign(this, init);
	}
}
