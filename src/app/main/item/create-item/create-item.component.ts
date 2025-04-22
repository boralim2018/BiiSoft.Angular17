import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AccountTypeFilterInputDto, CreateUpdateItemInputDto, ItemServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { ContactAddressComponent } from '../../../../shared/components/contact-address/contact-address.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { TabViewCacheComponentBase } from '../../../../shared/app-component-base';
import { DividerModule } from 'primeng/divider';
import { NgClass, NgIf } from '@angular/common';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';
import { SelectItemCategoryComponent } from '../../../../shared/components/select-item-type/select-item-category.component';
import { AttachFileComponent } from '../../../../shared/components/attach-file/attach-file.component';
import { UploadSource } from '../../../../shared/AppEnums';
import { AppConsts } from '../../../../shared/AppConsts';
import { SelectItemTypeComponent } from '../../../../shared/components/select-item-type/select-item-type.component';
import { FindUnitComponent } from '../../../../shared/components/find-unit/find-unit.component';
import { FindItemGroupComponent } from '../../../../shared/components/find-item-group/find-item-group.component';
import { FindItemBrandComponent } from '../../../../shared/components/find-item-brand/find-item-brand.component';
import { FindItemGradeComponent } from '../../../../shared/components/find-item-grade/find-item-grade.component';
import { FindItemModelComponent } from '../../../../shared/components/find-item-model/find-item-model.component';
import { FindItemSizeComponent } from '../../../../shared/components/find-item-size/find-item-size.component';
import { FindItemSeriesComponent } from '../../../../shared/components/find-item-series/find-item-series.component';
import { FindColorPatternComponent } from '../../../../shared/components/find-color-pattern/find-color-pattern.component';
import { FindCPUComponent } from '../../../../shared/components/find-cpu/find-cpu.component';
import { FindRAMComponent } from '../../../../shared/components/find-ram/find-ram.component';
import { FindVGAComponent } from '../../../../shared/components/find-vga/find-vga.component';
import { FindHDDComponent } from '../../../../shared/components/find-hdd/find-hdd.component';
import { FindScreenComponent } from '../../../../shared/components/find-screen/find-screen.component';
import { FindCameraComponent } from '../../../../shared/components/find-camera/find-camera.component';
import { FindBatteryComponent } from '../../../../shared/components/find-battery/find-battery.component';
import { FindFieldAComponent } from '../../../../shared/components/find-field-a/find-field-a.component';
import { FindFieldBComponent } from '../../../../shared/components/find-field-b/find-field-b.component';
import { FindFieldCComponent } from '../../../../shared/components/find-field-c/find-field-c.component';
import { SelectWeightUnitComponent, SelectLengthUnitComponent, SelectAreaUnitComponent, SelectVolumeUnitComponent } from '../../../../shared/components/select-unit/select-unit.component';
import { InputAreaUnitComponent, InputLengthUnitComponent, InputVolumeUnitComponent, InputWeightUnitComponent } from '../../../../shared/components/input-unit/input-unit.component';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { InputNumberComponent } from '../../../../shared/components/input-number/input-number.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { FindChartOfAccountComponent } from '../../../../shared/components/find-chart-of-account/find-chart-of-account.component';

@Component({
    selector: 'app-create-item',
    templateUrl: './create-item.component.html',
    animations: [appModuleAnimation()],
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [
        FormsModule, BusyDirective, NgIf, NgClass, InputTextareaModule, FindItemModelComponent, SelectItemCategoryComponent,
        ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule, AttachFileComponent, SelectItemTypeComponent,
        FindUnitComponent, FindItemGroupComponent, FindItemBrandComponent, FindItemGradeComponent, FindVGAComponent, CheckboxModule,
        FindItemSizeComponent, FindItemSeriesComponent, FindColorPatternComponent, FindCPUComponent, FindRAMComponent, TabViewModule,
        FindHDDComponent, FindScreenComponent, FindCameraComponent, FindBatteryComponent, FindFieldAComponent, FindFieldBComponent,
        FindFieldCComponent, SelectWeightUnitComponent, SelectLengthUnitComponent, SelectAreaUnitComponent, SelectVolumeUnitComponent,
        InputTextComponent, InputLengthUnitComponent, InputWeightUnitComponent, InputAreaUnitComponent, InputVolumeUnitComponent,
        InputNumberComponent, SelectLengthUnitComponent, SelectWeightUnitComponent, SelectAreaUnitComponent, SelectVolumeUnitComponent,
        FindChartOfAccountComponent
    ]
})
export class CreateItemComponent extends TabViewCacheComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateItemInputDto = new CreateUpdateItemInputDto();
    users: any[] = [];

    blankImageUrl: string = AppConsts.blankImageUrl;
    uploadUrl: string = '/CompanyProfile/Upload';
    uploadSource: number = UploadSource.CompanyLogo;

    tabCacheKey: string = 'createItemTabCache';

    inventoryAccount: any;
    purchaseAccount: any;
    saleAccount: any;
    inventoryAccountTypeFilter: AccountTypeFilterInputDto;
    purchaseAccountTypeFilter: AccountTypeFilterInputDto;
    saleAccountTypeFilter: AccountTypeFilterInputDto;

    chartOfAccountEnable: boolean = this.feature.isEnabled("App.Accounting.ChartOfAccounts");

    constructor(
        injector: Injector,
        public _itemService: ItemServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initModel();
        this.initTabViewFromCache();
    }

    initModel() {
        //Cash = 10,
        //Bank = 11,
        //AccountReceivable = 12,
        //Inventory = 13,
        //CurrentAsset = 14,
        //FixedAsset = 15,
        //NoneCurrentAsset = 16,
        //AccountPayable = 20,
        //CreditCard = 21,
        //CurrentLiability = 22,
        //NoneCurrentLiability = 23,
        //Equity = 30,
        //Revenue = 40,
        //OtherRevenue = 41,
        //CostOfSale = 50,
        //Expense = 51,
        //OtherExpense = 52
        this.inventoryAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [13], exclude: false });
        this.purchaseAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [50, 51, 52], exclude: false });
        this.saleAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [40, 41], exclude: false });

        this.model = new CreateUpdateItemInputDto();
        this.model.itemZones = [];

        if (this.appSession) {
            
        }

    };

    save(form?: NgForm): void {
        this.saving = true;

        this._itemService.create(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                if (form) {
                    this.initModel();
                    form.resetForm(this.model);
                }
                else {
                    this.cancel();
                }
            });
    }

    saveNew(form: NgForm) {
        this.save(form);
    }

    cancel() {
        window.history.back();
    }

    onItemTypeChange(type) {
        //Service = 1,
        //Menu = 2,
        //NonInvnetory = 3,
        //Inventory = 4,
        //Asset = 5,
        //Bundle = 6,

        if (type == 4) {
            this.inventoryAccountTypeFilter.ids = [13];
            this.purchaseAccountTypeFilter.ids = [50];
        }
        else if (type == 5) {
            this.inventoryAccountTypeFilter.ids = [15];
            this.purchaseAccountTypeFilter.ids = [50, 51, 52];
        }
        else {
            this.purchaseAccountTypeFilter.ids = [50, 51, 52];
        }
    }

}
