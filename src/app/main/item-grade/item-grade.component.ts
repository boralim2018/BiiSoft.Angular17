import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ItemGradeServiceProxy,
    ItemGradeListDto,
    ExportExcelItemGradeInputDto,
    ColumnOutput,
    ExportFileOutput,
    FileTokenInput,
    Int64NullableFilterInputDto,
    GuidEntityDto,
    GuidNullableFilterInputDto,
} from '@shared/service-proxies/service-proxies';
import { CreateItemGradeComponent } from './create-item-grade/create-item-grade.component';
import { EditItemGradeComponent } from './edit-item-grade/edit-item-grade.component';
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
    selector: 'app-item-grade',
    templateUrl: './item-grade.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ItemGradeServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent, DatePipe]
})
export class ItemGradeComponent extends Mixin(PrimeNgListComponentBase<ItemGradeListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'Name'; }

    @ViewChild('itemGradeTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.disable);
    canSetAsDefault: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.setAsDefault);
    canImportExcel: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.importExcel);
    canExportExcel: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.exportExcel);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    creators: any;
    modifiers: any;
    useCode: boolean = this.appSession.itemFieldSetting?.useCode;

    constructor(
        injector: Injector,
        private _itemGradeService: ItemGradeServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "ItemGradeTableCacheKey";
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canDelete || this.canEnable || this.canDisable || this.canSetAsDefault;

        this.isActiveModels = [
            { label: this.l('All'), value: '' },
            { label: this.l('Active'), value: true },
            { label: this.l('Inactive'), value: false }
        ];
    }

    initNavBar() {
        this.title = this.l("ItemGrades");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createItemGrade(); } });
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

        if (!this.useCode) this.columns = this.columns.filter(f => f.name != "Code");

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

        this._itemGradeService
            .getList(input.isActive, input.creators.exclude, input.creators.ids, input.modifiers.exclue, input.modifiers.ids, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(itemGrade: ItemGradeListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: itemGrade.name,
                deleteLabel: this.l('ItemGrade')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._itemGradeService.delete(itemGrade.id)
                    .pipe(finalize(() => this.isTableLoading = false))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createItemGrade(): void {
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
                this._itemGradeService.importExcel(fileInput)
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
            this._itemGradeService.exportExcelTemplate()
                .pipe(finalize(() => instance.loading = false))
                .subscribe(result => {
                    this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, result.fileName);
                });
        });
    }

    exportExcel() {

        let input = new ExportExcelItemGradeInputDto();
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

        this._itemGradeService
            .exportExcel(input)
            .pipe(finalize(() => this.isTableLoading = false))
            .subscribe((result: ExportFileOutput) => {
                this.downloadExcel(AppConsts.remoteServiceBaseUrl + result.fileUrl, `ItemGrade_${moment().format("YYYY-MM-DD-HH-mm-ss")}.xlsx`);
            });
    }

    editItemGrade(itemGrade: ItemGradeListDto): void {
        this.showCreateOrEditUserDialog(itemGrade.id);
    }

    showCreateOrEditUserDialog(id?: string): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateItemGradeComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('ItemGrade'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditItemGradeComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('ItemGrade'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    enable(itemGrade: ItemGradeListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', itemGrade.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemGrade.id;

                    this.isTableLoading = true;
                    this._itemGradeService.enable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(itemGrade: ItemGradeListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', itemGrade.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemGrade.id;

                    this.isTableLoading = true;
                    this._itemGradeService.disable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }


    setAsDefault(itemGrade: ItemGradeListDto) {
        this.message.confirm(
            this.l('DefaultWarningMessage', itemGrade.name), this.l('SetAsDefault'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemGrade.id;

                    this.isTableLoading = true;
                    this._itemGradeService.setAsDefault(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }
    
    unsetAsDefault(itemGrade: ItemGradeListDto) {
        this.message.confirm(
            this.l('DefaultWarningMessage', itemGrade.name), this.l('UnsetAsDefault'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemGrade.id;

                    this.isTableLoading = true;
                    this._itemGradeService.unsetAsDefault(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(itemGrade: ItemGradeListDto) {
        this._router.navigate(['/app/main/item-grades/view-detail', itemGrade.id]);
    }

    showInlineActions(itemGrade: ItemGradeListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(itemGrade); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editItemGrade(itemGrade); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(itemGrade); } });
        if (this.canEnable && !itemGrade.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(itemGrade); } });
        if (this.canDisable && itemGrade.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(itemGrade); } });
        if (this.canSetAsDefault && !itemGrade.isDefault) this.inlineActionMenu.model.push({ label: this.l('SetAsDefault'), icon: 'fa-solid fa-check-double', command: () => { this.setAsDefault(itemGrade); } });
        if (this.canSetAsDefault && itemGrade.isDefault) this.inlineActionMenu.model.push({ label: this.l('UnsetAsDefault'), icon: 'fa-solid fa-check-double', command: () => { this.unsetAsDefault(itemGrade); } });

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
