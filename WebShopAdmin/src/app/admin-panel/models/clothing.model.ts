export class Clothing {
    id: number;
    title: string;
    size: string;
    price: number;
    description: string;
    image: File;
    imagePath: string;
    categoryId: number;
    editorUserId: string;
    userName: string;
    subCategoryId: number;
    categoryName: string;
	releaseDate: Date;


	public constructor(init?: Partial<Clothing>) {
		init.releaseDate = new Date(init.releaseDate);
        Object.assign(this, init);
    }
}
