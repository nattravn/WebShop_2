import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from './custom.datepipe';

@NgModule({
	imports: [CommonModule],
	declarations: [CustomDatePipe],
	exports: [CustomDatePipe],
	providers: [CustomDatePipe],
})
export class PipeModuleModule {}
