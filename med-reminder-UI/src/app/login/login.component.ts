import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MedReminderService } from '../services/med-reminder.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import cryptoRandomString from 'crypto-random-string';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public isInvalidCredentials: boolean = false;
  public inValidCredentials: string = 'Invalid Credentials';
  showPass: boolean = false;

  constructor(
    private medReminderService : MedReminderService,
    private router: Router
  ) { }
  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('', [Validators.required])
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOninit() {
    
  }

  onShowHidePassClick() {
    this.showPass = !this.showPass;
  }

  onSubmit() {
    var userInfo = new User();

    userInfo.email = this.loginForm.value.email!;
    userInfo.password = this.loginForm.value.password!;

    this.medReminderService.login(userInfo).subscribe({
        next: (data) => { 
            if(data)
            {
              console.log(data);
              var token = cryptoRandomString({length: 30, type: 'base64'});
              localStorage.setItem("token", token);
              localStorage.setItem("_id",data.userId)
              this.router.navigateByUrl('home');
            }
            //console.log("-------------->>>Data value",data);
        },
        error: (error) => { 
          if(error.errorDetails.error)
          {
            this.inValidCredentials = error.errorDetails.error;
            this.isInvalidCredentials = true;
          } 
          this.loginForm.reset();
          //console.log(error.errorDetails.error)
        },
    });



  }
}
