import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { authGuard, loginGuard } from './shared/authguard.guard';
import { AddMedicineComponent } from './add-medicine/add-medicine.component';
import { ReminderComponent } from './reminder/reminder.component';


const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch : 'full'},
    { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },
    { path: 'login', component : LoginComponent, canActivate: [loginGuard]},
    { path: 'home', component: HomePageComponent, canActivate: [authGuard]},
    { path: 'medicine', component: AddMedicineComponent, canActivate: [authGuard]},
    { path: 'reminder', component: ReminderComponent, canActivate: [authGuard]},
    { path: '**', redirectTo: 'login', pathMatch : 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
