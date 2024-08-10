import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FindUsersInput, UserDto, UserDtoPagedResultDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { PrimeNgListComponentBase } from '@shared/prime-ng-list-component-base';
import { Table, TableModule } from 'primeng/table';
import { Menu, MenuModule } from 'primeng/menu';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgStyle, NgFor, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { of } from 'rxjs';

@Component({
    selector: 'app-login-as-tenant',
    templateUrl: './login-as-tenant.component.html',
    styleUrls: ['./login-as-tenant.component.scss'],
    animations: [appModuleAnimation()],
    providers: [UserServiceProxy],
    standalone: true,
    imports: [MenuModule, TableModule, PrimeTemplate, NgStyle, NgFor, NgIf, ButtonDirective, Ripple]
})
export class LoginAsTenantComponent extends PrimeNgListComponentBase<UserDto> implements OnInit {
    protected get sortField(): string { return 'UserName'; }

    @ViewChild('chooseUserTable') table: Table;
    @ViewChild('inlineActionMenu') inlineActionMenu: Menu;
    inlineActionVisible: boolean = true;

    constructor(
        injector: Injector,
        public _userService: UserServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    protected initColumns() {
        this.columns = [
            { name: 'UserName', header: 'UserName', width: '15rem', sort: true },
            { name: 'FullName', header: 'FullName', width: '15rem' },
            { name: 'EmailAddress', header: 'EmailAddress', sort: true }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function) {

        let filterInput = new FindUsersInput();
        filterInput.init(input);
        filterInput.tenantId = this._dialogConfig.data.id;

        this._userService
            .findUsers(filterInput)
            .pipe(
                finalize(() => callBack()),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result: UserDtoPagedResultDto) => {
                this.listItems = result.items;
                this.totalCount = result.totalCount;
            });
    }

    showInlineActions(user: UserDto, event: Event) {
        if (!this.inlineActionMenu) return;

        this.inlineActionMenu.model = [];
        this.inlineActionMenu.model.push({ label: this.l('Signin'), icon: 'pi pi-fw pi-lock', command: () => { this.signInUser(user); } });
        
        this.inlineActionMenu.show(event);
    }

    signInUser(user: UserDto) {
        this._dialogRef.close(user);
    }
}
