import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HomePageComponent } from './home-page/home-page.component';
import { AddMedicineComponent, MedicinePopup } from './add-medicine/add-medicine.component';
import { ReminderComponent, ReminderPopup } from './reminder/reminder.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgConfirmModule } from 'ng-confirm-box';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatNativeDateTimeModule, MatTimepickerModule } from "@dhutaryan/ngx-mat-timepicker";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    HomePageComponent,
    AddMedicineComponent,
    MedicinePopup,
    ReminderComponent,
    ReminderPopup
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    NgConfirmModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatNativeDateTimeModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
