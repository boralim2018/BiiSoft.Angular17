import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { Int64EntityDto, CityProvinceDetailDto, CityProvinceServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import * as moment from 'moment';
import { EditCityProvinceComponent } from '../edit-city-province/edit-city-province.component';
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
    selector: 'app-view-city-province',
    templateUrl: './view-city-province.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, CityProvinceServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewCityProvinceComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: CityProvinceDetailDto;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.locations.cityProvinces.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.locations.cityProvinces.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.locations.cityProvinces.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.locations.cityProvinces.disable);

    constructor(
        injector: Injector,
        private _cityProvinceService: CityProvinceServiceProxy,
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
        this.title = this.l("View_", this.l("CityProvince"));
        this.navBarItems.push({ label: this.l("CityProvinces"), routerLink: "/app/admin/city-provinces" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._cityProvinceService
            .getDetail(this.route.snapshot.params.id)
            .pipe(
                finalize(() => this.loading = false),
                catchError((err: any) => {
                    this.message.error(err.message);
                    return of(null);
                })
            )
            .subscribe((result: CityProvinceDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/admin/city-provinces/view-detail', id]);
    }

    goBack() {
        this.router.navigate(['/app/admin/city-provinces']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.iso + " - " + this.model.name,
                deleteLabel: this.l('CityProvince')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
            .onClose.subscribe(result => {
                if (result) {
                    this.loading = true;
                    this._cityProvinceService.delete(this.model.id)
                        .pipe(
                            finalize(() => this.loading = false),
                            catchError((err: any) => {
                                this.message.error(err.message);
                                return of(null);
                            })
                        )
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
                    this._cityProvinceService.enable(input)
                        .pipe(
                            finalize(() => this.loading = false),
                            catchError((err: any) => {
                                this.message.error(err.message);
                                return of(null);
                            })
                        )
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
                    this._cityProvinceService.disable(input)
                        .pipe(
                            finalize(() => this.loading = false),
                            catchError((err: any) => {
                                this.message.error(err.message);
                                return of(null);
                            })
                        )
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.getDetail();
                        });
                }
            }
        );
    }

    showEdit() {

        let dialog = this._dialogService.open(EditCityProvinceComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('CityProvince'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
