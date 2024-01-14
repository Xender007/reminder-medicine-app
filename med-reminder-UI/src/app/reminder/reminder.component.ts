import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';


@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent {

  constructor(
    public dialog: MatDialog,
  ) {}

  addMedicinePopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.hasBackdrop = false;

    const dialogRef = this.dialog.open(ReminderPopup, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result here if needed
    });


    // this.dialog.open(ReminderPopup, {
    //   width: '60%',
    // }).afterClosed().subscribe(result => {
    //     //this.getAllMedicineByUser();
    // });
  }
}

@Component({
  selector: 'add-reminder-popup',
  templateUrl: './add-reminder-popup.html',
  styleUrls: ['./reminder.component.css'],

})
export class ReminderPopup {

  constructor(private dialogRef: MatDialogRef<ReminderPopup>) {}

  reminderPopup = new FormGroup({
    medType: new FormControl('', [Validators.required]),
    medName : new FormControl('', [Validators.required]),
    dose : new FormControl('', [Validators.required]),
    qty : new FormControl('', [Validators.required]),
  });

  get medType() {
    return this.reminderPopup.get('medType');
  }

  get medName() {
    return this.reminderPopup.get('medName');
  }

  getMedTypeErrorMessage() {
    if (this.reminderPopup.controls.medType.hasError('required')) {
      return 'You must select a medicine type';
    }
    return 0;
  }

  onAddReminder() {

  }
}
