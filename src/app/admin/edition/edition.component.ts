import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    EditionServiceProxy,
    EditionListDto,
} from '@shared/service-proxies/service-proxies';
import { CreateEditionComponent } from './create-edition/create-edition.component';
import { EditEditionComponent } from './edit-edition/edit-edition.component';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Menu, MenuModule } from 'primeng/menu';
import { AppPermissions } from '@shared/AppPermissions';
import { Table, TableModule } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { Mixin } from 'ts-mixer';
import { NavBarComponentBase } from '@shared/app-component-base';
import { RecordNotFoundComponent } from '../../../shared/components/record-not-found/record-not-found.component';
import { TagModule } from 'primeng/tag';
import { PrimeTemplate } from 'primeng/api';
import { SearchActionComponent } from '../../../shared/components/search-action/search-action.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SearchFooterComponent } from '../../../shared/components/search-action/search-footer.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgStyle, NgFor, NgIf } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { of } from 'rxjs';


@Component({
    selector: 'app-edition',
    templateUrl: './edition.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, EditionServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent]
})
export class EditionComponent extends Mixin(PrimeNgListComponentBase<EditionListDto>, NavBarComponentBase ) implements OnInit {

    @ViewChild('editionTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.editions.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.editions.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.editions.delete);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean;

    showFilter: boolean;

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
        private _dialogService: DialogService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "EditionTableCacheKey";
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canDelete;

    }

    initNavBar() {
        this.title = this.l("Editions");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createEdition(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
    }

    protected initColumns() {
        this.columns = [
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function) {

        this._editionService
            .getEditions(input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filete sidebar
                this.showFilter = false;
            });
    }

    delete(edition: EditionListDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: edition.name,
                deleteLabel: this.l('Edition')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._editionService.deleteEdition(edition.id)
                    .pipe(finalize(() => this.isTableLoading = false))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });
    }

    createEdition(): void {
        this.showCreateOrEditUserDialog();
    }

    editEdition(edition: EditionListDto): void {
        this.showCreateOrEditUserDialog(edition.id);
    }

    showCreateOrEditUserDialog(id?: number): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateEditionComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('Edition'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditEditionComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('Edition'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    showInlineActions(edition: EditionListDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editEdition(edition); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(edition); } });

        this.inlineActionMenu.show(event);
    }

}
