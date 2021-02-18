import { Component, OnInit } from '@angular/core';
import { UserStore } from 'src/app/shared/stores/user.store';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styles: []
})
export class RegistrationComponent implements OnInit {

    constructor(public userStore: UserStore, private toaster: ToastrService) { }
    ngOnInit() { }

    onSubmit() {
        this.userStore.register().subscribe(
            (res: any) => {
                if (res.Succeeded) {
                    this.userStore.formModel.reset();
                    this.toaster.success('New user created!', 'Registartion successful');
                } else {
                    res.Errors.forEach(element => {
                        switch (element.code) {
                            case 'DuplicateUserName':
                                this.toaster.error('User is already taken', 'Register faild');
                                // Username is already taken
                                break;

                            default:
                                this.toaster.error(element.description, 'User is already taken');
                                // Registartion faild
                                break;
                        }
                    });
                }
            },
            err => {
                console.log(err);
            }
        );
    }

}
