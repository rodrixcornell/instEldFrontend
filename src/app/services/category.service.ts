import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category } from '../models/category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.baseUrl + '/categories';
  environment: any;

  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.url)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getCategoryById(id: number): Observable<Category> {
    return this.httpClient.get<Category>(this.url + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  saveCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(this.url, JSON.stringify(category), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  deleteCategory(category: Category) {
    return this.httpClient.delete<Category>(this.url + '/' + category.id, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error code : ${error.status}, ` + `message: ${error.message}`;
    }
    window.alert(error.error.message);
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
