import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
    {path: '', component: HomePageComponent},
    { path: 'register', component: RegisterPageComponent},
    { path: 'main', component: MainPageComponent}
];
