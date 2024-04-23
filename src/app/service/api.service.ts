import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FileData {
  fileName: string;
  fileUrl: string;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  getFolder(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/get-folders`).pipe();;
  }

  getFiles(folderPath: string):Observable<FileData[]> {
    return this.http.get<FileData[]>(`${this.apiUrl}/api/get-files?folder=${folderPath}`).pipe(
      // tap((data: any) => console.log('Arquivos da pasta:', data))
    )
  }

  GenerateInvoicePDF(folderName: string, fileName: string){
    return this.http.get(`${this.apiUrl}/api/get-file?folder=${encodeURIComponent(folderName)}&file=${encodeURIComponent(fileName)}`,{observe:'response',responseType:'blob'});  
  }

  // getOpenFileUrl(folderName: string, fileName: string): Observable<any> {
  //   const url = `${this.apiUrl}/api/open-file?folder=${encodeURIComponent(folderName)}&file=${encodeURIComponent(fileName)}`;
  //   console.log(url);
  //   return this.http.get<any>(url);
  // }

}
