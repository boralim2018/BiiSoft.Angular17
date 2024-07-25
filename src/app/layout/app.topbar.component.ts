import { Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { BFileComponentBase } from '@shared/app-component-base';
import { ChangeUserLanguageDto, LinkedUserDto, UserLinkServiceProxy, AccountServiceProxy, UserSettingsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { LayoutService } from "./service/app.layout.service";
import { AbpSessionService } from 'abp-ng2-module';
import { ImpersonationService } from './service/impersonation.service';
import { filter as _filter } from 'lodash-es';
import { DialogService } from 'primeng/dynamicdialog';
import { LinkedAccountsModalComponent } from './link-account/linked-accounts-modal.component';
import { LinkedAccountService } from './link-account/linked-account.service';
import { finalize } from 'rxjs';
import { ChangeProfileComponent } from './profile/change-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginAttemptComponent } from './login-attempt/login-attempt.component';
import { AppConsts } from '../../shared/AppConsts';
import { SafeUrlPipe } from '@shared/pipes/safe-resource-url.pipe';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { BadgeModule } from 'primeng/badge';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [DialogService, UserSettingsServiceProxy, UserLinkServiceProxy, LinkedAccountService, AccountServiceProxy, ImpersonationService],
    standalone: true,
    imports: [RouterLink, NgClass, NgIf, NgFor, BadgeModule, SidebarModule, ButtonDirective, Ripple, DividerModule, InputSwitchModule, FormsModule, SafeUrlPipe]
})
export class AppTopBarComponent extends BFileComponentBase {

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    isImpersonatedLogin: boolean;
    showUserSetting: boolean;
    showNotificationSetting: boolean;
    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;

    tenancyName: string;
    userName: string;
    isMultiTenancyEnabled: boolean = abp.multiTenancy.isEnabled;

    recentlyLinkedUsers: LinkedUserDto[] = [];
    loading: boolean;

    profilePictureUrl: string = "assets/images/blank-user.png";

    constructor(
        injector: Injector,
        private _userSettingService: UserSettingsServiceProxy,
        private _userLinkService: UserLinkServiceProxy,
        private _linkedAccountService: LinkedAccountService,
        private _accountService: AccountServiceProxy,
        private _authService: AppAuthService,
        private _abpSessionService: AbpSessionService,
        private _impersonationService: ImpersonationService,
        private _dialogService: DialogService,
        public layoutService: LayoutService) {
        super(injector);
    }

    ngOnInit(): void {

        this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;

        this.languages = _filter(this.localization.languages, (l) => !l.isDisabled);
        this.currentLanguage = this.localization.currentLanguage;

        this.tenancyName = this.appSession.tenant ? this.appSession.tenant.tenancyName : ".";
        this.userName = this.appSession.user.userName;

        this.getRecentlyLinkUsers();

        this.loadProfile();
    }

    private loadProfile() {
        if (this.appSession.user.profilePictureId) {
            this.download(this.appSession.user.profilePictureId, 'blob', (result: any) => {
                if (result) this.profilePictureUrl = URL.createObjectURL(result);
            })
        }
    }

    logout(): void {
        this._authService.logout();
    }

    backToMyAccount(): void {
        this._impersonationService.backToImpersonator();
    }

    showNotifications(event: Event) {
        //get notification
        //api access

        this.showNotificationSetting = true;
    }

    changeLanguage(languageName: string): void {
        const input = new ChangeUserLanguageDto();
        input.languageName = languageName;

        this._accountService.changeLanguage(input).subscribe(() => {
            abp.utils.setCookieValue(
                AppConsts.config.localize, 
                languageName,
                AppConsts.config.cookieExpiredDate, 
                abp.appPath
            );

            window.location.reload();
        });
    }

    showProfile() {
        let profileDialog = this._dialogService.open(ChangeProfileComponent, {
            data: { parent: this },
            header: this.l('Profile'),
            styleClass: this.responsiveDialogClass + ' change-profile-dialog'
        });

        //profileDialog.onClose.subscribe((result) => {
        //    if (result) this.getRecentlyLinkUsers();
        //});
    }

    showChangePassword() {
        let passwordDialog = this._dialogService.open(ChangePasswordComponent, {
            data: { parent: this },
            header: this.l('ChangePassword'),
            styleClass: this.responsiveDialogClass + ' change-password-dialog'
        });

        //passwordDialog.onClose.subscribe((result) => {
        //    if (result) this.getRecentlyLinkUsers();
        //});
    }

    showLoginAttempt() {
        let loginAttemptDialog = this._dialogService.open(LoginAttemptComponent, {
            data: { parent: this },
            header: this.l('LoginAttempt'),
            styleClass: this.responsiveDialogClass
        });
    }

    showManageLinkAccount() {
        let linkAccountDialog = this._dialogService.open(LinkedAccountsModalComponent, {
            data: { parent: this },
            header: this.l('ManageLinkAccount'),
            styleClass: this.responsiveDialogClass
        });

        linkAccountDialog.onClose.subscribe((result) => {
            if (result) this.getRecentlyLinkUsers();
        });
    }

    getRecentlyLinkUsers(): void {
        this.loading = true;
        this._userLinkService.getRecentlyUsedLinkedUsers()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe(result => {
                this.recentlyLinkedUsers = result.items;
            }
            );
    }

    getShownLinkedUserName(linkedUser: LinkedUserDto): string {
        if (!this.multiTenancy.isEnabled) {
            return linkedUser.userName;
        }

        return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.userName;
    }


    switchToUser(linkedUser: LinkedUserDto): void {
        this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    }

    onUIEnableChange(event) {
        this._userSettingService.updateUIEnable(event).subscribe(() => {});
    }
}
