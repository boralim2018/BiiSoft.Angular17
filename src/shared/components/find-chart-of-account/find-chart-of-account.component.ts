import { Component, Injector, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindChartOfAccountDialogComponent } from './find-chart-of-account-dialog.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { AccountTypeFilterInputDto, SubAccountTypeFilterInputDto } from '../../service-proxies/service-proxies';

@Component({
    selector: 'find-chart-of-account, [findChartOfAccount]',
    templateUrl: '../template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindChartOfAccountComponent),
            multi: true
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindChartOfAccountComponent extends FindComponentBase implements OnInit {

    @Input() accountTypeFilter: AccountTypeFilterInputDto;
    @Input() subAccountTypeFilter: SubAccountTypeFilterInputDto;
    @Input() excludeSubAccount: boolean;

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
        this.placeholder = this.l('Select_', this.l('ChartOfAccount'));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    find() {
        this._dialogService.open(FindChartOfAccountDialogComponent, {
            data: {
                multiple: this.multiple,
                accountTypeFilter: this.accountTypeFilter,
                subAccountTypeFilter: this.subAccountTypeFilter,
                excludeSubAccount: this.excludeSubAccount
            },
            header: this.l('FindChartOfAccounts'),
            styleClass: this.responsiveDialogClass + ' find-chart-of-account-dialog'
            })
            .onClose.subscribe(result => {
                this.mapFindResult(result);
            });
    }
}
