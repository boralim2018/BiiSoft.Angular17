import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AbpSessionService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { AbpValidationSummaryComponent } from '../../shared/components/validation/abp-validation.summary.component';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../shared/directives/busy.directive';

@Component({
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, NgClass, NgIf, AbpValidationSummaryComponent, PasswordModule, CheckboxModule, RouterLink, RecaptchaModule, ButtonDirective, Ripple, LocalizePipe]
})
export class LoginComponent extends AppComponentBase implements OnInit {

    submitting = false;
    @ViewChild('recaptchaRef') recaptchaRef: RecaptchaComponent;
    recaptchaSiteKey: string = abp.setting.get('Recaptcha.SiteKey');

    constructor(
        injector: Injector,
        public authService: AppAuthService,
        private _sessionService: AbpSessionService
    ) {
        super(injector);
    }

    ngOnInit() {

    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return true;
    }

    login(form: NgForm): void {

        if (form.invalid) return;

        if (this.useCaptcha) {
            this.recaptchaRef.execute();
        } else {
            this.requestLogin();
        }
    }

    requestLogin() {
        this.submitting = true;
        this.authService.authenticate(() => {
            this.submitting = false;
            if (this.recaptchaRef) {
                this.recaptchaRef.reset();
            }
        });
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
    }

    captchaResolved(captchaResponse: string): void {
        this.authService.authenticateModel.captchaResponse = captchaResponse;
        this.requestLogin();
    }
}
