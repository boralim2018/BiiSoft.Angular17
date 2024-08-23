import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindCountryDialogComponent } from './find-country-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-country, [findCountry]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindCountryComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindCountryComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.l('Country'));
    }

    ngOnInit() {
        super.ngOnInit();        
    }

    find() {
        this._dialogService.open(FindCountryDialogComponent, {
            data: {
                multiple: this.multiple
            },
            header: this.l('FindCountries'),
            styleClass: this.responsiveDialogClass + ' find-country-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
