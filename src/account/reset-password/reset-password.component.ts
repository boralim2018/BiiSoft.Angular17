import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { PasswordComponentBase } from '@shared/app-component-base';
//import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AccountServiceProxy, PasswordComplexitySetting, ProfileServiceProxy, ResetPasswordOutput, ResolveTenantIdInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ResetPasswordModel } from './reset-password.model';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { AppConsts } from '../../shared/AppConsts';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AbpValidationSummaryComponent } from '../../shared/components/validation/abp-validation.summary.component';
import { EqualValidator } from '../../shared/directives/equal-validator.directive';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { BusyDirective } from '../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: './reset-password.component.html',
    animations: [accountModuleAnimation()],
    providers: [AccountServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, NgClass, InputTextModule, EqualValidator, AbpValidationSummaryComponent, MessageModule, NgIf, RecaptchaModule, ButtonDirective, Ripple, RouterLink, LocalizePipe]
})
export class ResetPasswordComponent extends PasswordComponentBase implements OnInit {

    model: ResetPasswordModel = new ResetPasswordModel();

    saving = false;
    @ViewChild('recaptchaRef') recaptchaRef: RecaptchaComponent;
    @ViewChild('recaptchaRefLogin') recaptchaRefLogin: RecaptchaComponent;
    recaptchaSiteKey: string = abp.setting.get('Recaptcha.SiteKey');

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        public authService: AppAuthService,
        private _activatedRoute: ActivatedRoute,
        //private _profileService: ProfileServiceProxy,
        //private _appUrlService: AppUrlService,
        private _router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this._activatedRoute.snapshot.queryParams['c']) {
            this.model.c = this._activatedRoute.snapshot.queryParams['c'];

            this._accountService.resolveTenantId(new ResolveTenantIdInput({ c: this.model.c })).subscribe((tenantId) => {
                //this.appSession.changeTenantIfNeeded(
                //    tenantId
                //);
            });
            this.getPasswordComplexity();
        }
        else {
            this.model.userId = this._activatedRoute.snapshot.queryParams['userId'];
            this.model.resetCode = this._activatedRoute.snapshot.queryParams['resetCode'];

            this.appSession.changeTenantIfNeeded(
                this.parseTenantId(
                    this._activatedRoute.snapshot.queryParams['tenantId']
                )
            );
        }
       
    }

    save(): void {

        if (this.useCaptcha) {
            this.recaptchaRef.execute();
        } else {
            this.requestSave();
        }
    }

    requestSave(): void {
        this.saving = true;
        this._accountService.resetPassword(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: ResetPasswordOutput) => {

                if (this.recaptchaRef) {
                    this.recaptchaRef.reset();
                }

                if (!result.canLogin) {
                    this._router.navigate(['account/login']);
                    return;
                }

                this.authService.authenticateModel.userNameOrEmailAddress = result.userName;
                this.authService.authenticateModel.password = this.model.password;

                if (this.useCaptcha) {
                    this.recaptchaRefLogin.execute();
                } else {
                    this.login();
                }
            });
    }

    login() {
        // Autheticate
        this.saving = true;   
        this.authService.authenticate(() => {
            this.saving = false;
            if (this.recaptchaRefLogin) {
                this.recaptchaRefLogin.reset();
            }

            location.href = AppConsts.appBaseUrl;
        });
    }

    parseTenantId(tenantIdAsStr?: string): number {
        let tenantId = !tenantIdAsStr ? undefined : parseInt(tenantIdAsStr);
        if (Number.isNaN(tenantId)) {
            tenantId = undefined;
        }

        return tenantId;
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
    }

    captchaResolved(captchaResponse: string): void {
        this.model.captchaResponse = captchaResponse;
        this.requestSave();
    }

    captchaResolvedLogin(captchaResponse: string): void {
        this.authService.authenticateModel.captchaResponse = captchaResponse;
        this.login();
    }
}
