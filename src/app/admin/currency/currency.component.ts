import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    CurrencyServiceProxy,
    CurrencyListDto,
    ExportExcelCurrencyInputDto,
    ColumnOutput,
    ExportFileOutput,
    FileTokenInput,
    Int64EntityDto,
    Int64NullableFilterInputDto,
} from '@shared/service-proxies/service-proxies';
import { CreateCurrencyComponent } from './create-currency/create-currency.component';
import { EditCurrencyComponent } from './edit-currency/edit-currency.component';
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

@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, CurrencyServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class CurrencyComponent extends Mixin(PrimeNgListComponentBase<CurrencyListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'Code'; }

    title: string = this.l('Currencies');
    @ViewChild('currencyTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.setup.currencies.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.currencies.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.currencies.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.setup.currencies.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.currencies.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.currencies.disable);
    canImportExcel: boolean = this.isGranted(AppPermissions.pages.setup.currencies.importExcel);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.setup.currencies.exportExcel);
    canSetAsDefault: boolean = this.isGranted(AppPermissions.pages.setup.currencies.setAsDefault);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    creators: any;
    modifiers: any;

    constructor(
        injector: Injector,
        private _currencyService: CurrencyServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "CurrencyTableCacheKey";
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
        this.title = this.l("Currencies");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createCurrency(); } });
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
            { name: 'Code', header: 'Code', width: '15rem', sort: true },
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'Symbol', header: 'Symbol', width: '15rem', sort: true },
            { name: 'IsDefault', header: 'Default', width: '15rem', sort: true },
            { name: 'IsActive', header: 'Status', width: '15rem', sort: true },
            { name: 'CreatorUserName', header: 'Created', width: '15rem', sort: true, type: ColumnType.WrapText},
            { name: 'LastModifierUserName', header: 'Modified', width: '15rem', sort: true, type: ColumnType.WrapText, visible: false },
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

        this._currencyService
            .getList(input.isActive, input.creators.exclude, input.creators.ids, input.modifiers.exclue, input.modifiers.ids, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(currency: CurrencyListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: currency.code + " - " + currency.name,
                deleteLabel: this.l('Currency')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._currencyService.delete(currency.id)
                    .pipe(finalize(() => { this.isTableLoading = false; }))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createCurrency(): void {
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
                this._currencyService.importExcel(fileInput)
                    .pipe(finalize(() => { instance.loading = false; }))
                    .subscribe(() => {
                        this.notify.info(this.l('SavedSuccessfully'));
                        instance.close();
                        this.refresh();
                    });
            }
        });

        instance.download.subscribe(result => {
            instance.loading = true;
            this._currencyService.exportExcelTemplate()
                .pipe(finalize(() => { instance.loading = false; }))
                .subscribe(result => {
                    this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, result.fileName);
                });
        });
    }
    
    exportExcel() {

        let input = new ExportExcelCurrencyInputDto();
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

        this._currencyService
            .exportExcel(input)
            .pipe(finalize(() => { this.isTableLoading = false; }))
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `Currency_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    editCurrency(currency: CurrencyListDto): void {
        this.showCreateOrEditUserDialog(currency.id);
    }

    showCreateOrEditUserDialog(id?: number): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateCurrencyComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('Currency'),
                styleClass: this.responsiveDialogClass,
                //maximizable: true,
                //breakpoints: "{ '1199px': '75vw', '575px': '90vw' }" 
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditCurrencyComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('Currency'),
                styleClass: this.responsiveDialogClass,
                //maximizable: true,
                //breakpoints: "{ '1199px': '75vw', '575px': '90vw' }" 
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    enable(currency: CurrencyListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', currency.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new Int64EntityDto();
                    input.id = currency.id;

                    this.isTableLoading = true;
                    this._currencyService.enable(input)
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(currency: CurrencyListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', currency.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new Int64EntityDto();
                    input.id = currency.id;

                    this.isTableLoading = true;
                    this._currencyService.disable(input)
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    setAsDefault(currency: CurrencyListDto) {
        this.message.confirm(
            this.l('DefaultWarningMessage', currency.name), this.l('SetAsDefault'), (result) => {
                if (result) {

                    let input = new Int64EntityDto();
                    input.id = currency.id;

                    this.isTableLoading = true;
                    this._currencyService.setAsDefault(input)
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(currency: CurrencyListDto) {
        this._router.navigate(['/app/admin/currencies/view-detail', currency.id]);
    }

    showInlineActions(currency: CurrencyListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(currency); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editCurrency(currency); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(currency); } });
        if (this.canEnable && !currency.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(currency); } });
        if (this.canDisable && currency.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(currency); } });
        if (this.canSetAsDefault && !currency.isDefault) this.inlineActionMenu.model.push({ label: this.l('SetAsDefault'), icon: 'fa-solid fa-check-double', command: () => { this.setAsDefault(currency); } });

        this.inlineActionMenu.show(event);
    }

    onCreatorsChange(event) {
        this.filterInput.creators.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onModifiersChange(event) {
        this.filterInput.modifiers.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }
}
