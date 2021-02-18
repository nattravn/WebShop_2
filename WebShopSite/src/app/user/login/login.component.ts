import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserStore } from 'src/app/shared/stores/user.store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit {
    formModel = {
        userName: '',
        password: ''
    };
    constructor(private userStore: UserStore, private router: Router, private toastr: ToastrService) { }

    ngOnInit() {
        if (localStorage.getItem('token') != null) {
            this.router.navigateByUrl('/home');
        }
    }

    onSubmit(form: NgForm) {
        this.userStore.login(form.value).subscribe(
            (res: any) => {
                localStorage.setItem('token', res.token);
                this.router.navigateByUrl('/home');
            },
            err => {
                if (err.status === 400) {
                    this.toastr.error('Incorrect username or password.', 'Authentication failed.');
                } else {
                    console.log(err);
                }
            }
        );
    }

}
