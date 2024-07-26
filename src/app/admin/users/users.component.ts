import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    AccountServiceProxy,
    UserServiceProxy,
    UserDto,
    UserDtoPagedResultDto,
    Int64EntityDto
} from '@shared/service-proxies/service-proxies';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Menu, MenuModule } from 'primeng/menu';
import { AppPermissions } from '@shared/AppPermissions';
import { Table, TableModule } from 'primeng/table';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangePermissionsDialogComponent } from './change-permissions/change-permissions-dialog.component';
import { ImpersonationService } from '../../layout/service/impersonation.service';
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
    templateUrl: './users.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, UserServiceProxy, ImpersonationService, AccountServiceProxy],
    standalone: true,
    imports: [MenuModule, SidebarModule, NgClass, ButtonDirective, Ripple, FormsModule, InputTextModule, DropdownModule, SearchFooterComponent, OverlayPanelModule, TableSettingComponent, NavBarComponent, SearchActionComponent, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, TagModule, RecordNotFoundComponent]
})
export class UsersComponent extends Mixin(PrimeNgListComponentBase<UserDto>, NavBarComponentBase) implements OnInit {

    protected get sortField(): string { return 'UserName'; }

    @ViewChild('userTable') table: Table;
    canCreate: boolean = this.isGranted(AppPermissions.pages.administrations.users.create);
    canEdit: boolean = this.isGranted(AppPermissions.pages.administrations.users.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.administrations.users.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.administrations.users.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.administrations.users.disable);
    canActivate: boolean = this.isGranted(AppPermissions.pages.administrations.users.activate);
    canDeactivate: boolean = this.isGranted(AppPermissions.pages.administrations.users.deactivate);
    canResetPassword: boolean = this.isGranted(AppPermissions.pages.administrations.users.resetPassword);
    canChangePermissions: boolean = this.isGranted(AppPermissions.pages.administrations.users.changePermissions);
    canImpersonation: boolean = this.isGranted(AppPermissions.pages.administrations.users.impersonation);

    actionMenuItems: any[];

    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;    
    inlineActionVisible: boolean;

    showFilter: boolean;
    isActiveModels: any[];

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _impersonationService: ImpersonationService,
        private _dialogService: DialogService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.tableCacheKey = "UserTableCacheKey";
        super.ngOnInit();
        this.initNavBar();

        this.initActionMenuItems();
        this.inlineActionVisible = this.canEdit || this.canDelete;

        this.isActiveModels = [
            { label: this.l('All'), value: '' },
            { label: this.l('Active') , value: true },
            { label: this.l('Inactive') , value: false }
        ];
    }

    initNavBar() {
        this.title = this.l("Users");
        this.setTitle();
    }

    private initActionMenuItems() {
        this.actionMenuItems = [];
        if (this.canCreate) this.actionMenuItems.push({ label: this.l('Create'), icon: 'pi pi-plus-circle', command: () => { this.createUser(); } });
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
    }

    protected initColumns() {      
        this.columns = [
            { name: 'UserName', header: 'UserName', width: '25rem', sort: true },
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'Surname', header: 'Surname', width: '25rem', sort: true },
            { name: 'EmailAddress', header: 'EmailAddress', sort: true },
            { name: 'IsActive', header: 'IsActive', width: '15rem' }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function) {
        
        this._userService
            .getAll(input.isActive, input.keyword, input.sortField, input.sortMode, input.usePagination, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => { callBack(); }))
            .subscribe((result: UserDtoPagedResultDto) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
                //close filete sidebar
                this.showFilter = false;
            });
    }

    delete(user: UserDto): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: user.userName,
                deleteLabel: this.l('User')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                this._userService.delete(user.id)
                    .pipe(finalize(() => { this.isTableLoading = false; }))
                    .subscribe(() => {
                        this.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
            }
        });
    }

    enable(user: UserDto): void {

        this.message.confirm(
            this.l('EnableWarningMessage', user.fullName), this.l('Enable'), (result) => {
                if (result) {

                    this.isTableLoading = true;
                    this._userService.enable(Int64EntityDto.fromJS({ id: user.id }))
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    disable(user: UserDto): void {

        this.message.confirm(
            this.l('DisableWarningMessage', user.fullName), this.l('Disable'), (result) => {
                if (result) {

                    this.isTableLoading = true;
                    this._userService.disable(Int64EntityDto.fromJS({ id: user.id }))
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    activate(user: UserDto): void {

        this.message.confirm(
            this.l('ActivateWarningMessage', user.fullName), this.l('Activate'), (result) => {
                if (result) {

                    this.isTableLoading = true;
                    this._userService.activate(Int64EntityDto.fromJS({ id: user.id }))
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    deactivate(user: UserDto): void {

        this.message.confirm(
            this.l('DeactivateWarningMessage', user.fullName), this.l('Deactivate'), (result) => {
                if (result) {

                    this.isTableLoading = true;
                    this._userService.deactivate(Int64EntityDto.fromJS({ id: user.id }))
                        .pipe(finalize(() => { this.isTableLoading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.refresh();
                        });
                }
            }
        );
    }

    createUser(): void {
        this.showCreateOrEditUserDialog();
    }

    editUser(user: UserDto): void {
        this.showCreateOrEditUserDialog(user.id);
    }

    showCreateOrEditUserDialog(id?: number): void {
        let createOrEditUserDialog: DynamicDialogRef;
        if (!id) {
            createOrEditUserDialog = this._dialogService.open(CreateUserDialogComponent, {
                data: {},
                header: this.l('Create') + ' ' + this.l('User'),
                styleClass: this.responsiveDialogClass
            });
        } else {
            createOrEditUserDialog = this._dialogService.open(EditUserDialogComponent, {
                data: { id: id },
                header: this.l('Edit') + ' ' + this.l('User'),
                styleClass: this.responsiveDialogClass
            });
        }

        createOrEditUserDialog.onClose.subscribe((result) => {
            if (result) this.refresh();
        });
    }

    showInlineActions(user: UserDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        if (!user.isDeactivate) {
            if (this.canEdit) this.inlineActionMenu.model.push({ label: this.l('Edit'), icon: 'pi pi-fw pi-pencil', command: () => { this.editUser(user); } });
            if (this.canDelete) this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-trash', command: () => { this.delete(user); } });
            if (this.canEnable && !user.isActive) this.inlineActionMenu.model.push({ label: this.l('Enable'), icon: 'pi pi-check', command: () => { this.enable(user); } });
            if (this.canDisable && user.isActive) this.inlineActionMenu.model.push({ label: this.l('Disable'), icon: 'pi pi-ban', command: () => { this.disable(user); } });
            if (this.canResetPassword) this.inlineActionMenu.model.push({ label: this.l('ResetPassword'), icon: 'fas fa-lock', command: () => { this.resetPassword(user); } });
            if (this.canChangePermissions) this.inlineActionMenu.model.push({ label: this.l('ChangePermissions'), icon: 'fa-solid fa-user-check', command: () => { this.changePermissions(user); } });
            if (this.canImpersonation && user.id != abp.session.userId) this.inlineActionMenu.model.push({ label: this.l('LoginAsUser'), icon: 'fa-solid fa-lock', command: () => { this.impersonate(user); } });
        }
        if (this.canActivate && user.isDeactivate) this.inlineActionMenu.model.push({ label: this.l('Activate'), icon: 'fa-regular fa-circle-check', command: () => { this.activate(user); } });
        if (this.canDeactivate && !user.isDeactivate) this.inlineActionMenu.model.push({ label: this.l('Deactivate'), icon: 'fa-regular fa-circle-xmark', command: () => { this.deactivate(user); } });

        this.inlineActionMenu.show(event);
    }

    public resetPassword(user: UserDto): void {
        this._dialogService.open(ResetPasswordDialogComponent, {
            data: { id: user.id },
            header: this.l('ResetPassword'),
            styleClass: this.responsiveDialogClass
        });
    }

    public changePermissions(user: UserDto): void {
        this._dialogService.open(ChangePermissionsDialogComponent, {
            data: { id: user.id },
            header: this.l('ChangePermissions'),
            styleClass: this.responsiveDialogClass
        });
    }

    public impersonate(user: UserDto): void {
        this._impersonationService.impersonate(user.id, abp.session.tenantId);
    }

}
