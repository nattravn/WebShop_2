import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';


const routes: Routes = [

    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},

    { path: 'forbidden', component: ForbiddenComponent},

    { path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
    },
    { path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
