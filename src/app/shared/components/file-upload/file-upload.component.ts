import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileAttachment, Metadata } from './file-attachment.model';


@Component({
  selector: 'tru-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  loggedInUser: any;
  metadata: Metadata[] = [];

  @Input()
  // controlLabel = 'Upload supporting documents';

  @Input()
  chooseLabel = 'Browse';
  @Input()
  uploadLabel = 'Upload';
  @Input()
  cancelLabel = 'Clear';
  @Input()
  showUploadButton = false;
  @Input()
  showCancelButton = true;
  @Input()
  multiple;
  @Input()
  accept;
  @Input()
  maxFileSize = 100485760;
  @Input()
  previewWidth = 100;
  @Input()
  disabled = false;
  @Input()
  inputMetadata = [];

  @Input()
  inputFiles: FileAttachment[] = [];

  @Output()
  inputFilesUpdated: EventEmitter<any>;

  constructor() {
    this.inputFilesUpdated = new EventEmitter<any>();
  }

  /**
   * Function to check if file type is allowed or not
   * @param file: Input file object
   * @returns: true (fle type is allowed)/false (file type is not allowed)
   */
  isFileTypeAllowed(file): boolean {
    let fileExtension = file.name.split('.');
    fileExtension = fileExtension[fileExtension.length - 1];
    if (this.accept) {
      if ((file.type &&
        (-1 !== this.accept.indexOf(file.type.split('/')[0])
          || -1 !== this.accept.indexOf(file.type.split('/')[1])))
        || -1 !== this.accept.indexOf(fileExtension)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * Function to add file attachment object in array
   * @param file: Input file object
   */
  addFileObject(file) {
    const reader: FileReader = new FileReader();
    reader.onload = (e) => {
      const fileAttachment: FileAttachment = new FileAttachment();
      //any to string
      let fileContent: any = reader.result;
      fileContent = fileContent.split('base64,')[1];
      fileAttachment.content = fileContent;
      fileAttachment.name = file.name;
      fileAttachment.type = file.type !== '' ? file.type : `application/${file.name.split('.').pop()}`
      fileAttachment.size = file.size;
      fileAttachment.metadata = this.inputMetadata.concat(this.metadata);
      this.inputFiles.push(fileAttachment);
      this.onInputFilesUpdated(this.inputFiles);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Function to handle custom upload event when file is uploaded (upload button is enabled)
   * @param event : File upload event details
   */
  customOnFileUpload(event) {
    if (this.showUploadButton) {
      // Code to handle custom file upload event
      this.inputFiles = [];
      for (const file of event.files) {
        this.addFileObject(file);
      }
    }
  }

  /**
   * Function to handle file select event
   * @param event: File select event details (uploaded is disabled)
   */
  onFileSelect(event) {
    if (!this.showUploadButton) {
      for (const file of event.files) {
        if (this.isFileTypeAllowed(file)) {
          const indexOfExistingFile: number = this.inputFiles.findIndex(item => item.name === file.name);
          if (-1 !== indexOfExistingFile) {
            this.inputFiles.splice(indexOfExistingFile, 1);
          }
          this.addFileObject(file);
        }
      }
    }
  }

  /**
   * Function to handle clear all file event
   */
  onClearAll() {
    this.inputFiles.splice(0, this.inputFiles.length);
  }

  /**
   * Function to handle single file removal event
   * @param event: On file remove event details
   */
  onFileRemove(event) {
    const indexOfFileToBeRemoved = this.inputFiles.findIndex(item => item.name === event.file.name);
    this.inputFiles.splice(indexOfFileToBeRemoved, 1);
  }

  /**
   * Function to execute on update of files model.
   * @param event - Details of updated model.
   */
  onInputFilesUpdated(event) {
    this.inputFilesUpdated.emit(this.inputFiles);
  }

  ngOnInit() {
  }
}
