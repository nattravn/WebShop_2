export class ProductDialog<T> {
	public currentPage: number;
	public totalPages: number;
	public order: string;
	public sortKey: string;
	public row: T;

	constructor(init?: Partial<ProductDialog<T>>) {
		Object.assign(this, init);
	}
}
