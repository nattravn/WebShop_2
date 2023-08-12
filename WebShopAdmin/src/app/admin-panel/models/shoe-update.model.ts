import { BaseProduct } from './base-product.model';

export class ShoeUpdate extends BaseProduct {
	public size: string;
	constructor(init?: Partial<ShoeUpdate>) {
		super();
		Object.assign(this, init);
	}
}
