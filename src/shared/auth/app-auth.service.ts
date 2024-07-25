import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TokenService, LogService, UtilsService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import {
    AuthenticateModel,
    AuthenticateResultModel,
    TokenAuthServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppAuthService {
    authenticateModel: AuthenticateModel;
    authenticateResult: AuthenticateResultModel;
    rememberMe: boolean;

    constructor(
        private _tokenAuthService: TokenAuthServiceProxy,
        private _router: Router,
        private _utilsService: UtilsService,
        private _tokenService: TokenService,
        private _logService: LogService,
        private _httpClient: HttpClient
    ) {
        this.clear();
    }

    logout(reload?: boolean, returnUrl?: string): void {
        //abp.auth.clearToken();
        //abp.utils.deleteCookie(AppConsts.authorization.encryptedAuthTokenName);

        //location.href = AppConsts.appBaseUrl;
    
        const cookieLangValue = abp.utils.getCookieValue(
            'Abp.Localization.CultureName'
        );
        const token = abp.auth.getToken();

        const requestHeaders = {
            'Abp.TenantId': `${abp.multiTenancy.getTenantIdCookie()}`,
            '.AspNetCore.Culture': `c=${cookieLangValue}|uic=${cookieLangValue}`,
        };

        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        this._httpClient
            .get<any>(
                `${AppConsts.remoteServiceBaseUrl}/api/TokenAuth/LogOut`,
                {
                    headers: requestHeaders,
                }
            )
            .subscribe(() => {
                abp.auth.clearToken();
                abp.utils.deleteCookie(AppConsts.authorization.encryptedAuthTokenName);
                //abp.utils.setCookieValue(AppConsts.authorization.encryptedAuthTokenName, undefined);

                if (reload !== false) {
                    if (returnUrl) {
                        location.href = returnUrl;
                    } else {
                        location.href = '';
                    }
                }
            }
        );
    }




    authenticate(finallyCallback?: () => void): void {
        finallyCallback = finallyCallback || (() => { });

        this._tokenAuthService
            .authenticate(this.authenticateModel)
            .pipe(
                finalize(() => {
                    finallyCallback();
                })
            )
            .subscribe((result: AuthenticateResultModel) => {
                this.processAuthenticateResult(result);
            });
    }

    private processAuthenticateResult(
        authenticateResult: AuthenticateResultModel
    ) {
        this.authenticateResult = authenticateResult;

        if (authenticateResult.accessToken) {
            // Successfully logged in
            this.login(
                authenticateResult.accessToken,
                authenticateResult.encryptedAccessToken,
                authenticateResult.expireInSeconds,
                this.rememberMe
            );
        } else {
            // Unexpected result!

            this._logService.warn('Unexpected authenticateResult!');
            this._router.navigate(['account/login']);
        }
    }

    private login(
        accessToken: string,
        encryptedAccessToken: string,
        expireInSeconds: number,
        rememberMe?: boolean
    ): void {
        const tokenExpireDate = rememberMe
            ? new Date(new Date().getTime() + 1000 * expireInSeconds)
            : undefined;

        this._tokenService.setToken(accessToken, tokenExpireDate);

        this._utilsService.setCookieValue(
            AppConsts.authorization.encryptedAuthTokenName,
            encryptedAccessToken,
            tokenExpireDate,
            abp.appPath
        );

        let initialUrl = UrlHelper.initialUrl;
        if (initialUrl.indexOf('/login') > 0) {
            initialUrl = AppConsts.appBaseUrl;
        }

        location.href = initialUrl;
    }

    private clear(): void {
        this.authenticateModel = new AuthenticateModel();
        this.authenticateModel.rememberClient = false;
        this.authenticateResult = null;
        this.rememberMe = false;
    }
}
