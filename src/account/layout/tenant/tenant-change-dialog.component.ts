import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppTenantAvailabilityState } from '@shared/AppEnums';
import {
    IsTenantAvailableInput,
    IsTenantAvailableOutput
} from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';

import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: './tenant-change-dialog.component.html',
    animations: [accountModuleAnimation()],
    providers: [AccountServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, MessageModule, ButtonDirective, Ripple, LocalizePipe]
})
export class TenantChangeDialogComponent extends AppComponentBase{
    saving = false;
    tenancyName = '';

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.initData(this._dialogConfig.data);
    }

    initData(data) {
        if (data) {
            this.tenancyName = data.tenancyName;
        }
    }

    save(): void {
        if (!this.tenancyName) {
            abp.multiTenancy.setTenantIdCookie(undefined);
            this._dialogRef.close();
            location.reload();
            return;
        }

        const input = new IsTenantAvailableInput();
        input.tenancyName = this.tenancyName;

        this.saving = true;
        this._accountService.isTenantAvailable(input).subscribe(
            (result: IsTenantAvailableOutput) => {
                switch (result.state) {
                    case AppTenantAvailabilityState.Available:
                        abp.multiTenancy.setTenantIdCookie(result.tenantId);
                        location.reload();
                        return;
                    case AppTenantAvailabilityState.InActive:
                        this.message.warn(this.l('TenantIsNotActive', this.tenancyName), this.l("ChangeTenant"));
                        break;
                    case AppTenantAvailabilityState.NotFound:
                        this.message.warn(this.l('ThereIsNoTenantDefinedWithName{0}', this.tenancyName), this.l("ChangeTenant"));
                        break;
                }
            },
            err => {
                this.saving = false;
            },
            () => {
                this.saving = false;
            }
        );
    }
}
