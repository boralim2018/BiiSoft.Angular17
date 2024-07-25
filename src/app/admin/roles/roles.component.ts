import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    RoleServiceProxy,
    RoleDto,
    RoleDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateRoleDialogComponent } from './create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './edit-role/edit-role-dialog.component';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Table, TableModule } from 'primeng/table';
import { AppPermissions } from '@shared/AppPermissions';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { NavBarComponentBase } from '@shared/app-component-base';
import { Mixin } from 'ts-mixer';
import { RecordNotFoundComponent } from '../../../shared/components/record-not-found/record-not-found.component';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { SearchActionComponent } from '../../../shared/components/search-action/search-action.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    templateUrl: './roles.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, RoleServiceProxy],
    standalone: true,
    imports: [MenuModule, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, ButtonDirective, Ripple, RecordNotFoundComponent]
})
export class RolesComponent extends Mixin(PrimeNgListComponentBase<RoleDto>, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'Name'; }

    @ViewChild('roleTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.administrations.roles.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.administrations.roles.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.administrations.roles.delete);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;   
    inlineActionVisible: boolean;

    constructor(
        injector: Injector,
        private _rolesService: RoleServiceProxy,
        private _dialogService: DialogService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "RoleTableCacheKey"; 
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canDelete;
    }

    initNavBar() {
        this.title = this.l("Roles");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createRole(); } });
    }

    protected initColumns() {
        this.columns = [
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'Description', header: 'Description' }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function) {
        
        this._rolesService
            .getAll(input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result: RoleDtoPagedResultDto) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
            });

    }

    delete(role: RoleDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: role.name,
                deleteLabel: this.l('Roles')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._rolesService.delete(role.id)
                    .pipe(finalize(() => { this.isTableLoading = false; }))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });
    }

    createRole(): void {
        this.showCreateOrEditRoleDialog();
    }

    editRole(role: RoleDto): void {
        this.showCreateOrEditRoleDialog(role.id);
    }

    showCreateOrEditRoleDialog(id?: number): void {
        let createOrEditRoleDialog: DynamicDialogRef;
        if (!id) {
            createOrEditRoleDialog = this._dialogService.open(CreateRoleDialogComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('Role'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditRoleDialog = this._dialogService.open(EditRoleDialogComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('Role'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditRoleDialog.onClose.subscribe((result) => {
            if(result) this.refresh();
        });
    }

    showInlineActions(role: RoleDto, event: Event) {
        if (!this.inlineActionMenu) return;
     
        this.inlineActionMenu.model = [];
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editRole(role); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(role); } });

        this.inlineActionMenu.show(event);
    }
}
