import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecordDialogComponent } from './record-dialog.component';

describe('RecordDialogComponent', () => {
  let component: RecordDialogComponent;
  let fixture: ComponentFixture<RecordDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
