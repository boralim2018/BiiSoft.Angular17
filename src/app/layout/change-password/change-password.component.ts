import { NgClass, NgIf } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { ChangePasswordInput, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { ButtonDirective } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Ripple } from 'primeng/ripple';
import { finalize } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { PasswordComponentBase } from '../../../shared/app-component-base';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { EqualValidator } from '../../../shared/directives/equal-validator.directive';

@Component({
    selector: 'changePassword',
    templateUrl: './change-password.component.html',
    providers: [ProfileServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, PasswordModule, NgClass, NgIf, InputTextModule, EqualValidator, AbpValidationSummaryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class ChangePasswordComponent extends Mixin(DynamicDialogBase, PasswordComponentBase) implements OnInit {

    saving = false;
    confirmNewPassword: string;
    model: ChangePasswordInput = new ChangePasswordInput();
    containerClass: string = ".change-password-dialog"


    constructor(
        injector: Injector,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getPasswordComplexity();
    }

    save(): void {
        this.saving = true;
       
        this.profileService.changePassword(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }
}
