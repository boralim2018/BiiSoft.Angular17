import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { ItemSettingDto, ItemServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FindChartOfAccountComponent } from '../../../../shared/components/find-chart-of-account/find-chart-of-account.component';
import { SelectLengthUnitComponent, SelectVolumeUnitComponent, SelectWeightUnitComponent, SelectAreaUnitComponent } from '../../../../shared/components/select-unit/select-unit.component';
import { DividerModule } from 'primeng/divider';
import { NgIf } from '@angular/common';
import { AppConsts } from '../../../../shared/AppConsts';
import { AccountTypeFilter } from '../../../../shared/AppEnums';

@Component({
    selector: 'app-item-setting',
    templateUrl: './item-setting.component.html',
    styleUrl: './item-setting.component.scss',
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [
        FormsModule, NgIf, InputSwitchModule, ButtonModule, ButtonDirective, InputTextModule, FindChartOfAccountComponent,
        SelectWeightUnitComponent, SelectVolumeUnitComponent, SelectLengthUnitComponent, SelectAreaUnitComponent, DividerModule
    ]
})
export class ItemSettingComponent extends AppComponentBase implements OnInit {

    model: ItemSettingDto;
    saving: boolean;
    loading: boolean = true;

    inventoryAccount: any;
    assetAccount: any;
    expenseAccount: any;
    cogsAccount: any;
    revenueAccount: any;

    revenueAccountType: AccountTypeFilter = AccountTypeFilter.Revenue;
    cogsAccountType: AccountTypeFilter = AccountTypeFilter.COGS;
    assetAccountType: AccountTypeFilter = AccountTypeFilter.FixedAsset;
    expenseAccountType: AccountTypeFilter = AccountTypeFilter.Expense;
    inventoryAccountType: AccountTypeFilter = AccountTypeFilter.Inventory;

    chartOfAccountEnable: boolean = this.feature.isEnabled("App.Accounting.ChartOfAccounts");

    constructor(
        injector: Injector,
        public _itemService: ItemServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getModel();
    }

    getModel() {
        this.model = ItemSettingDto.fromJS({
            weightUnit : AppConsts.WeightUnit.value,
            lengthUnit : AppConsts.LengthUnit.value,
            areaUnit : AppConsts.AreaUnit.value,
            volumeUnit : AppConsts.VolumeUnit.value,
        });
        this.loading = true;
        this._itemService.getItemSetting()
            .pipe(finalize(() => this.loading = false))
            .subscribe((result) => {
                this.model.init(result);

                if (result.inventoryAccountId) {
                    this.inventoryAccount = { id: result.inventoryAccountId, name: result.inventoryAccountName };
                }
                if (result.assetAccountId) {
                    this.assetAccount = { id: result.assetAccountId, name: result.assetAccountName };
                }
                if (result.expenseAccountId) {
                    this.expenseAccount = { id: result.expenseAccountId, name: result.expenseAccountName };
                }
                if (result.cogsAccountId) {
                    this.cogsAccount = { id: result.cogsAccountId, name: result.cogsAccountName };
                }
                if (result.revenueAccountId) {
                    this.revenueAccount = { id: result.revenueAccountId, name: result.revenueAccountName };
                }
            });
    }

    save() {
        this.saving = true;
        this._itemService.createOrUpdateItemSetting(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                if (result && !this.model.id) this.model.id = result;
                this.notify.success(this.l('SavedSuccessfully'));
                window.location.reload();
            });
    }
}
