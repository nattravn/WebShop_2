import { PipeTransform, Pipe } from '@angular/core';
import { Record } from './shared/models/record.model';

@Pipe({
    name: 'recordsFilter'
})
export class RecordsFilterPipe implements PipeTransform {
    transform(record: Record[],  searchTerm: string): Record[] {
        if (!record || !searchTerm) {
            return record;
        }

        return record.filter(item =>
            item.band.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase()) !== -1);
    }
}
