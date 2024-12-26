import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindTaxDialogComponent } from './find-tax-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-tax, [findTax]',
    templateUrl: '../template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindTaxComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindTaxComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.optionLabel = 'taxName';
        this.placeholder = this.l('Select_', this.l('Tax'));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    find() {
        this._dialogService.open(FindTaxDialogComponent, {
            data: {
                multiple: this.multiple
            },
            header: this.l('FindTaxs'),
            styleClass: this.responsiveDialogClass + ' find-tax-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
