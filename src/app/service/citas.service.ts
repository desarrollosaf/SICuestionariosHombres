import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, signal, inject, computed } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment'; 

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );
  constructor() {
    this.myAppUrl = enviroment.endpoint;
    this.myAPIUrl ='api/citas';
  }

   getCitas(fecha: String): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/getcitas/${fecha}`)
  }

}
