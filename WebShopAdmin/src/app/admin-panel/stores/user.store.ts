import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { Observable, from, ReplaySubject, of, EMPTY } from 'rxjs';

import { User } from '../models/user.model';
import { RecordStore } from './record.store';
import { ClothingStore } from './clothing.store';
import { ShoeStore } from './shoe.store';
import { UserItem } from '../models/user-item.model';
import { environment } from '../../../environments/environment';
import { PagedUsers } from '../models/paged-users.model';
import { untilDestroyed } from '@ngneat/until-destroy';

class UserForm {
	email: string;
	userName: string;
	fullName: string;
	password: string;
	confirmPassword: string;
}

@Injectable({
	providedIn: 'root'
})
export class UserStore {

	userItem: UserItem = new UserItem();
	userItems: Array<UserItem> = [];
	userList: User[];

	private usersReplay: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
	public usersReplay$: Observable<User[]> = this.usersReplay.asObservable();

	private userReplay: ReplaySubject<User> = new ReplaySubject<User>(1);
	public userReplay$: Observable<User> = this.userReplay.asObservable();

	form: FormGroup = new FormGroup({
		email: new FormControl(''),
		userName: new FormControl(''),
		fullName: new FormControl(''),
		password: new FormControl(''),
		confirmPassword: new FormControl('')
	});

	readonly baseUrl = environment.userApiUrl;
	userStatus = 'Log in';

	formModel = this.fb.group({
		userName: ['', Validators.required],
		email: ['', Validators.email],
		fullName: [''],
		passwords: this.fb.group({
			password: ['', [Validators.required, Validators.minLength(4)]],
			confirmPassword: ['', Validators.required]
		}, { validator: this.comparePasswords }),
	});

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		private shoeStore: ShoeStore,
		private recordStore: RecordStore,
		private clothingStore: ClothingStore) {
		// this.getUserProfile().subscribe((resUser: User) => { });
	}

	comparePasswords(fb: FormGroup) {
		const confirmPswrdCtrl = fb.get('confirmPassword');
		// passwordMismatch
		// confirmPswrdCtrl.errors={passwordMismatch:true}
		if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
			if (fb.get('Password').value !== confirmPswrdCtrl.value) {
				confirmPswrdCtrl.setErrors({ passwordMismatch: true });
			} else {
				confirmPswrdCtrl.setErrors(null);
			}
		}
	}

	register() {
		const body = {
			userName: this.formModel.value.userName,
			email: this.formModel.value.email,
			fullName: this.formModel.value.fullName,
			password: this.formModel.value.passwords.password
		};
		return this.http.post(this.baseUrl + '/ApplicationUser/Register', body);
	}

	login(formData) {
		this.userStatus = 'Log out';
		console.log('formData: ', formData);
		return this.http.post(this.baseUrl + '/ApplicationUser/Login', formData);
	}

	getUserProfile(): Observable<User> {
		var tokenHeader = new HttpHeaders({'Authorization':'Bearer ' + localStorage.getItem('ACCESS_TOKEN')});
		return this.http.get<User>(this.baseUrl+'/UserProfile', {headers : tokenHeader});
	}

	getUsers(): Observable<User[]> {
		return this.http.get<User[]>(this.baseUrl + '/ApplicationUser').pipe(tap(items => {
			this.usersReplay.next(items);
		}));
	}

	getPagedUsers(route: string, limit: number, page: number): Observable<PagedUsers> {
		return this.http.get<PagedUsers>(`${this.baseUrl}/${route}/GetPagedUsers?limit=${limit}&page=${page}`).pipe(
			catchError(error => {
				console.error('Bad promise: ', error);
				return EMPTY;
			})
		);
	}

	roleMatch(allowedRoles): boolean {
		let isMatch = false;
		const payLoad = JSON.parse(window.atob(localStorage.getItem('ACCESS_TOKEN').split('.')[1]));
		const userRole = payLoad.role;
		allowedRoles.forEach(element => {
			if (userRole === element) {
				isMatch = true;
				return false;
			}
		});
		return isMatch;
	}

	removeItem(item) {
		if (confirm('Are you sure to delete this record?')) {
			if ('Record' === item.category) {
				this.recordStore.deleteRecord(item.id).subscribe(res => {
					this.recordStore.refreshList();
					console.log('record deleted');
				});
				// this.userItems
			} else if ('Clothing' === item.category) {
				this.clothingStore.deleteClothing(item.id).subscribe(res => {
					this.clothingStore.refreshList();
					console.log('record deleted');
				});
			} else if ('Shoe' === item.category) {
				this.shoeStore.deleteShoe(item.id).subscribe(res => {
					this.shoeStore.refreshList();
					console.log('record deleted');
				});
			}

			const index = this.userItems.findIndex(e => e.title === item.title);
			console.log('index: ', index);
			if (index > -1) {

				this.userItems.splice(index, 1);
			}
		}

	}

	addUserItem(item) {
		this.userItem = new UserItem();
		this.userItem.title = item.title;
		this.userItem.imagePath = item.imagePath;
		this.userItem.category = item.category;
		this.userItem.id = item.id;
		this.userItems.push(this.userItem);
	}

	refreshList() {
		this.http.get(this.baseUrl + '/ApplicationUser').toPromise().then(res => {
			this.userList = res as User[];
		});

		return from(this.http.get(this.baseUrl + +'/ApplicationUser').toPromise());
	}

	initializeFormGroup() {
		this.formModel.setValue({
			email: '',
			userName: '',
			fullName: '',
			passwords: {
				password: '',
				confirmPassword: ''
			}
		});
	}

	populateMenuForm(rec: any) {
		this.formModel.setValue({
			email: rec.email,
			userName: rec.userName,
			fullName: rec.fullName,
			passwords: {
				password: '',
				confirmPassword: ''
			}
		});
	}

	getRecordsByKeyWord(keyWord :string, property: string){
		//let params: URLSearchParams = new URLSearchParams();
		//params.set('user', keyWord);

		return this.http.get<User>(this.baseUrl + '/applicationUser/', {
			params: {
				searchQuery: keyWord
			}
		  }).pipe(
			catchError(error => {
				return of(null);
			})
		);
	}

	deleteUser(id: number) {
		return this.http.delete(this.baseUrl + '/ApplicationUser/' + id);
	}
}
