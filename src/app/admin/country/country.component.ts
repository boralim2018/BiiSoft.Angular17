import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    CountryServiceProxy,
    CountryListDto,
    ExportExcelCountryInputDto,
    ColumnOutput,
    ExportFileOutput,
    FileTokenInput,
    Int64NullableFilterInputDto,
    GuidEntityDto,
} from '@shared/service-proxies/service-proxies';
import { CreateCountryComponent } from './create-country/create-country.component';
import { EditCountryComponent } from './edit-country/edit-country.component';
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
import { FindCurrencyComponent } from '../../../shared/components/find-currency/find-currency.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgStyle, NgFor, NgIf, DatePipe } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';

@Component({
    selector: 'app-country',
    templateUrl: './country.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, CountryServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, FindCurrencyComponent, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class CountryComponent extends Mixin(PrimeNgListComponentBase<CountryListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'CountryCode'; }

    @ViewChild('countryTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.disable);
    canImportExcel: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.importExcel);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.exportExcel);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    creators: any;
    modifiers: any;
    currencies: any;

    constructor(
        injector: Injector,
        private _countryService: CountryServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "CountryTableCacheKey";
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
        this.title = this.l("Countries");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createCountry(); } });
        if (this.canImportExcel) this.actionMenuItems.push({ label: this.l('ImportExcel'), icon: 'fa-solid fa-cloud-arrow-up', command: () => { this.importExcel(); } });
        if (this.canExportExcel) this.actionMenuItems.push({ label: this.l('ExportExcel'), icon: 'fa-solid fa-file-excel', command: () => { this.exportExcel(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
        this.filterInput.creators = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.modifiers = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.currencies = new Int64NullableFilterInputDto({ exclude: false, ids: [] });

        this.currencies = undefined;
        this.creators = undefined;
        this.modifiers = undefined;
    }

    protected initColumns() {
        this.columns = [
            { name: 'CountryCode', header: 'Code', width: '15rem', sort: true },
            { name: 'Flag', header: 'Flag', width: '15rem' },
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'ISO', header: 'ISO', width: '15rem', sort: true },
            { name: 'ISO2', header: 'ISO2', width: '15rem', sort: true },
            { name: 'PhonePrefix', header: 'PhonePrefix', width: '15rem', sort: true },
            { name: 'CurrencyCode', header: 'Currency', width: '15rem', sort: true, visible: false },
            { name: 'Latitude', header: 'Latitude', width: '15rem', sort: true, visible: false },
            { name: 'Longitude', header: 'Longitude', width: '15rem', sort: true, visible: false },
            { name: 'IsActive', header: 'Status', width: '15rem', sort: true },
            { name: 'CreatorUserName', header: 'Created', width: '20rem', sort: true, type: ColumnType.WrapText },
            { name: 'LastModifierUserName', header: 'Modified', width: '20rem', sort: true, type: ColumnType.WrapText, visible: false },
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
        cache.currencies = this.currencies;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.creators = cache.creators;
        this.modifiers = cache.modifiers;
        this.currencies = cache.currencies;
    }

    protected getList(input: any, callBack: Function) {

        this._countryService
            .getList(input.currencies.exclude, input.currencies.ids, input.isActive, input.creators.exclude, input.creators.ids, input.modifiers.exclue, input.modifiers.ids, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(country: CountryListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: country.countryCode + " - " + country.name,
                deleteLabel: this.l('Country')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._countryService.delete(country.id)
                    .pipe(finalize(() => { this.isTableLoading = false; }))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createCountry(): void {
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
                this._countryService.importExcel(fileInput)
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
            this._countryService.exportExcelTemplate()
                .pipe(finalize(() => { instance.loading = false; }))
                .subscribe(result => {
                    this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, result.fileName);
                });
        });
    }

    exportExcel() {

        let input = new ExportExcelCountryInputDto();
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

        this._countryService
            .exportExcel(input)
            .pipe(finalize(() => { this.isTableLoading = false; }))
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `Country_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    editCountry(country: CountryListDto): void {
        this.showCreateOrEditUserDialog(country.id);
    }

    showCreateOrEditUserDialog(id?: string): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateCountryComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('Country'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditCountryComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('Country'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    enable(country: CountryListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', country.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = country.id;

                    this.isTableLoading = true;
                    this._countryService.enable(input)
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(country: CountryListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', country.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = country.id;

                    this.isTableLoading = true;
                    this._countryService.disable(input)
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(country: CountryListDto) {
        this._router.navigate(['/app/admin/countries/view-detail', country.id]);
    }

    showInlineActions(country: CountryListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(country); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editCountry(country); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(country); } });
        if (this.canEnable && !country.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(country); } });
        if (this.canDisable && country.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(country); } });

        this.inlineActionMenu.show(event);
    }

    onCreatorsChange(event) {
        this.filterInput.creators.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onModifiersChange(event) {
        this.filterInput.modifiers.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onCurrenciesChange(event) {
        this.filterInput.currencies.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }
}
