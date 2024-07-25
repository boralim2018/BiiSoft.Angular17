import { Component, Injector, ViewChild } from '@angular/core';
import { LinkedUserDto, UnlinkUserInput, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { LinkedAccountService } from './linked-account.service';
import { finalize } from 'rxjs';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateLinkAccountModalComponent } from './create-link-account-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { RecordNotFoundComponent } from '../../../shared/components/record-not-found/record-not-found.component';
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';

@Component({
    selector: 'linkedAccountsModal',
    templateUrl: './linked-accounts-modal.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService],
    standalone: true,
    imports: [MenuModule, TableModule, PrimeTemplate, ButtonDirective, Ripple, NgStyle, NgFor, NgIf, RecordNotFoundComponent, LocalizePipe]
})
export class LinkedAccountsModalComponent extends PrimeNgListComponentBase<LinkedUserDto> {

    protected get sortField(): string { return 'UserName'; }

    @ViewChild('linkUserTable') table: Table;
    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean = true;
    parent: any;

    constructor(
        injector: Injector,
        private _userLinkService: UserLinkServiceProxy,
        private _linkedAccountService: LinkedAccountService,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig,
        private _dialogService: DialogService
    ) {
        super(injector);

        this.parent = this._dialogConfig.data.parent;
    }

    protected initColumns(): void {
        this.columns = [
            { name: 'UserName', header: 'UserName', width: '15rem', sort: true },
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }
    protected getList(input: any, callBack: Function): void {
       
        this._userLinkService.getLinkedUsers(input.sortField, input.sortMode, false, input.skipCount, input.maxResultCount)
            .pipe(finalize(() => callBack()))
            .subscribe((result) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
            });
    }

    getShownLinkedUserName(linkedUser: LinkedUserDto): string {
        if (!this.multiTenancy.isEnabled) {
            return linkedUser.userName;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.userName;
    }

    deleteLinkedUser(linkedUser: LinkedUserDto): void {
        
        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: linkedUser.userName,
                deleteLabel: this.l('LinkAccount'),
                containerClass: '.delete-link-account'
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass + ' delete-link-account'
        })
        .onClose.subscribe(result => {
            if (result) {
                this.isTableLoading = true;
                const unlinkUserInput = new UnlinkUserInput();
                unlinkUserInput.userId = linkedUser.id;
                unlinkUserInput.tenantId = linkedUser.tenantId;

                this._userLinkService.unlinkUser(unlinkUserInput)
                    .pipe(finalize(() => { this.isTableLoading = false; }))
                    .subscribe(() => {
                        this.refresh();
                        this.parent.getRecentlyLinkUsers();
                        this.notify.success(this.l('SuccessfullyUnlinked'));
                    });
            }
        });
    }

    showCreateLinkUser(): void {
        let linkAccountDialog = this._dialogService.open(CreateLinkAccountModalComponent, {
            data: {},
            header: this.l('Create') + ' ' + this.l('LinkAccount'),
            styleClass: this.responsiveDialogClass + ' create-link-account-dialog'
        });

        linkAccountDialog.onClose.subscribe((result) => {
            if (result) {
                this.refresh();
                this.parent.getRecentlyLinkUsers();
            }
        });
    }

    switchToUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    showInlineActions(user: LinkedUserDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        this.inlineActionMenu.model.push({ label: this.l('Signin'), icon: 'pi pi-fw pi-lock', command: () => { this.switchToUser(user); } });
        this.inlineActionMenu.model.push({ label: this.l('Delete'), icon: 'pi pi-fw pi-trash', command: () => { this.deleteLinkedUser(user); } });

        this.inlineActionMenu.show(event);
    }

}
