import { Component, Injector, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
//import { AppUrlService } from '@shared/common/nav/app-url.service';
import { AccountServiceProxy, SendPasswordResetCodeInput } from '@shared/service-proxies/service-proxies';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AbpValidationSummaryComponent } from '../../shared/components/validation/abp-validation.summary.component';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    templateUrl: './forgot-password.component.html',
    animations: [accountModuleAnimation()],
    providers: [AccountServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, NgClass, NgIf, AbpValidationSummaryComponent, MessageModule, RecaptchaModule, ButtonDirective, Ripple, RouterLink, LocalizePipe]
})
export class ForgotPasswordComponent extends AppComponentBase {

    model: SendPasswordResetCodeInput = new SendPasswordResetCodeInput();
    saving = false;
    @ViewChild('recaptchaRef') recaptchaRef: RecaptchaComponent;
    recaptchaSiteKey: string = abp.setting.get('Recaptcha.SiteKey');

    constructor (
        injector: Injector,
        private _accountService: AccountServiceProxy,
        //private _appUrlService: AppUrlService,
        private _router: Router
        ) {
        super(injector);
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
        this._accountService.sendPasswordResetCode(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                if (this.recaptchaRef) {
                    this.recaptchaRef.reset();
                }
                this.message.success(this.l('PasswordResetMailSentMessage'), this.l('MailSent')).then(() => {
                    this._router.navigate(['account/login']);
                });
            });
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
    }

    captchaResolved(captchaResponse: string): void {
        this.model.captchaResponse = captchaResponse;
        this.requestSave();
    }
}
