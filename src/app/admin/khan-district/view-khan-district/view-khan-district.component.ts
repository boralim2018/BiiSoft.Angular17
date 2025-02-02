import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { KhanDistrictDetailDto, KhanDistrictServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { EditKhanDistrictComponent } from '../edit-khan-district/edit-khan-district.component';
import { AppPermissions } from '@shared/AppPermissions';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { Mixin } from 'ts-mixer';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { NgIf, DatePipe } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NavBarComponent } from '../../../../shared/components/nav-bar/nav-bar.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';

@Component({
    selector: 'app-view-khan-district',
    templateUrl: './view-khan-district.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, KhanDistrictServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewKhanDistrictComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: KhanDistrictDetailDto;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.locations.khanDistricts.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.locations.khanDistricts.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.locations.khanDistricts.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.locations.khanDistricts.disable);

    constructor(
        injector: Injector,
        private _khanDistrictService: KhanDistrictServiceProxy,
        private _dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(injector);
    }

    ngOnInit() {
        this.initNavBar();

        this.route.params.subscribe(val => {
            this.getDetail();
        });
    }

    initNavBar() {
        this.title = this.l("View_", this.l("KhanDistrict"));
        this.navBarItems.push({ label: this.l("KhanDistricts"), routerLink: "/app/admin/khan-districts" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._khanDistrictService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result: KhanDistrictDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/admin/khan-districts/view-detail', id]);
    }

    goBack() {
        this.router.navigate(['/app/admin/khan-districts']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.code + " - " + this.model.name,
                deleteLabel: this.l('KhanDistrict')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
            .onClose.subscribe(result => {
                if (result) {
                    this.loading = true;
                    this._khanDistrictService.delete(this.model.id)
                        .pipe(finalize(() => { this.loading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyDeleted'));
                            this.goBack();
                        });
                }
            });
    }

    enable() {
        this.message.confirm(
            this.l('EnableWarningMessage', this.model.name), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._khanDistrictService.enable(input)
                        .pipe(finalize(() => { this.loading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.getDetail();
                        });
                }
            }
        );
    }

    disable() {
        this.message.confirm(
            this.l('DisableWarningMessage', this.model.name), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._khanDistrictService.disable(input)
                        .pipe(finalize(() => { this.loading = false; }))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.getDetail();
                        });
                }
            }
        );
    }

    showEdit() {

        let dialog = this._dialogService.open(EditKhanDistrictComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('KhanDistrict'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
