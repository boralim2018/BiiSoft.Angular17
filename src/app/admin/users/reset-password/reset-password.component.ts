import { Component, OnInit, Injector } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { UserServiceProxy, ResetPasswordDto } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    providers: [UserServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class ResetPasswordDialogComponent extends DynamicDialogBase
    implements OnInit {
    public isLoading = false;
    public resetPasswordDto: ResetPasswordDto;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();

        this.isLoading = true;
        this.resetPasswordDto = new ResetPasswordDto();
        this.resetPasswordDto.userId = this._dialogConfig.data.id;
        this.resetPasswordDto.newPassword = Math.random()
            .toString(36)
            .substr(2, 10);
        this.isLoading = false;
    }

    public resetPassword(): void {
        this.isLoading = true;
        this._userService.resetPassword(this.resetPasswordDto)
            .pipe(finalize(() => { this.isLoading = false; }))
            .subscribe((result) => {
                this.notify.success('Password Reset');
                this._dialogRef.close();
            });
    }
}
