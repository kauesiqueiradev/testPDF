import { Component, EventEmitter } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileListComponent } from "./file-list/file-list.component";
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, FileListComponent, NgxExtendedPdfViewerModule]
})
export class AppComponent {
  fileOpened = new EventEmitter<{ fileName: string, fileUrl: string}>()

  constructor() { }

}
