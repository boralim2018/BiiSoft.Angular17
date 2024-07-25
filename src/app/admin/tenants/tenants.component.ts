import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TenantServiceProxy, TenantDto, TenantDtoPagedResultDto, UserDto, EntityDto, AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateTenantDialogComponent } from './create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './edit-tenant/edit-tenant-dialog.component';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Table, TableModule } from 'primeng/table';
import { AppPermissions } from '@shared/AppPermissions';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImpersonationService } from '../../layout/service/impersonation.service';
import { LoginAsTenantComponent } from './login-as-tenant/login-as-tenant.component';
import { ChangeFeatureComponent } from './change-feature/change-feature.component';
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

@Component({
    templateUrl: './tenants.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, TenantServiceProxy, ImpersonationService, AccountServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent]
})
export class TenantsComponent extends Mixin(PrimeNgListComponentBase<TenantDto>, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'Name'; }

    @ViewChild('tenantTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.tenants.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.tenants.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.tenants.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.tenants.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.tenants.disable);
    canLoginAsTenant: boolean = this.isGranted(AppPermissions.pages.tenants.impersonation);
    canChangeFeatures: boolean = this.isGranted(AppPermissions.pages.tenants.changeFeatures);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;    
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    constructor(
        injector: Injector,
        private _tenantService: TenantServiceProxy,
        private _dialogService: DialogService,
        private _impersonationService: ImpersonationService
    ) {
        super(injector);
    }


    ngOnInit() {
        this.tableCacheKey = "TenantTableCacheKey";
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canDelete;

        this.isActiveModels = [
            { label: this.l('All'), value: '' },
            { label: this.l('Active'), value: true },
            { label: this.l('Inactive'), value: false }
        ];
    }

    initNavBar() {
        this.title = this.l("Tenants");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createTenant(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
    }

    protected initColumns() {
        this.columns = [
            { name: 'TenancyName', header: 'TenancyName', width: '25rem', sort: true },
            { name: 'Name', header: 'Name', sort: true },
            { name: 'EditionName', header: 'Edition', width: '25rem', sort: true },
            { name: 'IsActive', header: 'IsActive', width: '15rem' }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }


    protected getList(input: any, callBack: Function) {

        this._tenantService
            .getAll(input.isActive, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result: TenantDtoPagedResultDto) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filete sidebar
                this.showFilter = false;
            });
    }

    delete(tenant: TenantDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: tenant.name,
                deleteLabel: this.l('Tenant')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._tenantService.delete(tenant.id)
                    .pipe(finalize(() => { this.isTableLoading = false; }))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });
    }

    enable(tenant: TenantDto): void {

        this.message.confirm(
            this.l('EnableWarningMessage', tenant.tenancyName), this.l('Enable'), (result) => {
                if (result) {

                    this.isTableLoading = true;
                    this._tenantService.enable(EntityDto.fromJS({id: tenant.id}))
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(tenant: TenantDto): void {

        this.message.confirm(
            this.l('DisableWarningMessage', tenant.tenancyName), this.l('Disable'), (result) => {
                if (result) {

                    this.isTableLoading = true;
                    this._tenantService.disable(EntityDto.fromJS({ id: tenant.id }))
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }


    createTenant(): void {
        this.showCreateOrEditTenantDialog();
    }

    editTenant(tenant: TenantDto): void {
        this.showCreateOrEditTenantDialog(tenant.id);
    }

    showCreateOrEditTenantDialog(id?: number): void {
        let createOrEditTenantDialog: DynamicDialogRef;
        if (!id) {
            createOrEditTenantDialog = this._dialogService.open(CreateTenantDialogComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('Tenant'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditTenantDialog = this._dialogService.open(EditTenantDialogComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('Tenant'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditTenantDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    showLoginAsTenant(tenant: TenantDto) {
        let loginDialog = this._dialogService.open(LoginAsTenantComponent, {
            data: { id: tenant.id },
            header: this.l('LoginAsTenant'),
            styleClass: this.responsiveDialogClass
        });

        loginDialog.onClose.subscribe((result: UserDto) => {
            if (result) {
                this._impersonationService.impersonate(result.id, tenant.id);
            }
        });
    }

    showChangeFeatures(tenant: TenantDto) {
        let dialog = this._dialogService.open(ChangeFeatureComponent, {
            data: { id: tenant.id },
            header: this.l('ChangeFeatures'),
            styleClass: this.responsiveDialogClass
        });
    }

    showInlineActions(tenant: TenantDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (this.canLoginAsTenant) this.inlineActionMenu.model.push({ label: this.l('LoginAsTenant'), icon: 'pi pi-fw pi-lock', command: () => { this.showLoginAsTenant(tenant); } });
        if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editTenant(tenant); } });
        if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(tenant); } });
        if (this.canEnable && !tenant.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(tenant); } });
        if (this.canDisable && tenant.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(tenant); } });
        if (this.canChangeFeatures) this.inlineActionMenu.model.push({ label: this.l('ChangeFeatures'), icon: 'fa-solid fa-list-check', command: () => { this.showChangeFeatures(tenant); } });

        this.inlineActionMenu.show(event);
    }
}
