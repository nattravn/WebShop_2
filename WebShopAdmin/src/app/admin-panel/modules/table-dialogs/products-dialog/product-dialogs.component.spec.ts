/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProductDialogsComponent } from './product-dialogs.component';

describe('ProductDialogsComponent', () => {
	let component: ProductDialogsComponent;
	let fixture: ComponentFixture<ProductDialogsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ProductDialogsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProductDialogsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
