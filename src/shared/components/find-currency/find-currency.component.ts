import { Component, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindCurrencyDialogComponent } from './find-currency-dialog.component';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';

@Component({
    selector: 'find-currency, [findCurrency]',
    templateUrl: '../find-template/find-template.component.html',
    providers: [DialogService],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindCurrencyComponent extends FindComponentBase implements OnInit {

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.placeholder = this.l('Select_', this.l('Currency'));
        this.optionLabel = 'code'; 
    }

    find() {
        this._dialogService.open(FindCurrencyDialogComponent, {
            data: {
                multiple: this.multiple
            },
            header: this.l('FindCurrencies'),
            styleClass: this.responsiveDialogClass + ' find-currency-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
