import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { RegisterUtilService } from '../services/register-util.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isEmailInUse : boolean = false;
  emailInUseMsg : string = '';

  constructor(
    private registerService : RegisterUtilService,
    public dialog: MatDialog
  ) {
  
  }

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    phoneNumber: new FormControl('',[Validators.required,Validators.pattern("[+]{1}[0-9]{11,15}")]),
    cbxtnc: new FormControl(false,[Validators.requiredTrue])
  });

  get name() {
    return this.registrationForm.get('name');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get phoneNumber() {
    return this.registrationForm.get('phoneNumber');
  }

  get cbxtnc() {
    return this.registrationForm.get('cbxtnc');
  }



  openDialog() {
    this.dialog.open(DialogElementsExampleDialog);
  }

  onSubmit() {

    console.log(this.registrationForm.value.email, this.registrationForm.value.password);

    const salt = bcrypt.genSaltSync(10);
    var pass = bcrypt.hashSync(this.registrationForm.value.password!, salt);

    console.log('------------->>>',pass);
    //password from register page 12345678
    //var result = bcrypt.compareSync(this.registrationForm.value.password!, '$2a$10$cexCz4pD6kXScIX.JeLTlOtMxOs3bCE5.MB2JMBfPuPy8c/S4FLFm');
    //console.log('Login Status ----->> ',result);
    
    console.log('button clicked');

    var userInfo = new User();
    userInfo.name = this.registrationForm.value.name!;
    userInfo.email = this.registrationForm.value.email!;
    userInfo.password = pass;
    userInfo.contactNumber = this.registrationForm.value.phoneNumber!;

    this.registerService.addUser(userInfo).subscribe({
      next: (data) => { 
          if(data)
          {
            this.registrationForm.reset();
          }
          //console.log("-------------->>>Data value",data);
       },
      error: (error) => { 
        if(error.errorDetails.error)
        {
          this.emailInUseMsg = error.errorDetails.error;
          this.isEmailInUse = !this.isEmailInUse;
        } 
        console.log(error.errorDetails.error)
      },
  })

    // this.registerService.addUser(userInfo).subscribe((data)=>{
    //   console.log(data);

    // },
    // (error) => { // this is the error
    //   if(error.errorDetails.error)
    //   {
    //     this.emailInUseMsg = error.errorDetails.error;
    //     this.isEmailInUse = !this.isEmailInUse;
    //   } 
    //   //console.log(error.errorDetails.error)
    // }
    // );


    console.log('-------------->>> userInfo', userInfo);


  }
}
