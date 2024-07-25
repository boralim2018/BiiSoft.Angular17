import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PasswordComponentBase } from '@shared/app-component-base';
import {
    ProfileServiceProxy,
    AccountServiceProxy,
    RegisterInput,
    RegisterOutput
} from '@shared/service-proxies/service-proxies';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { AppConsts } from '../../shared/AppConsts';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { EqualValidator } from '../../shared/directives/equal-validator.directive';
import { AbpValidationSummaryComponent } from '../../shared/components/validation/abp-validation.summary.component';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../shared/directives/busy.directive';

@Component({
    templateUrl: './register.component.html',
    animations: [accountModuleAnimation()],
    providers: [AccountServiceProxy, ProfileServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, NgClass, NgIf, AbpValidationSummaryComponent, EqualValidator, RecaptchaModule, ButtonDirective, Ripple, RouterLink, LocalizePipe]
})
export class RegisterComponent extends PasswordComponentBase implements OnInit {
    model: RegisterInput = new RegisterInput();
    saving = false;
    @ViewChild('recaptchaRef') recaptchaRef: RecaptchaComponent;
    @ViewChild('recaptchaRefLogin') recaptchaRefLogin: RecaptchaComponent;
    recaptchaSiteKey: string = abp.setting.get('Recaptcha.SiteKey');

    constructor(
        injector: Injector,
        private _accountService: AccountServiceProxy,
        private _router: Router,
        private authService: AppAuthService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.getPasswordComplexity();
    }

    save(form: NgForm): void {

        if (form.invalid) return;

        if (this.useCaptcha) {
            this.recaptchaRef.execute();
        } else {
            this.requestSave();
        }
    }

    requestSave(): void {

        this.saving = true;
        this._accountService
            .register(this.model)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe((result: RegisterOutput) => {
                if (!result.canLogin) {
                    this._router.navigate(['account/login']);
                    return;
                }

                if (!result.canLogin) {
                    this.notify.success(this.l('SuccessfullyRegistered'));
                    this._router.navigate(['/login']);
                    return;
                }

                this.authService.authenticateModel.userNameOrEmailAddress = this.model.userName;
                this.authService.authenticateModel.password = this.model.password;

                if (this.useCaptcha) {
                    this.recaptchaRefLogin.execute();
                } else {
                    this.login();
                }
            },
            err => {
                this.saving = false;
                this.message.error(err.message);
            });
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

}
