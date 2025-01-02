import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindFieldBDialogComponent } from './find-field-b-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-field-b, [findFieldB]',
    templateUrl: '../template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindFieldBComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindFieldBComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.l('FieldB'));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    find() {
        this._dialogService.open(FindFieldBDialogComponent, {
            data: {
                multiple: this.multiple
            },
            header: this.l('FindFieldBs'),
            styleClass: this.responsiveDialogClass + ' find-field-b-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
