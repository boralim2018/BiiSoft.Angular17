import { AbpMultiTenancyService } from 'abp-ng2-module';
import { Injectable } from '@angular/core';
import {
    CompanyAdvanceSettingDto,
    ApplicationInfoDto,
    CompanyGeneralSettingDto,
    GetCurrentLoginInformationsOutput,
    ItemSettingDto,
    SessionServiceProxy,
    TenantLoginInfoDto,
    UserLoginInfoDto
} from '@shared/service-proxies/service-proxies';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _generalSetting: CompanyGeneralSettingDto;
    private _advanceSetting: CompanyAdvanceSettingDto;
    private _itemSetting: ItemSettingDto;

    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    get generalSetting(): CompanyGeneralSettingDto {
        return this._generalSetting;
    }

    get advanceSetting(): CompanyAdvanceSettingDto {
        return this._advanceSetting;
    }

    get itemSetting(): ItemSettingDto {
        return this._itemSetting;
    }

    getShownLoginName(): string {
        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                this._generalSetting = result.generalSetting;
                this._advanceSetting = result.advanceSetting;
                this._itemSetting = result.itemSetting;
                resolve(true);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
}
