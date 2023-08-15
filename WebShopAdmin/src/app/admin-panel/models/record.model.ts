import { BaseProduct } from './base-product.model';

export class RecordModel extends BaseProduct {
	public band: string;
	public album: string;

	constructor(init?: Partial<RecordModel>) {
		super();
		init.releaseDate = new Date(init.releaseDate);
		Object.assign(this, init);
	}
}
