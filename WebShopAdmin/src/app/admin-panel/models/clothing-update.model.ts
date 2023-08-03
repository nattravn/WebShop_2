import { BaseProduct } from './base-product.model';

export class ClothingUpdate extends BaseProduct {
	public size: string;
	constructor(init?: Partial<ClothingUpdate>) {
		super();
		Object.assign(this, init);
	}
}
