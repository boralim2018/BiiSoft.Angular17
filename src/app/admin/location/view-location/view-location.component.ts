import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { GuidEntityDto, LocationDetailDto, LocationServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { EditLocationComponent } from '../edit-location/edit-location.component';
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
    selector: 'app-view-location',
    templateUrl: './view-location.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, LocationServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewLocationComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: LocationDetailDto;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.locations.locationList.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.locations.locationList.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.locations.locationList.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.locations.locationList.disable);

    constructor(
        injector: Injector,
        private _locationService: LocationServiceProxy,
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
        this.title = this.l("View_", this.l("Location"));
        this.navBarItems.push({ label: this.l("Locations"), routerLink: "/app/admin/locations" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._locationService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result: LocationDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/admin/locations/view-detail', id]); 
    }

    goBack() {
        this.router.navigate(['/app/admin/locations']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.code + " - " + this.model.name,
                deleteLabel: this.l('Location')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.loading = true;
                this._locationService.delete(this.model.id)
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
                    this._locationService.enable(input)
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
                    this._locationService.disable(input)
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

        let dialog = this._dialogService.open(EditLocationComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('Location'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
