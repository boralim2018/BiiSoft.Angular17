import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ItemServiceProxy,
    ItemListDto,
    ExportExcelItemInputDto,
    ColumnOutput,
    ExportFileOutput,
    FileTokenInput,
    Int64NullableFilterInputDto,
    GuidEntityDto,
    ItemTypeFilterInputDto,
    ItemCategoryFilterInputDto,
    GuidFilterInputDto,
    PageItemInputDto
} from '@shared/service-proxies/service-proxies';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Menu, MenuModule } from 'primeng/menu';
import { AppPermissions } from '@shared/AppPermissions';
import { Table, TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { ColumnType } from '@shared/AppEnums';
import { Mixin } from 'ts-mixer';
import { ExcelFileComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import * as moment from 'moment';
import { ImportExcelComponent } from '@shared/components/import-excel/import-excel.component';
import { RecordNotFoundComponent } from '../../../shared/components/record-not-found/record-not-found.component';
import { TagModule } from 'primeng/tag';
import { PrimeTemplate } from 'primeng/api';
import { SearchActionComponent } from '../../../shared/components/search-action/search-action.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SearchFooterComponent } from '../../../shared/components/search-action/search-footer.component';
import { FindUserComponent } from '../../../shared/components/find-user/find-user.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgStyle, NgFor, NgIf, DatePipe } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ItemServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class ItemComponent extends Mixin(PrimeNgListComponentBase<ItemListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'No'; }

    title: string = this.l('Items');
    @ViewChild('itemTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.disable);
    canImportExcel: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.importExcel);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.exportExcel);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    creators: any;
    modifiers: any;

    constructor(
        injector: Injector,
        private _itemService: ItemServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "ItemTableCacheKey";
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canDelete || this.canEnable || this.canDisable;

        this.isActiveModels = [
            { label: this.l('All'), value: '' },
            { label: this.l('Active'), value: true },
            { label: this.l('Inactive'), value: false }
        ];
    }

    initNavBar() {
        this.title = this.l("Items");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createItem(); } });
        if (this.canImportExcel) this.actionMenuItems.push({ label: this.l('ImportExcel'), icon: 'fa-solid fa-cloud-arrow-up', command: () => { this.importExcel(); } });
        if (this.canExportExcel) this.actionMenuItems.push({ label: this.l('ExportExcel'), icon: 'fa-solid fa-file-excel', command: () => { this.exportExcel(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();

        this.filterInput = PageItemInputDto.fromJS(this.filterInput); //Reset filter input to default type

        this.filterInput.isActive = undefined;
        this.filterInput.creatorFilter = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.modifierFilter = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemTypeFilter = new ItemTypeFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemCategoryFilter = new ItemCategoryFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.unitFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemGroupFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemBrandFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemModelFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemGradeFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemSizeFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.itemSeriesFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.colorPatternFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.cpuFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.ramFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.vgaFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.hddFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.screenFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.cameraFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.batteryFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.fieldAFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.fieldBFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.fieldCFilter = new GuidFilterInputDto({ exclude: false, ids: [] });

        this.creators = undefined;
        this.modifiers = undefined;
    }

    protected initColumns() {
        this.columns = [
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'Code', header: 'Code', width: '15rem', sort: true },
            { name: 'Barcode', header: 'Barcode', width: '15rem', sort: true },
            { name: 'ALTCode', header: 'ALTCode', width: '15rem', sort: true, visible: false },
            { name: 'ItemType', header: 'ItemType', width: '15rem', sort: true, display: 'ItemTypeName' },
            { name: 'ItemCategory', header: 'ItemCategory', width: '15rem', sort: true, display: 'ItemCategoryName' },
            { name: 'UnitName', header: 'Unit', width: '15rem', sort: true },
            { name: 'Description', header: 'Description', width: '15rem', sort: true, visible: false },
            { name: 'IsActive', header: 'Status', width: '15rem', sort: true },
            { name: 'IsModifier', header: 'IsModifier', width: '15rem', sort: true, visible: false },
            { name: 'IsAddOn', header: 'IsAddOn', width: '15rem', sort: true, visible: false },
            { name: 'UseBOM', header: 'UseBOM', width: '15rem', sort: true, visible: false },
            { name: 'DisplayBOM', header: 'DisplayBOM', width: '15rem', sort: true, visible: false },
            { name: 'CreatorUserName', header: 'Created', width: '20rem', sort: true, type: ColumnType.WrapText, visible: false },
            { name: 'LastModifierUserName', header: 'Modified', width: '15rem', sort: true, type: ColumnType.WrapText, visible: false },
        ];

        if (this.appSession.itemSetting?.useGrossWeight) this.columns.push({ name: 'GrossWeight', header: 'GrossWeight', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useNetWeight) this.columns.push({ name: 'NetWeight', header: 'NetWeight', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useWidth) this.columns.push({ name: 'Width', header: 'Width', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useHeight) this.columns.push({ name: 'Height', header: 'Height', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useLength) this.columns.push({ name: 'Length', header: 'Length', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useDiameter) this.columns.push({ name: 'Diameter', header: 'Diameter', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useArea) this.columns.push({ name: 'Area', header: 'Area', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useVolume) this.columns.push({ name: 'Volume', header: 'Volume', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useSerial) this.columns.push({ name: 'TrackSerial', header: 'TrackSerial', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useBatchNo) this.columns.push({ name: 'TrackBatchNo', header: 'TrackBatchNo', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useExpired) this.columns.push({ name: 'TrackExpired', header: 'TrackExpired', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useAssetStatus) this.columns.push({ name: 'TrackAssetStatus', header: 'TrackAssetStatus', width: '15rem', sort: true, visible: false });

        if (this.appSession.itemSetting?.useItemGroup) this.columns.push({ name: 'ItemGroupName', header: 'ItemGroup', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useBrand) this.columns.push({ name: 'ItemBrandName', header: 'ItemBrand', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useGrade) this.columns.push({ name: 'ItemGradeName', header: 'ItemGrade', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useModel) this.columns.push({ name: 'ItemModelName', header: 'ItemModel', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useSize) this.columns.push({ name: 'ItemSizeName', header: 'ItemSize', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useSeries) this.columns.push({ name: 'ItemSeriesName', header: 'ItemSeries', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useColorPattern) this.columns.push({ name: 'ColorPatternName', header: 'ColorPattern', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useCPU) this.columns.push({ name: 'CPUName', header: 'CPU', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useRAM) this.columns.push({ name: 'RAMName', header: 'RAM', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useVGA) this.columns.push({ name: 'VGAName', header: 'VGA', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useHDD) this.columns.push({ name: 'HDDName', header: 'HDD', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useScreen) this.columns.push({ name: 'ScreenName', header: 'Screen', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useCamera) this.columns.push({ name: 'CameraName', header: 'Camera', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useBattery) this.columns.push({ name: 'BatteryName', header: 'Battery', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useFieldA) this.columns.push({ name: 'FieldAName', header: this.appSession.itemSetting?.fieldALabel ? this.appSession.itemSetting?.fieldALabel : 'FieldA', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useFieldB) this.columns.push({ name: 'FieldBName', header: this.appSession.itemSetting?.fieldBLabel ? this.appSession.itemSetting?.fieldBLabel : 'FieldB', width: '15rem', sort: true, visible: false });
        if (this.appSession.itemSetting?.useFieldC) this.columns.push({ name: 'FieldCName', header: this.appSession.itemSetting?.fieldCLabel ? this.appSession.itemSetting?.fieldCLabel : 'FieldC', width: '15rem', sort: true, visible: false });

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getInitCache(): any {
        let cache = super.getInitCache();

        //Add more data in cache
        cache.creators = this.creators;
        cache.modifiers = this.modifiers;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.creators = cache.creators;
        this.modifiers = cache.modifiers;
    }

    protected getList(input: any, callBack: Function) {

        this._itemService
            .getList(input)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(item: ItemListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: item.name,
                deleteLabel: this.l('Item')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._itemService.delete(item.id)
                    .pipe(finalize(() => this.isTableLoading = false))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createItem(): void {
        this._router.navigate(['/app/main/items/create']);
    }

    importExcel() {
        const dialogRef = this._dialogService.open(ImportExcelComponent, {
            data: {
            },
            header: this.l('ImportExcel'),
            styleClass: this.responsiveDialogClass
        });

        const instance = this.getDialogInstance(dialogRef, this._dialogService) as ImportExcelComponent;

        instance.upload.subscribe(result => {
            if (result) {
                let fileInput = new FileTokenInput({
                    token: result.fileToken
                });

                instance.loading = true;
                this._itemService.importExcel(fileInput)
                    .pipe(finalize(() => instance.loading = false))
                    .subscribe(() => {
                        this.notify.info(this.l('SavedSuccessfully'));
                        instance.close();
                        this.refresh();
                    });
            }
        });

        instance.download.subscribe(result => {
            instance.loading = true;
            this._itemService.exportExcelTemplate()
                .pipe(finalize(() => instance.loading = false))
                .subscribe(result => {
                    this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, result.fileName);
                });
        });
    }
    
    exportExcel() {

        let input = new ExportExcelItemInputDto();
        input.init(this.filterInput);

        input.columns = this.selectedColumns.map((c, index) => {

            let width = 0;
            let th = this.getColumnInfo(c.name);
            if (th) width = th.offsetWidth; //get column width in pixcels

            let col = ColumnOutput.fromJS({
                columnName: c.name,
                columnTitle: this.l(c.header),
                index: index,
                visible: true,
                columnType: c.type ? c.type : ColumnType.Text,
                width: width
            });

            return col;
        });

        this._itemService
            .exportExcel(input)
            .pipe(finalize(() => this.isTableLoading = false))
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `Item_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    editItem(item: ItemListDto): void {
        this._router.navigate(['/app/main/items/edit', item.id]);
    }
    
    enable(item: ItemListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', item.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = item.id;

                    this.isTableLoading = true;
                    this._itemService.enable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(item: ItemListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', item.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = item.id;

                    this.isTableLoading = true;
                    this._itemService.disable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(item: ItemListDto) {
        this._router.navigate(['/app/main/items/view-detail', item.id]);
    }

    showInlineActions(item: ItemListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(item); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editItem(item); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(item); } });
        if (this.canEnable && !item.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(item); } });
        if (this.canDisable && item.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(item); } });

        this.inlineActionMenu.show(event);
    }

    onCreatorsChange(event) {
        this.filterInput.creatorFilter.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onModifiersChange(event) {
        this.filterInput.modifierFilter.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }
}
