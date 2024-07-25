import { Injectable } from '@angular/core';
import { AccountServiceProxy, SwitchToLinkedAccountInput, SwitchToLinkedAccountOutput } from '@shared/service-proxies/service-proxies';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AppUrlService } from '@shared/nav/app-url.service';

@Injectable()
export class LinkedAccountService {

    constructor(
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _authService: AppAuthService
    ) {

    }

    switchToAccount(userId: number, tenantId?: number): void {

        const input = new SwitchToLinkedAccountInput();
        input.targetUserId = userId;
        input.targetTenantId = tenantId;

        this._accountService.switchToLinkedAccount(input)
            .subscribe((result: SwitchToLinkedAccountOutput) => {
                let targetUrl = this._appUrlService.getAppRootUrlOfTenant(result.tenancyName) + '?switchAccountToken=' + result.switchAccountToken;
                if (input.targetTenantId) {
                    targetUrl = targetUrl + '&tenantId=' + input.targetTenantId;
                }

                this._authService.logout(true, targetUrl);
            });
    }
}
