export class Record {
	id: number;
	band: string;
	album: string;
	releaseDate: Date;
	genre: string;
	description: string;
	image: File;
	imagePath: string;
	title: string;
	price: string;
	categoryId: number;
	subCategoryId: number;
	editorUserId: string;
	creatorUserId: string;
	categoryName: string;
	lastUpdatedTime: Date;
	owner: string;

	public constructor(init?: Partial<Record>) {
		init.releaseDate = new Date(init.releaseDate);
        Object.assign(this, init);
    }
}
