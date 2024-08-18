import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    SangkatCommuneServiceProxy,
    SangkatCommuneListDto,
    ExportExcelSangkatCommuneInputDto,
    ColumnOutput,
    ExportFileOutput,
    FileTokenInput,
    Int64NullableFilterInputDto,
    GuidEntityDto,
    GuidNullableFilterInputDto,
} from '@shared/service-proxies/service-proxies';
import { CreateSangkatCommuneComponent } from './create-sangkat-commune/create-sangkat-commune.component';
import { EditSangkatCommuneComponent } from './edit-sangkat-commune/edit-sangkat-commune.component';
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
import { FindKhanDistrictComponent } from '../../../shared/components/find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../../../shared/components/find-city-province/find-city-province.component';
import { FindCountryComponent } from '../../../shared/components/find-country/find-country.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgStyle, NgFor, NgIf, DatePipe } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { of } from 'rxjs';

@Component({
    selector: 'app-sangkat-commune',
    templateUrl: './sangkat-commune.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, SangkatCommuneServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class SangkatCommuneComponent extends Mixin(PrimeNgListComponentBase<SangkatCommuneListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'Code'; }

    @ViewChild('sangkatCommuneTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.disable);
    canImportExcel: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.importExcel);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.setup.locations.sangkatCommunes.exportExcel);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    creators: any;
    modifiers: any;
    countries: any;
    cityProvinces: any;
    khanDistricts: any;

    constructor(
        injector: Injector,
        private _sangkatCommuneService: SangkatCommuneServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "SangkatCommuneTableCacheKey";
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
        this.title = this.l("SangkatCommunes");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createSangkatCommune(); } });
        if (this.canImportExcel) this.actionMenuItems.push({ label: this.l('ImportExcel'), icon: 'fa-solid fa-cloud-arrow-up', command: () => { this.importExcel(); } });
        if (this.canExportExcel) this.actionMenuItems.push({ label: this.l('ExportExcel'), icon: 'fa-solid fa-file-excel', command: () => { this.exportExcel(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
        this.filterInput.creators = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.modifiers = new Int64NullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.countries = new GuidNullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.cityProvinces = new GuidNullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.khanDistricts = new GuidNullableFilterInputDto({ exclude: false, ids: [] });

        this.countries = undefined;
        this.cityProvinces = undefined;
        this.khanDistricts = undefined;
        this.creators = undefined;
        this.modifiers = undefined;
    }

    protected initColumns() {
        this.columns = [
            { name: 'Code', header: 'Code', width: '15rem', sort: true },
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'KhanDistrictName', header: 'KhanDistrict', width: '15rem', sort: true },
            { name: 'CityProvinceName', header: 'CityProvince', width: '15rem', sort: true },
            { name: 'CountryName', header: 'Country', width: '15rem', sort: true },
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
        cache.countries = this.countries;
        cache.cityProvinces = this.cityProvinces;
        cache.khanDistricts = this.khanDistricts;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.creators = cache.creators;
        this.modifiers = cache.modifiers;
        this.countries = cache.countries;
        this.cityProvinces = cache.cityProvinces;
        this.khanDistricts = cache.khanDistricts;
    }

    protected getList(input: any, callBack: Function) {

        this._sangkatCommuneService
            .getList(input.countries.exclude, input.countries.ids, input.cityProvinces.exclude, input.cityProvinces.ids, input.khanDistricts.exclude, input.khanDistricts.ids, input.isActive, input.creators.exclude, input.creators.ids, input.modifiers.exclue, input.modifiers.ids, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(sangkatCommune: SangkatCommuneListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: sangkatCommune.code + " - " + sangkatCommune.name,
                deleteLabel: this.l('SangkatCommune')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._sangkatCommuneService.delete(sangkatCommune.id)
                    .pipe(finalize(() => this.isTableLoading = false))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createSangkatCommune(): void {
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
                this._sangkatCommuneService.importExcel(fileInput)
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
            this._sangkatCommuneService.exportExcelTemplate()
                .pipe(finalize(() => instance.loading = false))
                .subscribe(result => {
                    this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, result.fileName);
                });
        });
    }

    exportExcel() {

        let input = new ExportExcelSangkatCommuneInputDto();
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

        this._sangkatCommuneService
            .exportExcel(input)
            .pipe(finalize(() => this.isTableLoading = false))
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `SangkatCommune_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    editSangkatCommune(sangkatCommune: SangkatCommuneListDto): void {
        this.showCreateOrEditUserDialog(sangkatCommune.id);
    }

    showCreateOrEditUserDialog(id?: string): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateSangkatCommuneComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('SangkatCommune'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditSangkatCommuneComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('SangkatCommune'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    enable(sangkatCommune: SangkatCommuneListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', sangkatCommune.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = sangkatCommune.id;

                    this.isTableLoading = true;
                    this._sangkatCommuneService.enable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(sangkatCommune: SangkatCommuneListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', sangkatCommune.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = sangkatCommune.id;

                    this.isTableLoading = true;
                    this._sangkatCommuneService.disable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(sangkatCommune: SangkatCommuneListDto) {
        this._router.navigate(['/app/admin/sangkat-communes/view-detail', sangkatCommune.id]);
    }

    showInlineActions(sangkatCommune: SangkatCommuneListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(sangkatCommune); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editSangkatCommune(sangkatCommune); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(sangkatCommune); } });
        if (this.canEnable && !sangkatCommune.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(sangkatCommune); } });
        if (this.canDisable && sangkatCommune.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(sangkatCommune); } });

        this.inlineActionMenu.show(event);
    }

    onCreatorsChange(event) {
        this.filterInput.creators.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onModifiersChange(event) {
        this.filterInput.modifiers.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onCountriesChange(event) {
        this.filterInput.countries.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onCityProvincesChange(event) {
        this.filterInput.cityProvinces.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onKhanDistrictsChange(event) {
        this.filterInput.khanDistricts.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }
}
