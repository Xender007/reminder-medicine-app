import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterUtilService {


  constructor(private http: HttpClient) { }

  public addUser(user: User): Observable<any> {
    return this.http.post(environment.baseUrl + '/addUser', user, {responseType: 'text'}).pipe(retry(1), catchError(this.handleError));
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

