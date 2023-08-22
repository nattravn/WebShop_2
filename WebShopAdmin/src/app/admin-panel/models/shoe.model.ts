export class Shoe {
	public size: string;
	constructor(init?: Partial<Shoe>) {
		Object.assign(this, init);
	}
}
