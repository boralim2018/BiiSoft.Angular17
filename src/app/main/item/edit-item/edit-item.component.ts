import { Component, Injector, OnInit } from '@angular/core';
import { CreateUpdateItemInputDto, ItemDetailDto, ItemServiceProxy, ItemZoneDto, GuidUpdateFileInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { ContactAddressComponent } from '../../../../shared/components/contact-address/contact-address.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule, NgForm } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';
import { AccountTypeFilter, ItemTypes, UploadSource } from '../../../../shared/AppEnums';
import { IndexCacheComponentBase } from '../../../../shared/app-component-base';
import { FindItemModelComponent } from '../../../../shared/components/find-item-model/find-item-model.component';
import { SelectItemCategoryComponent } from '../../../../shared/components/select-item-type/select-item-category.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FindItemBrandComponent } from '../../../../shared/components/find-item-brand/find-item-brand.component';
import { FindItemGradeComponent } from '../../../../shared/components/find-item-grade/find-item-grade.component';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { AppConsts } from '../../../../shared/AppConsts';
import { AttachFileComponent } from '../../../../shared/components/attach-file/attach-file.component';
import { FindBatteryComponent } from '../../../../shared/components/find-battery/find-battery.component';
import { FindCameraComponent } from '../../../../shared/components/find-camera/find-camera.component';
import { FindChartOfAccountComponent } from '../../../../shared/components/find-chart-of-account/find-chart-of-account.component';
import { FindColorPatternComponent } from '../../../../shared/components/find-color-pattern/find-color-pattern.component';
import { FindCPUComponent } from '../../../../shared/components/find-cpu/find-cpu.component';
import { FindFieldAComponent } from '../../../../shared/components/find-field-a/find-field-a.component';
import { FindFieldBComponent } from '../../../../shared/components/find-field-b/find-field-b.component';
import { FindFieldCComponent } from '../../../../shared/components/find-field-c/find-field-c.component';
import { FindHDDComponent } from '../../../../shared/components/find-hdd/find-hdd.component';
import { FindItemGroupComponent } from '../../../../shared/components/find-item-group/find-item-group.component';
import { FindItemSeriesComponent } from '../../../../shared/components/find-item-series/find-item-series.component';
import { FindItemSizeComponent } from '../../../../shared/components/find-item-size/find-item-size.component';
import { FindRAMComponent } from '../../../../shared/components/find-ram/find-ram.component';
import { FindScreenComponent } from '../../../../shared/components/find-screen/find-screen.component';
import { FindUnitComponent } from '../../../../shared/components/find-unit/find-unit.component';
import { FindVGAComponent } from '../../../../shared/components/find-vga/find-vga.component';
import { FindZoneComponent } from '../../../../shared/components/find-zone/find-zone.component';
import { InputNumberComponent } from '../../../../shared/components/input-number/input-number.component';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { InputLengthUnitComponent, InputWeightUnitComponent, InputAreaUnitComponent, InputVolumeUnitComponent } from '../../../../shared/components/input-unit/input-unit.component';
import { RecordNotFoundComponent } from '../../../../shared/components/record-not-found/record-not-found.component';
import { SelectItemTypeComponent } from '../../../../shared/components/select-item-type/select-item-type.component';
import { SelectWeightUnitComponent, SelectLengthUnitComponent, SelectAreaUnitComponent, SelectVolumeUnitComponent } from '../../../../shared/components/select-unit/select-unit.component';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-edit-item',
    templateUrl: './edit-item.component.html',
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
        FindChartOfAccountComponent, FindZoneComponent, TableModule, RecordNotFoundComponent
    ]
})
export class EditItemComponent extends IndexCacheComponentBase implements OnInit {
   
    saving = false;
    model: CreateUpdateItemInputDto;
    findModel: any;
    selectedZones: any[] = [];
    inventoryAccountType: AccountTypeFilter;;
    purchaseAccountType: AccountTypeFilter;
    saleAccountType: AccountTypeFilter;

    blankImageUrl: string = AppConsts.blankImageUrl;
    uploadUrl: string = '/BFile/UploadImage';
    uploadSource: UploadSource = UploadSource.Item;
    indexCacheKey: string = 'createItemTabCache';

    chartOfAccountEnable: boolean = this.feature.isEnabled("App.Accounting.ChartOfAccounts");

    constructor(
        injector: Injector,
        public _itemService: ItemServiceProxy,
        private route: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit(): void {        
        this.initIndexFromCache();
        this.getDetail();
    }

    getDetail() {
        this.initModel();

        this.saving = true;
        this._itemService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ItemDetailDto) => {
                this.model.init(result);
                if (result.weightUnitName) this.findModel.weightUnit = { name: result.weightUnitName, value: result.weightUnit };
                if (result.lengthUnitName) this.findModel.lengthUnit = { name: result.lengthUnitName, value: result.lengthUnit };
                if (result.areaUnitName) this.findModel.areaUnit = { name: result.areaUnitName, value: result.areaUnit };
                if (result.volumeUnitName) this.findModel.volumeUnit = { name: result.volumeUnitName, value: result.volumeUnit };

                if (result.unitId) this.findModel.unit = { id: result.unitId, name: result.unitName };
                if (result.itemGroupId) this.findModel.itemGroup = { id: result.itemGroupId, name: result.itemGroupName };
                if (result.itemBrandId) this.findModel.itemBrand = { id: result.itemBrandId, name: result.itemBrandName };
                if (result.itemGradeId) this.findModel.itemGrade = { id: result.itemGradeId, name: result.itemGradeName };
                if (result.itemModelId) this.findModel.itemModel = { id: result.itemModelId, name: result.itemModelName };
                if (result.itemSizeId) this.findModel.itemSize = { id: result.itemSizeId, name: result.itemSizeName };
                if (result.itemSeriesId) this.findModel.itemSeries = { id: result.itemSeriesId, name: result.itemSeriesName };
                if (result.colorPatternId) this.findModel.colorPattern = { id: result.colorPatternId, name: result.colorPatternName };
                if (result.cpuId) this.findModel.cpu = { id: result.cpuId, name: result.cpuName };
                if (result.ramId) this.findModel.ram = { id: result.ramId, name: result.ramName };
                if (result.vgaId) this.findModel.vga = { id: result.vgaId, name: result.vgaName };
                if (result.hddId) this.findModel.hdd = { id: result.hddId, name: result.hddName };
                if (result.screenId) this.findModel.screen = { id: result.screenId, name: result.screenName };
                if (result.cameraId) this.findModel.camera = { id: result.cameraId, name: result.cameraName };
                if (result.batteryId) this.findModel.battery = { id: result.batteryId, name: result.batteryName };
                if (result.fieldAId) this.findModel.fieldA = { id: result.fieldAId, name: result.fieldAName };
                if (result.fieldBId) this.findModel.fieldB = { id: result.fieldBId, name: result.fieldBName };
                if (result.fieldCId) this.findModel.fieldC = { id: result.fieldCId, name: result.fieldCName };
                if (result.inventoryAccountId) this.findModel.inventoryAccount = { id: result.inventoryAccountId, name: result.inventoryAccountName };
                if (result.purchaseAccountId) this.findModel.purchaseAccount = { id: result.purchaseAccountId, name: result.purchaseAccountName };
                if (result.saleAccountId) this.findModel.saleAccount = { id: result.saleAccountId, name: result.saleAccountName };
            });
    }

    initModel() {

        this.inventoryAccountType = AccountTypeFilter.Inventory;
        this.purchaseAccountType = AccountTypeFilter.COGS;
        this.saleAccountType = AccountTypeFilter.Revenue;

        this.findModel = {
            weightUnit: AppConsts.WeightUnit,
            lengthUnit: AppConsts.LengthUnit,
            areaUnit: AppConsts.AreaUnit,
            volumeUnit: AppConsts.VolumeUnit,
            unit: null,
            itemGroup: null,
            itemBrand: null,
            itemGrade: null,
            itemModel: null,
            itemSize: null,
            itemSeries: null,
            colorPattern: null,
            cpu: null,
            ram: null,
            vga: null,
            hdd: null,
            screen: null,
            camera: null,
            battery: null,
            fieldA: null,
            fieldB: null,
            fieldC: null,
            inventoryAccount: null,
            purchaseAccount: null,
            saleAccount: null,
        };

        this.model = CreateUpdateItemInputDto.fromJS({
            itemType: ItemTypes.Inventory,
            weightUnit: AppConsts.WeightUnit.value,
            lengthUnit: AppConsts.LengthUnit.value,
            areaUnit: AppConsts.AreaUnit.value,
            VolumeUnit: AppConsts.VolumeUnit.value,
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
            inventoryAccountId: this.appSession.itemSetting?.inventoryAccountId,
            purchaseAccountId: this.appSession.itemSetting?.cogsAccountId,
            saleAccountId: this.appSession.itemSetting?.revenueAccountId,
        });

        if (this.appSession.itemSetting?.inventoryAccountId) this.findModel.inventoryAccount = { id: this.appSession.itemSetting?.inventoryAccountId, name: this.appSession.itemSetting?.inventoryAccountName };
        if (this.appSession.itemSetting?.cogsAccountId) this.findModel.purchaseAccount = { id: this.appSession.itemSetting?.cogsAccountId, name: this.appSession.itemSetting?.cogsAccountName };
        if (this.appSession.itemSetting?.revenueAccountId) this.findModel.saleAccount = { id: this.appSession.itemSetting?.revenueAccountId, name: this.appSession.itemSetting?.revenueAccountName };
    };

    save(): void {
        this.saving = true;

        this._itemService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                this.cancel();
            });
    }

    cancel() {
        window.history.back();
    }

    onItemTypeChange(type) {

        if (type == ItemTypes.Inventory) {
            this.inventoryAccountType = AccountTypeFilter.Inventory;

            if (this.appSession.itemSetting?.inventoryAccountId) {
                this.findModel.inventoryAccount = { id: this.appSession.itemSetting?.inventoryAccountId, name: this.appSession.itemSetting?.inventoryAccountName };
                this.model.inventoryAccountId = this.appSession.itemSetting?.inventoryAccountId;
            }
            else {
                this.findModel.inventoryAccount = null;
                this.model.inventoryAccountId = null;
            }
        }
        else if (type == ItemTypes.Asset) {
            this.inventoryAccountType = AccountTypeFilter.FixedAsset;

            if (this.appSession.itemSetting?.assetAccountId) {
                this.findModel.inventoryAccount = { id: this.appSession.itemSetting?.assetAccountId, name: this.appSession.itemSetting?.assetAccountName };
                this.model.inventoryAccountId = this.appSession.itemSetting?.assetAccountId;
            }
            else {
                this.findModel.inventoryAccount = null;
                this.model.inventoryAccountId = null;
            }
        }

        if (type == ItemTypes.Inventory || type == ItemTypes.Asset) {
            this.purchaseAccountType = AccountTypeFilter.COGS;

            if (this.appSession.itemSetting?.cogsAccountId) {
                this.findModel.purchaseAccount = { id: this.appSession.itemSetting?.cogsAccountId, name: this.appSession.itemSetting?.cogsAccountName };
                this.model.purchaseAccountId = this.appSession.itemSetting?.cogsAccountId;
            }
            else {
                this.findModel.purchaseAccount = null;
                this.model.purchaseAccountId = null;
            }
        }
        else {
            this.purchaseAccountType = AccountTypeFilter.COGSExpense;

            if (this.appSession.itemSetting?.expenseAccountId) {
                this.findModel.purchaseAccount = { id: this.appSession.itemSetting?.expenseAccountId, name: this.appSession.itemSetting?.expenseAccountName };
                this.model.purchaseAccountId = this.appSession.itemSetting?.expenseAccountId;
            }
            else {
                this.findModel.purchaseAccount = null;
                this.model.purchaseAccountId = null;
            }
        }

        this.model.useBOM = type == ItemTypes.Menu || type == ItemTypes.Bundle;
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

    onFileIdChange(fileId: string) {
        this.saving = true;

        const fileInput = new GuidUpdateFileInput({id: this.model.id, fileId: fileId});

        this._itemService.updateImage(fileInput)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
            });
    }
}
