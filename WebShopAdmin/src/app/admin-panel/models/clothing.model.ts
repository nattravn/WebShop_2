export class Clothing {
	public size: string;
	constructor(init?: Partial<Clothing>) {
		Object.assign(this, init);
	}
}
