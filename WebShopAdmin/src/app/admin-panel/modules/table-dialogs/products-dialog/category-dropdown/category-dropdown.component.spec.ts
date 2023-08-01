import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoryDropdownComponent } from './category-dropdown.component';

describe('CategoryPanelComponent', () => {
	let component: CategoryDropdownComponent;
	let fixture: ComponentFixture<CategoryDropdownComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [CategoryDropdownComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CategoryDropdownComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
