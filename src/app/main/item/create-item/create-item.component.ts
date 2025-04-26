import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AccountTypeFilterInputDto, CreateUpdateItemInputDto, ItemServiceProxy, ItemZoneDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { ContactAddressComponent } from '../../../../shared/components/contact-address/contact-address.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { IndexCacheComponentBase } from '../../../../shared/app-component-base';
import { DividerModule } from 'primeng/divider';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';
import { SelectItemCategoryComponent } from '../../../../shared/components/select-item-type/select-item-category.component';
import { AttachFileComponent } from '../../../../shared/components/attach-file/attach-file.component';
import { AccountTypes, ItemTypes, UploadSource } from '../../../../shared/AppEnums';
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
import { FindZoneComponent } from '../../../../shared/components/find-zone/find-zone.component';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-create-item',
    templateUrl: './create-item.component.html',
    animations: [appModuleAnimation()],
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [
        FormsModule, BusyDirective, NgIf, NgFor, NgClass, InputTextareaModule, FindItemModelComponent, SelectItemCategoryComponent,
        ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule, AttachFileComponent, SelectItemTypeComponent,
        FindUnitComponent, FindItemGroupComponent, FindItemBrandComponent, FindItemGradeComponent, FindVGAComponent, CheckboxModule,
        FindItemSizeComponent, FindItemSeriesComponent, FindColorPatternComponent, FindCPUComponent, FindRAMComponent, TabViewModule,
        FindHDDComponent, FindScreenComponent, FindCameraComponent, FindBatteryComponent, FindFieldAComponent, FindFieldBComponent,
        FindFieldCComponent, SelectWeightUnitComponent, SelectLengthUnitComponent, SelectAreaUnitComponent, SelectVolumeUnitComponent,
        InputTextComponent, InputLengthUnitComponent, InputWeightUnitComponent, InputAreaUnitComponent, InputVolumeUnitComponent,
        InputNumberComponent, SelectLengthUnitComponent, SelectWeightUnitComponent, SelectAreaUnitComponent, SelectVolumeUnitComponent,
        FindChartOfAccountComponent, FindZoneComponent, TableModule
    ]
})
export class CreateItemComponent extends IndexCacheComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateItemInputDto = new CreateUpdateItemInputDto();
    users: any[] = [];

    blankImageUrl: string = AppConsts.blankImageUrl;
    uploadUrl: string = '/CompanyProfile/Upload';
    uploadSource: number = UploadSource.CompanyLogo;

    indexCacheKey: string = 'createItemTabCache';

    inventoryAccount: any;
    purchaseAccount: any;
    saleAccount: any;
    inventoryAccountTypeFilter: AccountTypeFilterInputDto;
    purchaseAccountTypeFilter: AccountTypeFilterInputDto;
    saleAccountTypeFilter: AccountTypeFilterInputDto;

    weightUnit: any = AppConsts.WeightUnit;
    lengthUnit: any = AppConsts.LengthUnit;
    areaUnit: any = AppConsts.AreaUnit;
    volumeUnit: any = AppConsts.VolumeUnit;

    selectedZones: any[] = [];

    chartOfAccountEnable: boolean = this.feature.isEnabled("App.Accounting.ChartOfAccounts");

    constructor(
        injector: Injector,
        public _itemService: ItemServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initModel();
        this.initIndexFromCache();this.appSession.itemSetting.useAssetStatus
    }

    initModel() {
        
        this.inventoryAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Inventory], exclude: false });
        this.purchaseAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.CostOfSale, AccountTypes.Expense, AccountTypes.OtherExpense], exclude: false });
        this.saleAccountTypeFilter = new AccountTypeFilterInputDto({ ids: [AccountTypes.Revenue, AccountTypes.OtherRevenue], exclude: false });

        this.model = CreateUpdateItemInputDto.fromJS({
            itemType: 4,
            grossWeight: 0,
            netWeight: 0,
            width: 0,
            height: 0,
            length: 0,
            diameter: 0,
            area: 0,
            volume: 0,
            minStock: 0,
            maxStock: 0,
            reorderStock: 0,
            itemZones: [],
        });

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
        
        if (type == ItemTypes.Inventory) {
            this.inventoryAccountTypeFilter.ids = [AccountTypes.Inventory];
            this.purchaseAccountTypeFilter.ids = [AccountTypes.CostOfSale];
        }
        else if (type == ItemTypes.Asset) {
            this.inventoryAccountTypeFilter.ids = [AccountTypes.FixedAsset];
            this.purchaseAccountTypeFilter.ids = [AccountTypes.CostOfSale, AccountTypes.Expense , AccountTypes.OtherExpense];
        }
        else {
            this.purchaseAccountTypeFilter.ids = [AccountTypes.CostOfSale, AccountTypes.Expense, AccountTypes.OtherExpense];
        }
    }

    onZoneChange(zones: any[]) {
        if (!zones || !zones.length) return;

        if (!this.model.itemZones) this.model.itemZones = [];

        let addZones: ItemZoneDto[] = [];
        const warehouseIds = new Set(this.model.itemZones.map((z) => z.warehouseId));

        for (let z of zones) {
            
            if (warehouseIds.has(z.warehouseId)) {
                this.message.error(this.l('Duplicate', this.l('Zones')));
                this.selectedZones = [];
                return;
            }

            const itemzone = ItemZoneDto.fromJS({
                zoneId: z.id,
                name: z.name,
                displayName: z.displayName,
                warehouseId: z.warehouseId,
                warehouseName: z.warehouseName,
            });
            addZones.push(itemzone);
            warehouseIds.add(z.warehouseId);
        }

        this.model.itemZones = [...this.model.itemZones, ...addZones];
        this.selectedZones = [];
    }

    clearItemZones() {
        this.model.itemZones = [];
    }

    removeItemZone(itemZone: ItemZoneDto) {
        this.model.itemZones = this.model.itemZones.filter((z) => z.zoneId != itemZone.zoneId);
    }
}
