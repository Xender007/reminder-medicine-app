import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MedReminderService } from '../services/med-reminder.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private router : Router,
    private medReminderService : MedReminderService, 
  ) {}

  onLogOut() {
    //localStorage.removeItem('token');
    this.medReminderService.logout().subscribe({
      next: (data) => { 
          if(data)
          {
            localStorage.clear();
            this.router.navigateByUrl('login');
          }
          //console.log("-------------->>>Data value",data);
      },
      error: (error) => { 

      },
  });




    
  }
}
