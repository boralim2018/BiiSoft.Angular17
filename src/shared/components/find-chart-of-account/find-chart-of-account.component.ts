import { Component, Injector, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FindComponentBase } from 'shared/find-component-base';
import { FindChartOfAccountDialogComponent } from './find-chart-of-account-dialog.component';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { AccountType, AccountTypeFilterInputDto, SubAccountTypeFilterInputDto } from '../../service-proxies/service-proxies';
import { AccountTypeFilter, AccountTypes, SubAccountTypes } from '../../AppEnums';

@Component({
    selector: 'find-chart-of-account, [findChartOfAccount]',
    templateUrl: '../template/find-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FindChartOfAccountComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FindChartOfAccountComponent),
            multi: true,
        },
        DialogService
    ],
    standalone: true,
    imports: [NgIf, CheckboxModule, FormsModule, NgClass, NgFor]
})
export class FindChartOfAccountComponent extends FindComponentBase implements OnInit, OnChanges {

    @Input() accountType: AccountTypeFilter;
    @Input() excludeSubAccount: boolean;

    accountTypeFilter: AccountTypeFilterInputDto;
    subAccountTypeFilter: SubAccountTypeFilterInputDto;

    constructor(
        injector: Injector,
        private _dialogService: DialogService,
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initAccountTypeFitler();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['accountType'] && !changes['accountType'].firstChange) {
            this.initAccountTypeFitler();
        }
    }

    initAccountTypeFitler() {
        switch (this.accountType) {
            case AccountTypeFilter.CashBank:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Cash, AccountTypes.Bank], exclude: false });
                break;
            case AccountTypeFilter.AR:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.AccountReceivable], exclude: false });
                break;
            case AccountTypeFilter.Inventory:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Inventory], exclude: false });
                break;
            case AccountTypeFilter.CurrentAsset:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.CurrentAsset], exclude: false });
                break;
            case AccountTypeFilter.FixedAsset:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.FixedAsset], exclude: false });
                break;
            case AccountTypeFilter.NoneCurrentAsset:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.NoneCurrentAsset], exclude: false });
                break;
            case AccountTypeFilter.AP:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.AccountPayable], exclude: false });
                break;
            case AccountTypeFilter.CreditCard:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.CreditCard], exclude: false });
                break;
            case AccountTypeFilter.NoneCurrentLiability:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.NoneCurrentLiability], exclude: false });
                break;
            case AccountTypeFilter.Equity:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Equity], exclude: false });
                break;
            case AccountTypeFilter.RetainedEarning:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Equity], exclude: false });
                this.subAccountTypeFilter = new SubAccountTypeFilterInputDto({ ids: [SubAccountTypes.RetainedEarning], exclude: false });
                break;
            case AccountTypeFilter.Revenue:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Revenue, AccountTypes.OtherRevenue], exclude: false });
                break;
            case AccountTypeFilter.COGS:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.CostOfSale], exclude: false });
                break;
            case AccountTypeFilter.Expense:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Expense, AccountTypes.OtherExpense], exclude: false });
                break;
            case AccountTypeFilter.COGSExpense:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.CostOfSale, AccountTypes.Expense, AccountTypes.OtherExpense], exclude: false });
                break;
            case AccountTypeFilter.RevenueCOGSExpense:
                this.accountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Revenue, AccountTypes.OtherRevenue, AccountTypes.CostOfSale, AccountTypes.Expense, AccountTypes.OtherExpense], exclude: false });
                break;
        }
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
