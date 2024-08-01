import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { Int64EntityDto, CountryDetailDto, CountryServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { EditCountryComponent } from '../edit-country/edit-country.component';
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
    selector: 'app-view-country',
    templateUrl: './view-country.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, CountryServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewCountryComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: CountryDetailDto;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.locations.countries.disable);

    constructor(
        injector: Injector,
        private _countryService: CountryServiceProxy,
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
        this.title = this.l("View_", this.l("Country"));
        this.navBarItems.push({ label: this.l("Countries"), routerLink: "/app/admin/countries" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._countryService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result: CountryDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/admin/countries/view-detail', id]);
    }

    goBack() {
        this.router.navigate(['/app/admin/countries']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.code + " - " + this.model.name,
                deleteLabel: this.l('Country')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
            .onClose.subscribe(result => {
                if (result) {
                    this.loading = true;
                    this._countryService.delete(this.model.id)
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
                    this._countryService.enable(input)
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
                    this._countryService.disable(input)
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

        let dialog = this._dialogService.open(EditCountryComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('Country'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
