import { Component, EventEmitter, Injector, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserProfileEditDto, ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LayoutService } from '../service/app.layout.service';
import { Mixin } from 'ts-mixer';
import { BFileComponentBase } from '@shared/app-component-base';
import { SafeUrlPipe } from '@shared/pipes/safe-resource-url.pipe';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NgClass, NgIf } from '@angular/common';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'changeProfile',
    templateUrl: './change-profile.component.html',
    providers: [ProfileServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, NgClass, NgIf, ButtonDirective, Ripple, InputTextModule, AbpValidationSummaryComponent, LocalizePipe, SafeUrlPipe]
})
export class ChangeProfileComponent extends Mixin(DynamicDialogBase, BFileComponentBase) implements OnInit {

    saving = false;
    model: CurrentUserProfileEditDto = new CurrentUserProfileEditDto();
    containerClass: string = ".change-profile-dialog"
    uploadUrl: string = '/UserProfile/Upload';
    profileImageUrl: string = this.blankProfileUrl;
    parent: any;
    profileUploaded: boolean;

    constructor(
        injector: Injector,
        public layoutService: LayoutService,
        private _profileService: ProfileServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.parent = this._dialogConfig.data.parent;
    }

    ngOnInit() {
        super.ngOnInit();
        this.loadProfilePicture();
        this.getCurrentProfile();
    }

    loadProfilePicture() {
        if (this.appSession.user.profilePictureId) {
            this.download(this.appSession.user.profilePictureId, "blob", (result) => {
                this.profileImageUrl = window.URL.createObjectURL(result);
                if (this.profileUploaded) {
                    this.parent.profilePictureUrl = this.profileImageUrl;
                    this.profileUploaded = false;
                }
            });
        }
        else {
            this.profileImageUrl = this.blankProfileUrl;
        }
    }

    getCurrentProfile() {
        this.loading = true;
        this._profileService.getCurrentUserProfileForEdit()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe(
                (result: CurrentUserProfileEditDto) => {
                    this.model = result;
                },
                err => {
                    this.loading = false;
                    this.message.error(err.message);
                }
            );
    }

    fileChange(event: Event) {
        let file = event.currentTarget as HTMLInputElement;
        if (file && file.files.length) {
            this.profileImageUrl = window.URL.createObjectURL(file.files[0]);
        }
    }

    clearUpload(file: HTMLInputElement) {
        file.value = '';
        this.loadProfilePicture();        
    }

    uploadProfile(file: HTMLInputElement) {
        if (file && file.files.length) {
            this.upload(file.files[0], 1, (result) => {
                if (result && result.id) {                   
                    this.appSession.user.profilePictureId = result.id;
                    this.profileUploaded = true;
                    this.clearUpload(file);
                    this.notify.info(this.l('SavedSuccessfully'));
                }
            })
        }
    }

    save(): void {
        this.saving = true;
        this._profileService.updateCurrentUserProfile(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(
                () => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this._dialogRef.close(true);
                    window.location.reload();
                },
                err => {
                    this.saving = false;
                    this.message.error(err.message);
                }
            );
    }
}
