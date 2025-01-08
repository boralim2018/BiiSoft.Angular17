import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { Int64EntityDto, CurrencyDetailDto, CurrencyServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import * as moment from 'moment';
import { EditCurrencyComponent } from '../edit-currency/edit-currency.component';
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
    selector: 'app-view-currency',
    templateUrl: './view-currency.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, CurrencyServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewCurrencyComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: CurrencyDetailDto;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.currencies.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.currencies.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.currencies.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.currencies.disable);
    canSetAsDefault: boolean = this.isGranted(AppPermissions.pages.setup.currencies.setAsDefault);

    constructor(
        injector: Injector,
        private _currencyService: CurrencyServiceProxy,
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
        this.title = this.l("View_", this.l("Currency"));
        this.navBarItems.push({ label: this.l("Currencies"), routerLink: "/app/admin/currencies" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._currencyService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: CurrencyDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: number | undefined) {
        if (id) this.router.navigate(['/app/admin/currencies/view-detail', id]); 
    }

    goBack() {
        this.router.navigate(['/app/admin/currencies']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.code + " - " + this.model.name,
                deleteLabel: this.l('Currency')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.loading = true;
                this._currencyService.delete(this.model.id)
                    .pipe(finalize(() => this.loading = false))
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

                    let input = new Int64EntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._currencyService.enable(input)
                        .pipe(finalize(() => this.loading = false))
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

                    let input = new Int64EntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._currencyService.disable(input)
                        .pipe(finalize(() => this.loading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.getDetail();
                        });
                }
            }
        );
    }

    setAsDefault() {
        this.message.confirm(
            this.l('DefaultWarningMessage', this.model.name), this.l('SetAsDefault'), (result) => {
                if (result) {

                    let input = new Int64EntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._currencyService.setAsDefault(input)
                        .pipe(finalize(() => this.loading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.getDetail();
                        });
                }
            }
        );
    }
    
    unsetAsDefault() {
        this.message.confirm(
            this.l('DefaultWarningMessage', this.model.name), this.l('UnsetAsDefault'), (result) => {
                if (result) {

                    let input = new Int64EntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._currencyService.unsetAsDefault(input)
                        .pipe(finalize(() => this.loading = false))
                        .subscribe(() => {
                            this.notify.success(this.l('SavedSuccessfully'));
                            this.getDetail();
                        });
                }
            }
        );
    }

    showEdit() {

        let dialog = this._dialogService.open(EditCurrencyComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('Currency'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
