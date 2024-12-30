import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ItemSeriesServiceProxy,
    ItemSeriesListDto,
    ExportExcelItemSeriesInputDto,
    ColumnOutput,
    ExportFileOutput,
    FileTokenInput,
    Int64NullableFilterInputDto,
    GuidEntityDto,
    GuidNullableFilterInputDto,
} from '@shared/service-proxies/service-proxies';
import { CreateItemSeriesComponent } from './create-item-series/create-item-series.component';
import { EditItemSeriesComponent } from './edit-item-series/edit-item-series.component';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Menu, MenuModule } from 'primeng/menu';
import { AppPermissions } from '@shared/AppPermissions';
import { Table, TableModule } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
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
import { of } from 'rxjs';

@Component({
    selector: 'app-item-series',
    templateUrl: './item-series.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ItemSeriesServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class ItemSeriesComponent extends Mixin(PrimeNgListComponentBase<ItemSeriesListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'Name'; }

    @ViewChild('itemSeriesTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.setup.items.series.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.series.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.series.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.setup.items.series.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.series.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.series.disable);
    canSetAsDefault: boolean = this.isGranted(AppPermissions.pages.setup.items.series.setAsDefault);
    canImportExcel: boolean = this.isGranted(AppPermissions.pages.setup.items.series.importExcel);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.setup.items.series.exportExcel);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    creators: any;
    modifiers: any;

    constructor(
        injector: Injector,
        private _itemSeriesService: ItemSeriesServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "ItemSeriesTableCacheKey";
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
        this.title = this.l("ItemSeries");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createItemSeries(); } });
        if (this.canImportExcel) this.actionMenuItems.push({ label: this.l('ImportExcel'), icon: 'fa-solid fa-cloud-arrow-up', command: () => { this.importExcel(); } });
        if (this.canExportExcel) this.actionMenuItems.push({ label: this.l('ExportExcel'), icon: 'fa-solid fa-file-excel', command: () => { this.exportExcel(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
        this.filterInput.creators = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.modifiers = new Int64NullableFilterInputDto({ exclude: false, ids: [] });

        this.creators = undefined;
        this.modifiers = undefined;
    }

    protected initColumns() {
        this.columns = [
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'Code', header: 'Code', width: '25rem', sort: true },
            { name: 'IsActive', header: 'Status', width: '15rem', sort: true },
            { name: 'IsDefault', header: 'Default', width: '15rem', sort: true },
            { name: 'CreatorUserName', header: 'Created', width: '20rem', sort: true, type: ColumnType.WrapText },
            { name: 'LastModifierUserName', header: 'Modified', width: '20rem', sort: true, type: ColumnType.WrapText, visible: false },
        ];

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

        this._itemSeriesService
            .getList(input.isActive, input.creators.exclude, input.creators.ids, input.modifiers.exclue, input.modifiers.ids, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(itemSeries: ItemSeriesListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: itemSeries.name,
                deleteLabel: this.l('ItemSeries')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._itemSeriesService.delete(itemSeries.id)
                    .pipe(finalize(() => this.isTableLoading = false))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createItemSeries(): void {
        this.showCreateOrEditUserDialog();
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
                this._itemSeriesService.importExcel(fileInput)
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
            this._itemSeriesService.exportExcelTemplate()
                .pipe(finalize(() => instance.loading = false))
                .subscribe(result => {
                    this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, result.fileName);
                });
        });
    }

    exportExcel() {

        let input = new ExportExcelItemSeriesInputDto();
        input.init(this.filterInput);

        input.columns = this.selectedColumns.filter(f => f.name != 'Flag').map((c, index) => {

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

        this._itemSeriesService
            .exportExcel(input)
            .pipe(finalize(() => this.isTableLoading = false))
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `ItemSeries_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    editItemSeries(itemSeries: ItemSeriesListDto): void {
        this.showCreateOrEditUserDialog(itemSeries.id);
    }

    showCreateOrEditUserDialog(id?: string): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateItemSeriesComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('ItemSeries'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditItemSeriesComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('ItemSeries'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    enable(itemSeries: ItemSeriesListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', itemSeries.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemSeries.id;

                    this.isTableLoading = true;
                    this._itemSeriesService.enable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(itemSeries: ItemSeriesListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', itemSeries.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemSeries.id;

                    this.isTableLoading = true;
                    this._itemSeriesService.disable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }


    setAsDefault(itemSeries: ItemSeriesListDto) {
        this.message.confirm(
            this.l('DefaultWarningMessage', itemSeries.name), this.l('SetAsDefault'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemSeries.id;

                    this.isTableLoading = true;
                    this._itemSeriesService.setAsDefault(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(itemSeries: ItemSeriesListDto) {
        this._router.navigate(['/app/main/item-seriess/view-detail', itemSeries.id]);
    }

    showInlineActions(itemSeries: ItemSeriesListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(itemSeries); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editItemSeries(itemSeries); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(itemSeries); } });
        if (this.canEnable && !itemSeries.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(itemSeries); } });
        if (this.canDisable && itemSeries.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(itemSeries); } });
        if (this.canSetAsDefault && !itemSeries.isDefault) this.inlineActionMenu.model.push({ label: this.l('SetAsDefault'), icon: 'fa-solid fa-check-double', command: () => { this.setAsDefault(itemSeries); } });

        this.inlineActionMenu.show(event);
    }

    onCreatorsChange(event) {
        this.filterInput.creators.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onModifiersChange(event) {
        this.filterInput.modifiers.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onCountriesChange(event) {
        this.filterInput.countries.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onCityProvincesChange(event) {
        this.filterInput.cityProvinces.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }
}
