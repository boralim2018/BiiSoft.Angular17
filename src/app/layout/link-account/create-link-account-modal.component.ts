import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { LinkToUserInput, UserLinkServiceProxy } from '@shared/service-proxies/service-proxies';
import { catchError, finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { NgClass, NgIf } from '@angular/common';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    selector: 'createLinkAccountModal',
    templateUrl: './create-link-account-modal.component.html',
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, NgClass, NgIf, PasswordModule, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateLinkAccountModalComponent extends DynamicDialogBase implements OnInit {

    saving = false;
    linkUser: LinkToUserInput = new LinkToUserInput();
    containerClass: string = ".create-link-account-dialog"

    constructor(
        injector: Injector,
        private _userLinkService: UserLinkServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.linkUser = new LinkToUserInput();
        this.linkUser.tenancyName = this.appSession.tenant?.tenancyName;
    }

    save(): void {
        this.saving = true;
        this._userLinkService.linkToUser(this.linkUser)
            .pipe(
                finalize(() => this.saving = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }
}
