export class Clothing {
	public id: number;
	public title: string;
	public size: string;
	public price: number;
	public description: string;
	public image: File;
	public imagePath: string;
	public categoryId: number;
	public editorUserId: string;
	public userName: string;
	public subCategoryId: number;
	public categoryName: string;
	public releaseDate: Date;

	constructor(init?: Partial<Clothing>) {
		init.releaseDate = new Date(init.releaseDate);
		Object.assign(this, init);
	}
}
