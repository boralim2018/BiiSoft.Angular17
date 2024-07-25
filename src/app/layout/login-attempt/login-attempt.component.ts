import { Component, Injector, OnInit } from '@angular/core';
import { UserLoginAttemptDto, UserLoginServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BFileComponentBase } from '@shared/app-component-base';
import { Mixin } from 'ts-mixer';
import { SafeUrlPipe } from '@shared/pipes/safe-resource-url.pipe';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'loginAttempt',
    templateUrl: './login-attempt.component.html',
    styleUrls: ['./login-attempt.component.scss'],
    providers: [UserLoginServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, NgIf, NgFor, NgClass, ButtonDirective, Ripple, LocalizePipe, SafeUrlPipe]
})
export class LoginAttemptComponent extends Mixin(DynamicDialogBase, BFileComponentBase) implements OnInit {

    loading = false;
    userLoginAttempts: UserLoginAttemptDto[];
    userProfilePictureUrl: string = this.blankProfileUrl;

    constructor(
        injector: Injector,
        private _userLoginService: UserLoginServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.userProfilePictureUrl = this._dialogConfig.data?.parent ? this._dialogConfig.data.parent.profilePictureUrl: this.blankProfileUrl;
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadData();
    }

    loadData(): void {
        this.loading = true;

        this._userLoginService.getRecentUserLoginAttempts()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe(
                result => {
                    this.userLoginAttempts = result.items;
                },
                err => {
                    this.loading = false;
                    this.message.error(err.message);
                }
            );
    }

    close() {
        this._dialogRef.close();
    }
}
