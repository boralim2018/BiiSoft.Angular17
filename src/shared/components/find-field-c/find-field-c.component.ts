import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindFieldCDialogComponent } from './find-field-c-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-field-c, [findFieldC]',
    templateUrl: '../template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindFieldCComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindFieldCComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.l('FieldC'));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    find() {
        this._dialogService.open(FindFieldCDialogComponent, {
            data: {
                multiple: this.multiple
            },
            header: this.l('FindFieldCs'),
            styleClass: this.responsiveDialogClass + ' find-field-c-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
