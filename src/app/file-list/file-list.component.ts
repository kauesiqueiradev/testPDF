import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgxExtendedPdfViewerModule],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css'
})
export class FileListComponent implements OnInit{
  folders:  { name: string, icon: string }[] = [];
  selectedFolder: string = '';
  files: { fileName: string, fileUrl: string }[] = [];
  folderName: string = '';
  pdfUrl: string = '';

  @ViewChild('content') popupview !: ElementRef;
  
  public sectors: { name: string }[]= [];

  constructor( private fileService: ApiService,  private modalservice: NgbModal) { }
  
  ngOnInit(): void {
    this.getFolder();
  }

  getFolder() {
    this.fileService.getFolder().subscribe(
      data => {
          this.folders = data.folders.filter((folder: string) => {
            return !folder.match(/ARQUIVO MORTO|Auditoria de Artes \(Líderes\)/i);
          }).map((folder: string, index: number) => {
            if (this.sectors[index]) {
              console.log("pastas:", folder);
              return { name: folder };
            } else {
              return { name: folder };
            }
          })
        }
    )
  }

  toggleFiles(folderName: string) {
    if (this.selectedFolder === folderName) {
      this.selectedFolder = '';
    } else {
      this.selectedFolder = folderName;
      this.getFiles(folderName);
    }
  }

  isOpenFolder(folderName: string): boolean {
    return this.selectedFolder === folderName;
  }

  getFilesForFolder(folderName: string): { fileName: string, fileUrl: string }[] {
    return this.isOpenFolder(folderName) ? this.files : [];
  }

  getFiles(folderName: string) {
    this.fileService.getFiles(folderName).subscribe(
      (data: any) => {
        console.log(data);
        const pdfFiles = data.files.filter((fileData: { fileName: string; }) => {
          return fileData.fileName.toLowerCase().endsWith('.pdf');
        });

        if (pdfFiles.length > 0) {
          this.files = pdfFiles;
          console.log(this.files);
        } else {
          this.files = [];
          console.error("Não há arquivos PDF nesta pasta.");
        }
      },
      error => {
        console.error("Erro ao obter arquivos:", error);
      }
    );
  }

  // openPDF(folderName: string, fileName: string): void {
  //   this.pdfViewerComponent?.openPdf(folderName, fileName);
  // }

  PreviewInvoice(folderName: string, fileName: string) {
    this.fileService.GenerateInvoicePDF(folderName, fileName).subscribe(
      (res: any) => {
        let blob: Blob = res.body as Blob;
        let url = window.URL.createObjectURL(blob);
        this.pdfUrl = url;
        this.modalservice.open(this.popupview, { size: 'lg' });
      },
      (error: any) => {
        console.error('Erro ao gerar o PDF do fatura:', error);
      }
    );
  }
}
