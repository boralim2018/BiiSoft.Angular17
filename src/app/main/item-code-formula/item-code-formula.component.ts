import { DatePipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ExcelFileComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { ColumnType } from '@shared/AppEnums';
import { AppPermissions } from '@shared/AppPermissions';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import {
    GuidEntityDto,
    Int64NullableFilterInputDto,
    ItemCodeFormulaListDto,
    ItemCodeFormulaServiceProxy
} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Ripple } from 'primeng/ripple';
import { SidebarModule } from 'primeng/sidebar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { FindUserComponent } from '../../../shared/components/find-user/find-user.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { RecordNotFoundComponent } from '../../../shared/components/record-not-found/record-not-found.component';
import { SearchActionComponent } from '../../../shared/components/search-action/search-action.component';
import { SearchFooterComponent } from '../../../shared/components/search-action/search-footer.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { CreateItemCodeFormulaComponent } from './create-item-code-formula/create-item-code-formula.component';
import { EditItemCodeFormulaComponent } from './edit-item-code-formula/edit-item-code-formula.component';

@Component({
    selector: 'app-item-code-formula',
    templateUrl: './item-code-formula.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ItemCodeFormulaServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule,
        DropdownModule, FindUserComponent, SearchFooterComponent, OverlayPanelModule, TableSettingComponent,
        NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule,
        RecordNotFoundComponent, DatePipe]
})
export class ItemCodeFormulaComponent extends Mixin(PrimeNgListComponentBase<ItemCodeFormulaListDto>, ExcelFileComponentBase, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'No'; }

    @ViewChild('itemCodeFormulaTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.delete);
    canView: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.view);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.disable);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    creators: any;
    modifiers: any;
    

    constructor(
        injector: Injector,
        private _itemCodeFormulaService: ItemCodeFormulaServiceProxy,
        private _dialogService: DialogService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "ItemCodeFormulaTableCacheKey";
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
        this.title = this.l("ItemCodeFormulas");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createItemCodeFormula(); } });
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
            { name: 'Type', header: 'Type', width: '20rem', sort: true },
            { name: 'ItemTypes', header: 'ItemTypes', width: '50rem', type: ColumnType.List },
            { name: 'Prefix', header: 'Prefix', width: '15rem', sort: true },
            { name: 'Digits', header: 'Digits', width: '15rem', sort: true },
            { name: 'Start', header: 'Start', width: '15rem', sort: true },
            { name: 'IsActive', header: 'Status', width: '15rem', sort: true },
            { name: 'CreatorUserName', header: 'Created', width: '20rem', sort: true, type: ColumnType.WrapText, visible: false },
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

        this._itemCodeFormulaService
            .getList(input.isActive, input.creators.exclude, input.creators.ids, input.modifiers.exclue, input.modifiers.ids, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filter sidebar
                this.showFilter = false;
            });
    }

    delete(itemCodeFormula: ItemCodeFormulaListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: itemCodeFormula.no,
                deleteLabel: this.l('ItemCodeFormula')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._itemCodeFormulaService.delete(itemCodeFormula.id)
                    .pipe(finalize(() => this.isTableLoading = false))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });

    }

    createItemCodeFormula(): void {
        this.showCreateOrEditUserDialog();
    }

    editItemCodeFormula(itemCodeFormula: ItemCodeFormulaListDto): void {
        this.showCreateOrEditUserDialog(itemCodeFormula.id);
    }

    showCreateOrEditUserDialog(id?: string): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateItemCodeFormulaComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('ItemCodeFormula'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditItemCodeFormulaComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('ItemCodeFormula'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    enable(itemCodeFormula: ItemCodeFormulaListDto) {
        this.message.confirm(
            this.l('EnableWarningMessage', itemCodeFormula.no), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemCodeFormula.id;

                    this.isTableLoading = true;
                    this._itemCodeFormulaService.enable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(itemCodeFormula: ItemCodeFormulaListDto) {
        this.message.confirm(
            this.l('DisableWarningMessage', itemCodeFormula.no), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = itemCodeFormula.id;

                    this.isTableLoading = true;
                    this._itemCodeFormulaService.disable(input)
                        .pipe(finalize(() => this.isTableLoading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    viewDetail(itemCodeFormula: ItemCodeFormulaListDto) {
        this._router.navigate(['/app/main/item-code-formulas/view-detail', itemCodeFormula.id]);
    }

    showInlineActions(itemCodeFormula: ItemCodeFormulaListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canView) this.inlineActionMenu.model.push({ label: this.l('View'), icon: 'pi pi-fw pi-eye', command: () => { this.viewDetail(itemCodeFormula); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editItemCodeFormula(itemCodeFormula); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(itemCodeFormula); } });
        if (this.canEnable && !itemCodeFormula.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(itemCodeFormula); } });
        if (this.canDisable && itemCodeFormula.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(itemCodeFormula); } });
   
        this.inlineActionMenu.show(event);
    }

    onCreatorsChange(event) {
        this.filterInput.creators.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onModifiersChange(event) {
        this.filterInput.modifiers.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

}
