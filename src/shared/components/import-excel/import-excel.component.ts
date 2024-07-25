import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { Mixin } from 'ts-mixer';
import { ExcelFileComponentBase } from '../../app-component-base';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgForm, FormsModule } from '@angular/forms';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { BusyDirective } from '../../directives/busy.directive';

@Component({
    selector: 'app-import-excel',
    templateUrl: './import-excel.component.html',
    styleUrls: ['./import-excel.component.scss'],
    standalone: true,
    imports: [FormsModule, BusyDirective, ButtonDirective, Ripple, LocalizePipe]
})
export class ImportExcelComponent extends Mixin(ExcelFileComponentBase, DynamicDialogBase) implements OnInit {

    @Output() download: EventEmitter<any> = new EventEmitter<any>();
    @Output() upload: EventEmitter<any> = new EventEmitter<any>();

    constructor(injector: Injector,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    close() {
        this._dialogRef.close();
    }

    onUpload(file: HTMLInputElement) {
        this.importExcel(file.files[0], result => this.upload.emit(result));
    }

    onDownload() {
        this.download.emit(true);
    }

    onFileChange(e, file: HTMLInputElement, fn: HTMLElement) {
        fn.innerHTML = file.files && file.files.length ? file.files[0].name : this.l('SelectTemplate');

    }
}
