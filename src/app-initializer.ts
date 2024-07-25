import { Injectable, Injector } from '@angular/core';
import { PlatformLocation, registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment-timezone';
import { filter as _filter, merge as _merge } from 'lodash-es';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/session/app-session.service';
import { environment } from './environments/environment';
import { AccountServiceProxy, IsTenantAvailableInput, IsTenantAvailableOutput, TenantAvailabilityState } from '@shared/service-proxies/service-proxies';
import { SubdomainTenantResolver } from '@shared/multi-tenancy/tenant-resolvers/subdomain-tenant-resolver';
import { QueryStringTenantResolver } from '@shared/multi-tenancy/tenant-resolvers/query-string-tenant-resolver';
import { UrlHelper } from './shared/helpers/UrlHelper';

@Injectable({
    providedIn: 'root',
})
export class AppInitializer {
    constructor(
        private _injector: Injector,
        private _platformLocation: PlatformLocation,
        private _httpClient: HttpClient
    ) { }

    init(): () => Promise<boolean> {
        return () => {
            abp.ui.setBusy();
            return new Promise<boolean>((resolve, reject) => {
                AppConsts.appBaseHref = this.getBaseHref();
                const appBaseUrl = this.getDocumentOrigin() + AppConsts.appBaseHref;
                this.getApplicationConfig(appBaseUrl, () => {
                    const callback = () => {
                        abp.event.trigger('abp.dynamicScriptsInitialized');
                        // do not use constructor injection for AppSessionService
                        const appSessionService = this._injector.get(AppSessionService);
                        appSessionService.init().then(
                            (result) => {
                                abp.ui.clearBusy();
                                if (this.shouldLoadLocale()) {
                                    const angularLocale = this.convertAbpLocaleToAngularLocale(
                                        abp.localization.currentLanguage.name
                                    );      
                                    import(`/node_modules/@angular/common/locales/${angularLocale}.mjs`).then(
                                        (module) => {
                                            registerLocaleData(module.default);
                                            resolve(result);
                                        },
                                        reject
                                    );
                                } else {
                                    resolve(result);
                                }
                            },
                            (err) => {
                                abp.ui.clearBusy();
                                reject(err);
                            }
                        );
                    }

                    const queryStringObj = UrlHelper.getQueryParameters();

                    if (queryStringObj.impersonationToken) {
                        this.impersonatedAuthenticate(queryStringObj.impersonationToken, queryStringObj.tenantId, () => { this.getUserConfiguration(callback); });
                    }
                    else if (queryStringObj.switchAccountToken) {
                        this.linkedAccountAuthenticate(queryStringObj.switchAccountToken, queryStringObj.tenantId, () => { this.getUserConfiguration(callback); });
                    }
                    else {
                        this.getUserConfiguration(callback);
                    }
                });
            });
        };
    }

    private getBaseHref(): string {
        const baseUrl = this._platformLocation.getBaseHrefFromDOM();
        if (baseUrl) {
            return baseUrl;
        }

        return '/';
    }

    private getDocumentOrigin(): string {
        if (!document.location.origin) {
            const port = document.location.port ? ':' + document.location.port : '';
            return (
                document.location.protocol + '//' + document.location.hostname + port
            );
        }

        return document.location.origin;
    }

    private shouldLoadLocale(): boolean {
        return (
            abp.localization.currentLanguage.name &&
            abp.localization.currentLanguage.name !== 'en-US'
        );
    }

    private convertAbpLocaleToAngularLocale(locale: string): string {
        if (!AppConsts.localeMappings) {
            return locale;
        }

        const localeMapings = _filter(AppConsts.localeMappings, { from: locale });
        if (localeMapings && localeMapings.length) {
            return localeMapings[0]['to'];
        }

        return locale;
    }

    private getCurrentClockProvider(
        currentProviderName: string
    ): abp.timing.IClockProvider {
        if (currentProviderName === 'unspecifiedClockProvider') {
            return abp.timing.unspecifiedClockProvider;
        }

        if (currentProviderName === 'utcClockProvider') {
            return abp.timing.utcClockProvider;
        }

        return abp.timing.localClockProvider;
    }

    private getUserConfiguration(callback: () => void): void {
        const cookieLangValue = abp.utils.getCookieValue(
            'Abp.Localization.CultureName'
        );
        const token = abp.auth.getToken();

        let tenantId = abp.multiTenancy.getTenantIdCookie();

        const requestHeaders = {
            'Abp.TenantId': `${tenantId}`,
            '.AspNetCore.Culture': `c=${cookieLangValue}|uic=${cookieLangValue}`,
        };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        let url = `${AppConsts.remoteServiceBaseUrl}/AbpUserConfiguration/GetAll`;

        this._httpClient
            .get<any>(
                url,
                {
                    headers: requestHeaders,
                }
            )
            .subscribe((response) => {
                const result = response.result;

                _merge(abp, result);

                abp.clock.provider = this.getCurrentClockProvider(
                    result.clock.provider
                );

                moment.locale(abp.localization.currentLanguage.name);

                if (abp.clock.provider.supportsMultipleTimezone) {
                    moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
                }

                callback();
            },
            err => {
                console.log(err);   
            });
    }

    private getApplicationConfig(appRootUrl: string, callback: () => void) {
        this._httpClient
            .get<any>(`${appRootUrl}assets/${environment.appConfig}`, {
                headers: {
                    'Abp.TenantId': `${abp.multiTenancy.getTenantIdCookie()}`,
                },
            })
            .subscribe((response) => {
                AppConsts.appName = response.appName;
                AppConsts.appBaseUrl = response.appBaseUrl;
                AppConsts.remoteServiceBaseUrl = response.remoteServiceBaseUrl;
                AppConsts.localeMappings = response.localeMappings;

                // Find tenant from subdomain
                var tenancyName = this.resolveTenancyName(response.appBaseUrl);

                if (tenancyName == null) {
                    callback();
                } else {
                    this.ConfigureTenantIdCookie(tenancyName, callback);
                }
            });
    }

    private ConfigureTenantIdCookie(tenancyName: string, callback: () => void) {
        let accountServiceProxy: AccountServiceProxy = this._injector.get(AccountServiceProxy);
        let input = new IsTenantAvailableInput();
        input.tenancyName = tenancyName;

        accountServiceProxy.isTenantAvailable(input).subscribe((result: IsTenantAvailableOutput) => {
            if (result.state === TenantAvailabilityState._1) { // Available
                abp.multiTenancy.setTenantIdCookie(result.tenantId);
            }

            callback();
        });
    }

    private resolveTenancyName(appBaseUrl): string | null {
        var subdomainTenantResolver = new SubdomainTenantResolver();
        var tenancyName = subdomainTenantResolver.resolve(appBaseUrl);
        if (tenancyName) {
            return tenancyName;
        }

        var queryStirngTenantResolver = new QueryStringTenantResolver();
        var tenancyName = queryStirngTenantResolver.resolve(appBaseUrl);
        if (tenancyName) {
            return tenancyName;
        }

        // add other tenancy resolvers here, ex: CookieTenantResolver, QueryStringTenantResolver etc...

        return null;
    }


    private impersonatedAuthenticate(impersonationToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
            'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
        };

        this._httpClient.post(
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/ImpersonatedAuthenticate?impersonationToken=' + impersonationToken,
            requestHeaders)
            .subscribe(
                (response: any) => {
                    let result = response.result;
                    abp.auth.setToken(result.accessToken);
                    this.setEncryptedTokenCookie(result.encryptedAccessToken);
                    location.search = '';
                    callback();
                },
                err => {
                    abp.message.error(err.message);
                }
            );
    }

    private setEncryptedTokenCookie(encryptedToken: string) {
        abp.utils.setCookieValue(AppConsts.authorization.encryptedAuthTokenName,
            encryptedToken,
            new Date(new Date().getTime() + 365 * 86400000), //1 year
            abp.appPath
        );
    }

    private linkedAccountAuthenticate(switchAccountToken: string, tenantId: number, callback: () => void): void {
        abp.multiTenancy.setTenantIdCookie(tenantId);
        const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName');

        let requestHeaders = {
            '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
            'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
        };

        this._httpClient.post(
            AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LinkedAccountAuthenticate?switchAccountToken=' + switchAccountToken,
            requestHeaders)
            .subscribe((response: any) => {
                let result = response.result;
                abp.auth.setToken(result.accessToken);
                this.setEncryptedTokenCookie(result.encryptedAccessToken);
                location.search = '';
                callback();
            },
                err => {
                    abp.message.error(err.message);
                }
            );
    }

}
