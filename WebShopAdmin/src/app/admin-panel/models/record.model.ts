export class Record {
	public id: number;
	public band: string;
	public album: string;
	public releaseDate: Date;
	public genre: string;
	public description: string;
	public image: File;
	public imagePath: string;
	public title: string;
	public price: string;
	public categoryId: number;
	public subCategoryId: number;
	public editorUserId: string;
	public creatorUserId: string;
	public categoryName: string;
	public lastUpdatedTime: Date;
	public owner: string;

	constructor(init?: Partial<Record>) {
		init.releaseDate = new Date(init.releaseDate);
		Object.assign(this, init);
	}
}
