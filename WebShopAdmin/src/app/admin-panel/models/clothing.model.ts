import { BaseProduct } from './base-product.model';

export class Clothing extends BaseProduct {
	public size: string;
	constructor(init?: Partial<Clothing>) {
		super();
		init.releaseDate = new Date(init.releaseDate);
		Object.assign(this, init);
	}
}
