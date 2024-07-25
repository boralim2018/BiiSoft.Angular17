import { Injector, ElementRef, Component, OnInit } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    LocalizationService,
    PermissionCheckerService,
    FeatureCheckerService,
    //NotifyService,
    SettingService,
    MessageService,
    AbpMultiTenancyService,
    TokenService
} from 'abp-ng2-module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSessionService } from '@shared/session/app-session.service';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { LayoutService } from '../app/layout/service/app.layout.service';
import { PasswordComplexitySetting, ProfileServiceProxy } from './service-proxies/service-proxies';
import { AbpValidationError } from './components/validation/abp-validation.api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BiiNotifyService } from './services/bii.nofity.service'
import { CacheService } from '@shared/services/cache.service';
import { camelCase } from 'lodash-es';

export abstract class LocalizeComponent {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;
    localization: LocalizationService;

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    isObject(obj: any): boolean {
        return typeof obj === 'object';
    }

    toCamelCase(str: string): string {
        return camelCase(str);
    }

    getObjValue(obj, key: string) {
        if (!obj || !this.isObject(obj)) return obj;
        if (obj[key] !== undefined) return obj[key];
        if (obj[this.toCamelCase(key)] !== undefined) return obj[this.toCamelCase(key)];

        for (let k in obj) {
            if (k.toLocaleLowerCase() === key.toLocaleLowerCase()) return obj[k];
        }

        return obj;
    }

    getObjLocalizeName(obj: any) {
        let name = this.localization.currentLanguage.isDefault ? 'name' : 'displayName';
        return this.getObjValue(obj, name);
    }
}

export abstract class AppComponentBase extends LocalizeComponent {

    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    //notify: NotifyService
    notify: BiiNotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    elementRef: ElementRef;
    carchService: CacheService;

    isHost: boolean;

    responsiveDialogClass: string = 'w-full lg:w-11 xl:w-6';
   
    constructor(injector: Injector) {
        super(injector);

        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        //this.notify = injector.get(NotifyService);
        this.notify = injector.get(BiiNotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.elementRef = injector.get(ElementRef);
        this.carchService = injector.get(CacheService);
       
        this.isHost = this.appSession.tenantId === undefined || this.appSession.tenantId === null;
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }

    clearCookies() {
        document.cookie.split(";").map(k => abp.utils.deleteCookie(k.substring(0, k.indexOf("=")).trim(), abp.appPath));       
    }

    isNullOrSpaces(str: string) {
        return str === null || str === undefined || str.match(/^ *$/) !== null;
    }

    get isMobile(): boolean {
        return window.innerWidth <= 960;
    }

    getDialogInstance(ref: DynamicDialogRef, service: DialogService): any {
        let dialogRef = service.dialogComponentRefMap.get(ref);
        dialogRef.changeDetectorRef.detectChanges();
        return dialogRef.instance.componentRef.instance;
    }

    isArray(arr: any): boolean {
        return arr instanceof Array;
    }
}

export abstract class NavBarComponentBase extends LocalizeComponent {

    title: string;
    navBarItems: any[] = [
        { label: this.l("Apps"), routerLink: "/app/apps" },
    ];

    constructor(injector: Injector) {
        super(injector);
    }

    setTitle() {
        if (this.title) {
            let navTitle = "/";
           
            if (this.navBarItems && this.navBarItems.length) {

                navTitle += this.navBarItems.map(m => m.label).join("/");
                navTitle += "/";

                this.navBarItems.push({ label: this.title });
            }

            document.title = AppConsts.appName + navTitle + this.title;
        }
    }
}


export abstract class PasswordComponentBase extends AppComponentBase {

    passwordValidationErrors: Partial<AbpValidationError>[] = [];
    confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
        {
            name: 'validateEqual',
            localizationKey: 'PasswordsDoNotMatch',
        },
    ];

    passwordComplexitySetting: PasswordComplexitySetting = new PasswordComplexitySetting();
    profileService: ProfileServiceProxy;

    showPassword: boolean;
    showConfirmPassword: boolean;

    constructor(injector: Injector, ) {
        super(injector);
        this.profileService = injector.get(ProfileServiceProxy);
    }

    getPasswordComplexity() {
        this.profileService.getPasswordComplexitySetting().subscribe(passwordComplexityResult => {
            this.passwordComplexitySetting = passwordComplexityResult.setting;

            let requiredLength = this.passwordComplexitySetting.requiredLength > 0 ? " " + this.l("CharacterLength", this.passwordComplexitySetting.requiredLength) : "";
            let requiredLowerCase = this.passwordComplexitySetting.requireLowercase ? " " + this.l("Lowercase") : "";
            let requiredUpperCase = this.passwordComplexitySetting.requireUppercase ? " " + this.l("Uppercase") : "";
            let requiredDigit = this.passwordComplexitySetting.requireDigit ? " " + this.l("Number") : "";
            let requiredNonAlphanumeric = this.passwordComplexitySetting.requireNonAlphanumeric ? " " + this.l("SpecialCharacter") : "";
            let localizationKey = this.l("PasswordsMustBeAtLeastContain") + requiredLowerCase + requiredUpperCase + requiredDigit + requiredNonAlphanumeric + requiredLength;

            this.passwordValidationErrors = [{ name: 'pattern', localizationKey: localizationKey }];
        });
    }
}

export abstract class AppLayoutComponentBase extends AppComponentBase {

    layoutService: LayoutService;
    scales: number[] = [11, 12, 13, 14, 15, 16, 17];

    constructor(injector: Injector) {
        super(injector);
        this.layoutService = injector.get(LayoutService);
    }
}

export abstract class PdfFileComponentBase extends AppComponentBase {

    protected http: HttpClient;
    protected _tokenService: TokenService;

    loading: boolean;

    constructor(injector: Injector) {
        super(injector);
        this.http = injector.get(HttpClient);
        this._tokenService = injector.get(TokenService);
    }

    pdfPreview(url: string) {
        this.loading = true;
        this.http.get(
            url,
            {
                headers: { 'Authorization': `Bearer ${this._tokenService.getToken()}` },
                responseType: 'blob'
            })
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((response: Blob) => {
                let objectUrl = window.URL.createObjectURL(response);
                let win = window.open(objectUrl);
                win.print();
            },
            err => {
                this.loading = false;
                this.message.error(err.message);
            });
    }

    downloadPdf(url: string, downloadName?: string) {
        this.loading = true;
        this.http.get(
            url,
            {
                headers: { 'Authorization': `Bearer ${this._tokenService.getToken()}` },
                responseType: 'blob'
            })
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((response: Blob) => {
                let objectUrl = window.URL.createObjectURL(response);
                let anchor = document.createElement("a");
                anchor.href = objectUrl;
                anchor.download = downloadName ? downloadName : moment().format("YYYY-MM-DD-HH-mm-ss") + ".pdf";
                anchor.click();
            },
            err => {
                this.loading = false;
                this.message.error(err.message);
            });
    }
}

export abstract class ExcelFileComponentBase extends AppComponentBase {

    protected http: HttpClient;
    protected _tokenService: TokenService;

    loading: boolean;

    constructor(injector: Injector) {
        super(injector);
        this.http = injector.get(HttpClient);
        this._tokenService = injector.get(TokenService);
    }

    importExcel(file: File, onSuccess?: (result: any) => void) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', file.type);
        formData.append('fileName', file.name);

        const url = AppConsts.remoteServiceBaseUrl + "/File/ImportExcelFile";
        const options = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this._tokenService.getToken()}`
            }),
        }

        this.loading = true;
        this.http.post(url, formData, options,)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((response: any) => {
                if (response.success) {
                    if (onSuccess) onSuccess(response.result);
                }
            },
            err => {
                this.loading = false;
                this.message.error(err.message);
            });
    }

    downloadExcel(url: string, downloadName?: string) {
        this.loading = true;
        this.http.get(
            url,
            {
                headers: { 'Authorization': `Bearer ${this._tokenService.getToken()}` },
                responseType: 'blob'
            })
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((response: Blob) => {
                let objectUrl = window.URL.createObjectURL(response);
                let anchor = document.createElement("a");
                anchor.href = objectUrl;
                anchor.download = downloadName ? downloadName : moment().format("YYYY-MM-DD-HH-mm-ss") + ".xlsx";
                anchor.click();
            },
            err => {
                this.loading = false;
                this.message.error(err.message);
            });
    }
}

export abstract class BFileComponentBase extends AppComponentBase {

    private http: HttpClient;
    private _tokenService: TokenService;

    blankProfileUrl: string = 'assets/images/blank-user.png';
    uploadUrl: string = '/BFile/Upload';

    loading: boolean;

    constructor(injector: Injector) {
        super(injector);
        this.http = injector.get(HttpClient);
        this._tokenService = injector.get(TokenService);
    }

    upload(file: File, uploadFrom: number, onSuccess?: (result: any) => void) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('displayName', file.name);
        formData.append('uploadSource', `${uploadFrom}`);

        const url = AppConsts.remoteServiceBaseUrl + this.uploadUrl;
        const options = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${this._tokenService.getToken()}`
            }),
        }

        this.loading = true;
        this.http.post(url, formData, options,)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((response: any) => {
                if (response.success) {
                    if (onSuccess) onSuccess(response.result);
                }
            },
            err => {
                this.loading = false;
                this.message.error(err.message);
            });
    }

    download(fileId: string, responeType: any, onSuccess?: (result: any) => void) {
        this.loading = true;

        this.http.get(
            AppConsts.remoteServiceBaseUrl + "/BFile/Index?id=" + fileId,
            {
                headers: { 'Authorization': `Bearer ${this._tokenService.getToken()}` },
                responseType: responeType
            })
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((response: any) => {
                if (onSuccess) onSuccess(response);
            },
            err => {
                this.loading = false;
                this.message.error(err.message);
            });
    }

}
