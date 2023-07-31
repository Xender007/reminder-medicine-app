import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { Medicine } from '../models/medicine.model';
import { MedReminderService } from '../services/med-reminder.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort';

export interface MedData {
  medicineName: string;
  dose: string;
  quantity: string;
}



@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.css']
})
export class AddMedicineComponent implements AfterViewInit  {

  medicineList : any;
  isMedList : boolean = false;
  displayedColumns: string[] = ['medicineName', 'dose', 'quantity', 'action'];
  dataSource!: MatTableDataSource<MedData>;
  

  constructor(
    public dialog: MatDialog,
    private medReminderService : MedReminderService
    ) {
      this.getAllMedicineByUser();
      this.dataSource = new MatTableDataSource(this.medicineList);
    }

  @ViewChild(MatTable,{static:true}) table!: MatTable<any>;

  @ViewChild(MatPaginator,{ static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    //this.getAllMedicineByUser();
    setTimeout(() => this.dataSource.paginator = this.paginator);
  }

  getAllMedicineByUser() {
    var medInfo = new Medicine();
    medInfo.userId = localStorage.getItem('_id')!;
    this.medReminderService.getMedicine(medInfo).subscribe({
      next: (data) => { 
          if(data)
          {
            this.medicineList = data.result;
            this.dataSource = new MatTableDataSource(this.medicineList);
            this.table.renderRows();
            this.paginator.length = this.medicineList.length;
            this.dataSource.paginator = this.paginator
            console.log(data.result);
            this.isMedList = false;
          }
          else
          {
            this.isMedList = true;
          }
          //console.log("-------------->>>Data value",data);
      },
      error: (error) => { 

      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  openDialog() {

  }

  addMedicine() {
    this.dialog.open(MedicinePopup, {
      width: '60%'
    }).afterClosed().subscribe(result => {
        this.getAllMedicineByUser();
    });
  }

}

@Component({
  selector: 'add-medicine-popup',
  templateUrl: 'add-medicine-popup.html',
  styleUrls: ['./add-medicine.component.css'],
})
export class MedicinePopup {

  invalidMedName : boolean = false;
  isEdit : boolean = false;
  medicineTypeList = [
    { text: 'None' },
    { value: 'tablet', text: 'Tablet', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg', },
    { value: 'capsule', text: 'Capsule', img: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg', },
    { value: 'injection', text: 'Injection' },
    { value: 'syrup', text: 'Syrup' }
  ];

  constructor(
    private medReminderService : MedReminderService,
  ) { }

  addMedicineForm = new FormGroup({
    medType: new FormControl('', [Validators.required]),
    medName : new FormControl('', [Validators.required]),
    dose : new FormControl('', [Validators.required]),
    qty : new FormControl('', [Validators.required]),
  });

  
  get medType() {
    return this.addMedicineForm.get('medType');
  }

  get medName() {
    return this.addMedicineForm.get('medName');
  }

  get dose() {
    return this.addMedicineForm.get('dose');
  }

  get qty() {
    return this.addMedicineForm.get('qty');
  }

  getMedTypeErrorMessage() {
    if (this.addMedicineForm.controls.medType.hasError('required')) {
      return 'You must select a medicine type';
    }
    return 0;
  }

  getMedNameErrorMessage() {
    if (this.addMedicineForm.controls.medName.hasError('required')) {
      return 'You must enter a medicine name';
    }
    return 0;
  }

  getDoseErrorMessage() {
    if (this.addMedicineForm.get('dose')?.hasError('required')) {
      return 'You must enter a medicine dose';
    }
    return 0;
  }

  getQtyErrorMessage() {
    if (this.addMedicineForm.controls.qty.hasError('required')) {
      return 'You must enter a medicine quantity';
    }
    return 0;
  }


  
  onAddMedSubmit() {
    var medInfo = new Medicine();

    medInfo.medicineType = this.addMedicineForm.value.medType!;
    medInfo.medicineName = this.addMedicineForm.value.medName!;
    medInfo.dose = this.addMedicineForm.value.dose!;
    medInfo.quantity = this.addMedicineForm.value.qty!;
    medInfo.userId = localStorage.getItem('_id')!;
    
    console.log("----->>> total med",medInfo);

    this.medReminderService.addMedicine(medInfo).subscribe({
      next: (data) => {
        //spinner add later.

      },
      error : (error) => {
        if(error.errorDetails.error)
        {
          this.invalidMedName = error.errorDetails.error;
          this.invalidMedName = !this.invalidMedName;
        } 
        this.addMedicineForm.reset();
      }
    });
  }

}
