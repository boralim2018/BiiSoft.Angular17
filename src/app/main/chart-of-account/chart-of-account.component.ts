import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ChartOfAccountServiceProxy,
    ChartOfAccountListDto,
    GuidEntityDto,
    ExportExcelChartOfAccountInputDto,
    ColumnOutput,
    ExportFileOutput,
    FileTokenInput,
    Int64NullableFilterInputDto,
    Int32FilterInputDto,
    GuidNullableFilterInputDto,
} from '@shared/service-proxies/service-proxies';
import { CreateChartOfAccountComponent } from './create-chart-of-account/create-chart-of-account.component';
import { EditChartOfAccountComponent } from './edit-chart-of-account/edit-chart-of-account.component';
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
    selector: 'app-chart-of-account',
    templateUrl: './chart-of-account.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ChartOfAccountServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class ChartOfAccountComponent extends Mixin(PrimeNgListComponentBase<ChartOfAccountListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'Code'; }

    @ViewChild('chartOfAccountTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.disable);
    canImportExcel: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.importExcel);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.exportExcel);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];
    creators: any;
    modifiers: any;

    constructor(
        injector: Injector,
        private _chartOfAccountService: ChartOfAccountServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "ChartOfAccountTableCacheKey";
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
        this.title = this.l("ChartOfAccounts");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createChartOfAccount(); } });
        if (this.canImportExcel) this.actionMenuItems.push({ label: this.l('ImportExcel'), icon: 'fa-solid fa-cloud-arrow-up', command: () => { this.importExcel(); } });
        if (this.canExportExcel) this.actionMenuItems.push({ label: this.l('ExportExcel'), icon: 'fa-solid fa-file-excel', command: () => { this.exportExcel(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
        this.filterInput.creators = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.modifiers = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.accountTypes = new Int32FilterInputDto({ exclude: false, ids: [] });
        this.filterInput.subAccountTypes = new Int32FilterInputDto({ exclude: false, ids: [] });
        this.filterInput.parents = new GuidNullableFilterInputDto({ exclude: false, ids: [] });

    }

    protected initColumns() {
        this.columns = [
            { name: 'Code', header: 'Code', width: '25rem', sort: true },
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'AccountType', header: 'AccountType', width: '15rem', sort: true },
            { name: 'SubAccountType', header: 'SubAccountType', width: '15rem', sort: true },
            { name: 'ParentAccountName', header: 'ParentAccount', width: '15rem', sort: true },
            { name: 'IsActive', header: 'Status', width: '15rem', sort: true },
            { name: 'CreatorUserName', header: 'Created', width: '15rem', sort: true, type: ColumnType.WrapText },
            { name: 'LastModifierUserName', header: 'Modified', width: '15rem', sort: true, type: ColumnType.WrapText, visible: false },
            { name: 'CannotEdit', header: 'CannotEdit', width: '10rem', sort: true, visible: false },
            { name: 'CannotDelete', header: 'CannotDelete', width: '10rem', sort: true, visible: false },
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

        this._chartOfAccountService
            .getList(input.accountTypes.exclude, input.accountTypes.ids, input.subAccountTypes.exclude, input.subAccountTypes.ids, input.parents.exclude, input.parents.ids, input.isActive, input.creators.exclude, input.creators.ids, input.modifiers.exclue, input.modifiers.ids, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(model: ChartOfAccountListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: model.no + " - " + model.name,
                deleteLabel: this.l('ChartOfAccount')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._chartOfAccountService.delete(model.id)
                    .pipe(finalize(() => this.isTableLoading = false))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createChartOfAccount(): void {
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
                this._chartOfAccountService.importExcel(fileInput)
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
            this._chartOfAccountService.exportExcelTemplate()
                .pipe(finalize(() => instance.loading = false))
                .subscribe(result => {
                    this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, result.fileName);
                });
        });
    }
    
    exportExcel() {

        let input = new ExportExcelChartOfAccountInputDto();
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

        this._chartOfAccountService
            .exportExcel(input)
            .pipe(finalize(() => this.isTableLoading = false))
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `ChartOfAccount_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    editChartOfAccount(model: ChartOfAccountListDto): void {
        this.showCreateOrEditUserDialog(model.id);
    }

    showCreateOrEditUserDialog(id?: string): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateChartOfAccountComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('ChartOfAccount'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditChartOfAccountComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('ChartOfAccount'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    enable(model: ChartOfAccountListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', model.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = model.id;

                    this.isTableLoading = true;
                    this._chartOfAccountService.enable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(model: ChartOfAccountListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', model.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = model.id;

                    this.isTableLoading = true;
                    this._chartOfAccountService.disable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(model: ChartOfAccountListDto) {
        this._router.navigate(['/app/main/chart-of-accounts/view-detail', model.id]);
    }

    showInlineActions(model: ChartOfAccountListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(model); } });
        if (this.canEdit && !model.cannotEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editChartOfAccount(model); } });
        if (this.canDelete && !model.cannotDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(model); } });
        if (this.canEnable && !model.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(model); } });
        if (this.canDisable && model.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(model); } });

        this.inlineActionMenu.show(event);
    }

    onCreatorsChange(event) {
        this.filterInput.creators.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onModifiersChange(event) {
        this.filterInput.modifiers.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

}
