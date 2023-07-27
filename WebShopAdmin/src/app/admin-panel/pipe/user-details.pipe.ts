import { Pipe, PipeTransform } from '@angular/core';
import { UserStore } from '../stores/user.store';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Pipe({
	name: 'userDetails'
})
export class UserDetailsPipe implements PipeTransform {

	constructor(private userStore: UserStore) { }
	transform(userId: string, args?: any): Observable<User> {
		if(!userId){
			return;
		}
		return this.userStore.getUserProfileById(userId)
	}
}
