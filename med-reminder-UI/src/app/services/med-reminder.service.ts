import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, delay } from 'rxjs/operators';
import { Medicine } from '../models/medicine.model';

@Injectable({
  providedIn: 'root'
})
export class MedReminderService {

  
  constructor(private http: HttpClient) { }

  public addUser(user: User): Observable<any> {
    return this.http.post(environment.baseUrl + '/addUser', user, {responseType: 'text'}).pipe(retry(1), catchError(this.handleError));
  }

  public login(user: User): Observable<any> {
    return this.http.post(environment.baseUrl + '/login', user, {responseType: 'json'}).pipe(retry(1) ,delay(1000), catchError(this.handleError));
  }

  public logout(): Observable<any> {
    return this.http.get(environment.baseUrl + '/logout',{responseType: 'text'}).pipe(retry(1), catchError(this.handleError));
  }

  public addMedicine(med : Medicine): Observable<any> {
    console.log("adding medicine from service page ------------------>>>> called----->>>>");
    return this.http.post(environment.baseUrl + '/addMedicinenew', med, {responseType: 'text' as 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  public deleteOneMedicine(med: Medicine): Observable<any> {
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('_id', med._id);
    return this.http.delete(environment.baseUrl + '/deletemedicine', {headers: headers}).pipe(retry(1), catchError(this.handleError));
  }

  public UpdateOneMedicine(medData: Medicine): Observable<any> {
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(environment.baseUrl + '/updatemedicine', medData, {headers: headers}).pipe(retry(1), catchError(this.handleError));
  }

  public getMedicine(med : Medicine): Observable<any> {
    let headers: any = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('userId', med.userId);
    return this.http.get(environment.baseUrl + '/getmedicine' , {headers: headers}).pipe(retry(1), catchError(this.handleError));
  }

  


  handleError(error:any) {
    let errorMessage = '';
    let errorDetails : any;
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nReason: ${error.error} \nMessage: ${error.message}`;
      errorDetails = error;
    }
    console.log(errorMessage,errorDetails);
    return throwError(() => {
        return {errorMessage, errorDetails};
    });
  }

}
