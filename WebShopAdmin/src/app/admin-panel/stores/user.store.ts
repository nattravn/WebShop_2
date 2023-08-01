import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { EMPTY, from, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PagedUsers } from '@admin-panel/models/paged-users.model';
import { UserItem } from '@admin-panel/models/user-item.model';
import { User } from '@admin-panel/models/user.model';
import { environment } from '@environments/environment';

import { ClothingStore } from './clothing.store';
import { RecordStore } from './record.store';
import { ShoeStore } from './shoe.store';

export interface IUserForm {
	email: FormControl<string>;
	userName: FormControl<string>;
	fullName: FormControl<string>;
	passwords: FormGroup<IUserPasswords>;
}

export interface IUserPasswords {
	password: FormControl<string>;
	confirmPassword: FormControl<string>;
}

@Injectable({
	providedIn: 'root',
})
export class UserStore {
	public userItem: UserItem = new UserItem();
	public userItems: Array<UserItem> = [];
	public userList: User[];

	public userStatus = 'Log in';

	// public formModel = this.fb.group<IUserForm>({
	// 	userName: ['', Validators.required],
	// 	email: new FormControl('', Validators.required),
	// 	fullName: [''],
	// 	passwords: this.fb.group<IUserPasswords>(
	// 		{
	// 			password: ['', [Validators.required, Validators.minLength(4)]],
	// 			confirmPassword: ['', Validators.required],
	// 		},
	// 		{ validator: this.comparePasswords },
	// 	),
	// });

	public userForm = new FormGroup<IUserForm>({
		email: new FormControl('', Validators.required),
		userName: new FormControl('', Validators.email),
		fullName: new FormControl('', Validators.required),
		passwords: new FormGroup<IUserPasswords>(
			{
				password: new FormControl('', { nonNullable: true }),
				confirmPassword: new FormControl('', { nonNullable: true }),
			},
			{ validators: this.comparePasswords },
		),
	});

	private readonly baseUrl = environment.userApiUrl;

	private usersReplay: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

	constructor(
		private http: HttpClient,
		private shoeStore: ShoeStore,
		private recordStore: RecordStore,
		private clothingStore: ClothingStore,
	) {
		// this.getUserProfile().subscribe((resUser: User) => { });
	}

	public register() {
		const body = {
			userName: this.userForm.value.userName,
			email: this.userForm.value.email,
			fullName: this.userForm.value.fullName,
			password: this.userForm.value.passwords.password,
		};
		return this.http.post(`${this.baseUrl}/ApplicationUser/Register`, body);
	}

	public login(formData) {
		this.userStatus = 'Log out';
		console.log('formData: ', formData);
		return this.http.post(`${this.baseUrl}/ApplicationUser/Login`, formData);
	}

	public getUserProfile(): Observable<User> {
		const tokenHeader = new HttpHeaders({ authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` });
		return this.http.get<User>(`${this.baseUrl}/UserProfile`, { headers: tokenHeader });
	}

	public getUserProfileById(userId: string): Observable<User> {
		const tokenHeader = new HttpHeaders({ authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` });
		return this.http.get<User>(`${this.baseUrl}/ApplicationUser/${userId}`, { headers: tokenHeader });
	}

	public getUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${this.baseUrl}/ApplicationUser`).pipe(
			tap((items) => {
				this.usersReplay.next(items);
			}),
		);
	}

	public getPagedUsers(
		route: string,
		limit: number,
		page: number,
		column: string,
		direction: string,
	): Observable<PagedUsers> {
		return this.http
			.get<PagedUsers>(`${this.baseUrl}/${route}/GetPagedUsers`, {
				params: {
					limit: limit.toString(),
					page: page.toString(),
					key: column,
					order: direction,
				},
			})
			.pipe(
				catchError((error) => {
					console.error('Bad promise: ', error);
					return EMPTY;
				}),
			);
	}

	public roleMatch(allowedRoles): boolean {
		let isMatch = false;
		const payLoad = JSON.parse(window.atob(localStorage.getItem('ACCESS_TOKEN').split('.')[1]));
		const userRole = payLoad.role;
		allowedRoles.forEach((element) => {
			if (userRole === element) {
				isMatch = true;
				return false;
			}
		});
		return isMatch;
	}

	public removeItem(item) {
		if (confirm('Are you sure to delete this record?')) {
			if ('Record' === item.category) {
				this.recordStore.deleteRecord(item.id).subscribe((res) => {
					this.recordStore.refreshList();
					console.log('record deleted');
				});
				// this.userItems
			} else if ('Clothing' === item.category) {
				this.clothingStore.deleteClothing(item.id).subscribe((res) => {
					this.clothingStore.refreshList();
					console.log('record deleted');
				});
			} else if ('Shoe' === item.category) {
				this.shoeStore.deleteShoe(item.id).subscribe((res) => {
					this.shoeStore.refreshList();
					console.log('record deleted');
				});
			}

			const index = this.userItems.findIndex((e) => e.title === item.title);
			console.log('index: ', index);
			if (index > -1) {
				this.userItems.splice(index, 1);
			}
		}
	}

	public refreshList() {
		this.http
			.get(`${this.baseUrl}/ApplicationUser`)
			.toPromise()
			.then((res) => {
				this.userList = res as User[];
			});

		return from(this.http.get(this.baseUrl + +'/ApplicationUser').toPromise());
	}

	public initializeFormGroup() {
		this.userForm.setValue({
			email: '',
			userName: '',
			fullName: '',
			passwords: {
				password: '',
				confirmPassword: '',
			},
		});
	}

	public populateMenuForm(rec: any) {
		this.userForm.setValue({
			email: rec.email,
			userName: rec.userName,
			fullName: rec.fullName,
			passwords: {
				password: '',
				confirmPassword: '',
			},
		});
	}

	public getUsersByKeyWord(keyWord: string, property: string) {
		// let params: URLSearchParams = new URLSearchParams();
		// params.set('user', keyWord);

		return this.http
			.get<User>(`${this.baseUrl}/applicationUser/`, {
				params: {
					searchQuery: keyWord,
				},
			})
			.pipe(
				catchError((error) => {
					console.error(error);
					return of(null);
				}),
			);
	}

	public deleteUser(id: number) {
		return this.http.delete(`${this.baseUrl}/ApplicationUser/${id}`);
	}

	private comparePasswords(fb: FormGroup<IUserPasswords>): ValidatorFn {
		const confirmPswrdCtrl = fb.get('confirmPassword');
		return (form: FormGroup): ValidationErrors | null => {
			// passwordMismatch
			// confirmPswrdCtrl.errors={passwordMismatch:true}
			if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
				if (fb.get('Password').value !== confirmPswrdCtrl.value) {
					confirmPswrdCtrl.setErrors({ passwordMismatch: true });
					return { passwordMismatch: true };
				} else {
					confirmPswrdCtrl.setErrors(null);
					return { passwordMismatch: false };
				}
			}
			return null;
		};
	}

	// private addUserItem(item) {
	// 	this.userItem = new UserItem();
	// 	this.userItem.title = item.title;
	// 	this.userItem.imagePath = item.imagePath;
	// 	this.userItem.category = item.category;
	// 	this.userItem.id = item.id;
	// 	this.userItems.push(this.userItem);
	// }
}
