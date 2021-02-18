import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    // { path: 'registration', component: RegistrationComponent},
    { path: 'login', component: LoginComponent},
    { path: 'profile', component: ProfileComponent},
    // { path: 'record', component: RecordComponent, outlet: 'category'},
    // { path: 'record', component: RecordComponent}
];

export const UserRoutes = RouterModule.forChild(routes);
