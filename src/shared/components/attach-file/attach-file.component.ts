import { Component, Injector, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { BFileComponentBase } from '../../app-component-base';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { SafeUrlPipe } from '../../pipes/safe-resource-url.pipe';
import { UploadSource } from '../../AppEnums';
import { AppConsts } from '../../AppConsts';

@Component({
    selector: 'attach-file, [attachFile]',
    templateUrl: './attach-file.component.html',
    standalone: true,
    imports: [NgIf, NgClass, FormsModule, ButtonModule, ButtonDirective, SafeUrlPipe ]
})
export class AttachFileComponent extends BFileComponentBase implements OnInit, OnChanges {

    @Input() label: string = this.l('File');
    @Input() styleClass: string = 'attachment-box';
    @Input() uploadSource: number = UploadSource.Attachment; 
    @Input() acceptType: string = 'image/*';
    @Input() uploadUrl: string = '/BFile/Upload';
    @Input() blankImageUrl: string = AppConsts.blankImageUrl;
    @Input() fileId: string;
    @Output() fileIdChange: EventEmitter<string> = new EventEmitter<string>();
  
    fileUrl: string = this.blankImageUrl;

    constructor(
        injector: Injector) {
        super(injector);

    }

    ngOnInit() {
        this.loadFile();    
    }

    ngOnChanges(changes: SimpleChanges) {
        //if (changes['fileId'] && !changes['fileId'].firstChange) {
        //    this.loadFile();
        //}
    }

    loadFile() {
        if (this.fileId) {
            this.download(this.fileId, "blob", (result) => {
                this.fileUrl = window.URL.createObjectURL(result);
            });
        }
        else {
            this.fileUrl = this.blankImageUrl;
        }
    }

    fileChange(event: Event) {
        let file = event.currentTarget as HTMLInputElement;
        if (file && file.files.length) {
            this.fileUrl = window.URL.createObjectURL(file.files[0]);
        }
    }

    clearUpload(file: HTMLInputElement) {
        file.value = '';
        this.loadFile();
    }

    uploadFile(file: HTMLInputElement) {
        if (file && file.files.length) {
            this.upload(file.files[0], this.uploadSource, (result) => {
                if (result && result.id) {
                    this.fileId = result.id;
                    this.fileIdChange.emit(this.fileId);
                    this.clearUpload(file);
                    this.notify.info(this.l('SavedSuccessfully'));
                }
            })
        }
    }
}
