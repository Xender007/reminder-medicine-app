import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Medicine } from '../models/medicine.model';
import { MedReminderService } from '../services/med-reminder.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';

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
  medicineId : string = '';

  //confirmation
  popoverTitle = 'Popover title';
  popoverMessage = 'Popover description';
  confirmClicked = false;
  cancelClicked = false;

  constructor(
    public dialog: MatDialog,
    private medReminderService : MedReminderService,
    private activatedRoute : ActivatedRoute,
    private confirmService: NgConfirmService,
    ) {
      this.getAllMedicineByUser();
      this.dataSource = new MatTableDataSource(this.medicineList);
      // this.activatedRoute.queryParams.subscribe({
      //   next: (data) => {
      //     console.log(data);
      //     this.medicineId = data['id'];
      //   }
      // })
    }

  @ViewChild(MatTable,{static:true}) table!: MatTable<any>;

  @ViewChild(MatPaginator,{ static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

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
        if(error) {
          console.error(error);
        }
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

  addMedicinePopup() {
    this.dialog.open(MedicinePopup, {
      width: '60%'
    }).afterClosed().subscribe(result => {
        this.getAllMedicineByUser();
    });
  }

  //delete medicine
  onDeleteMedicine(medicineId : string) {
    var medInfo = new Medicine();
    medInfo._id = medicineId;

    this.medReminderService.deleteOneMedicine(medInfo).subscribe({
      next : (result) => {
        if(result) {
          this.getAllMedicineByUser();
        }
      },
      error : (error) => {

      }
    }); 
  }

  //edit medicine
  onEditMedicine(medData: any) {
    //medData['width'] = '60%';
    console.log(medData);
    this.dialog.open(MedicinePopup, 
    {data: medData, width: '60%'})
    .afterClosed().subscribe(() => {
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
  medNameval : string = '';
  medDoseval : string = '';
  medQtyval : string = '';

  selected : string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Medicine,
    private medReminderService : MedReminderService,
    private dialogRef: MatDialogRef<MedicinePopup>
  ) { }

  addMedicineForm = new FormGroup({
    medType: new FormControl('', [Validators.required]),
    medName : new FormControl('', [Validators.required]),
    dose : new FormControl('', [Validators.required]),
    qty : new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.data) {
      this.isEdit = !this.isEdit;
      console.log("popup data---------->>>",this.data);
      this.medNameval = this.data.medicineName;
      this.medDoseval = this.data.dose;
      this.medQtyval = this.data.quantity;
      this.selected = this.data.medicineType;
      // console.log(this.medNameval);
    }
  }

  
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
    else
    {
      return 'Medicine name already available.';
    }
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
        this.addMedicineForm.controls.medName.setErrors({'invalid': false});
        this.dialogRef.close();
      },
      error : (error) => {
        if(error.errorDetails.error)
        {
          this.invalidMedName = !this.invalidMedName;
          this.addMedicineForm.controls.medName.setErrors({'invalid': true});
          this.invalidMedName = error.errorDetails.error;
        } 
        //this.addMedicineForm.reset();
      }
    });
  }

  onEditMedicine() {
      var medInfo = new Medicine();
  
      medInfo.medicineType = this.addMedicineForm.value.medType!;
      medInfo.medicineName = this.addMedicineForm.value.medName!;
      medInfo.dose = this.addMedicineForm.value.dose!;
      medInfo.quantity = this.addMedicineForm.value.qty!;
      medInfo._id = this.data._id;
      
      console.log("----->>> total med",medInfo);

      this.medReminderService.UpdateOneMedicine(medInfo).subscribe({
        next: (data) => {
          this.addMedicineForm.controls.medName.setErrors({'invalid': false});
          this.dialogRef.close();
        },
        error : (error) => {
          if(error.errorDetails.error)
          {
            this.invalidMedName = error.errorDetails.error;
            this.addMedicineForm.controls.medName.setErrors({'invalid': true});
            this.invalidMedName = !this.invalidMedName;
          }
        }
      })
  }

}
