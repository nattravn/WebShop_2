import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClothingDialogComponent } from './clothing-dialog.component';

describe('ClothingComponent', () => {
	let component: ClothingDialogComponent;
	let fixture: ComponentFixture<ClothingDialogComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ClothingDialogComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ClothingDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
