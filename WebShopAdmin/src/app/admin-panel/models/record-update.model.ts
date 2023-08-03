import { BaseProduct } from './base-product.model';

export class RecordUpdate extends BaseProduct {
	public band: string;

	public album: string;

	public genre: string;

	constructor(init?: Partial<RecordUpdate>) {
		super();
		Object.assign(this, init);
	}
}
