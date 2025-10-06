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
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/gethorarios/${fecha}`)
  }

  saveCita(data:any): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/savecita/`,data)
  }

  getcitaRFC(rfc: String): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/getcitaservidor/${rfc}`)
  }

  groupCitas(): Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/citasagrupadas`)
  }

  getCitasFecha(fecha: string, rfc: string): Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/getcitasfecha/${fecha}/${rfc}`)
  }

   generarPDF(fecha:string, sedeID: number): Observable<Blob> {
    return this.http.get(`${this.myAppUrl}${this.myAPIUrl}/pdf/${fecha}/${sedeID}`, {
      responseType: 'blob',
    });
  }

  generarEXCEL(fecha:string, sedeID: number): Observable<Blob> {
    return this.http.get(`${this.myAppUrl}${this.myAPIUrl}/exel/${fecha}/${sedeID}`, {
      responseType: 'blob',
    });
  }

    

}
