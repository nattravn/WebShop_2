export class BaseProduct {
	public id: number;
	public releaseDate: Date;
	public description: string;
	public image: File;
	public imagePath: string;
	public title: string;
	public price: number;
	public categoryId: number;
	public subCategoryId: number;
	public editorUserId: string;
	public creatorUserId: string;
	public categoryName: string;
	public lastUpdatedTime: Date;
}
