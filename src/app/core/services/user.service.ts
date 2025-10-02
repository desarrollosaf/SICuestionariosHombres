import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { Injectable, signal, inject, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { enviroment } from '../../../enviroments/enviroment'; 


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { 
    this.myAppUrl =  enviroment.endpoint;
    this.myAPIUrl = 'api/user';

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }

  }

  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myAPIUrl}/login`,user,{ withCredentials: true });
  }


  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}${this.myAPIUrl}/me`, {
      withCredentials: true
    });
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  setCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/cerrarsesion`, {}, {
      withCredentials: true
    });
  }

  getUserRfc(): string | null {
    return this.currentUserSubject.value?.rfc || null;
  }

}
