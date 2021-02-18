import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShoeDialogFormComponent } from './shoe-dialog-form.component';

describe('ShoeComponent', () => {
  let component: ShoeDialogFormComponent;
  let fixture: ComponentFixture<ShoeDialogFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoeDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoeDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
