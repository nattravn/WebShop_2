import { HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


    constructor(private router: Router) {

    }

    intercept(req: import('@angular/common/http').HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('ACCESS_TOKEN') != null) {
            const clonedReq = req.clone({
                headers : req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'))
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => {},
                    err => {
                        if (err.status == 401) {
                            localStorage.removeItem('ACCESS_TOKEN');
                            this.router.navigateByUrl('/user/login');
                        } else if (err.status == 403) {
                            this.router.navigateByUrl('/forbidden');
                        }

                    }
                )
            );
        } else {
            return next.handle(req.clone());
        }
    }


}
