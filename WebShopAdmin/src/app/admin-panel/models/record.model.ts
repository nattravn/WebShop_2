export class RecordModel {
	public band: string;
	public album: string;

	constructor(init?: Partial<RecordModel>) {
		Object.assign(this, init);
	}
}
