import { Component, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindCountryDialogComponent } from './find-country-dialog.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-country, [findCountry]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [DialogService],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindCountryComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('Country'));
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
