import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { GuidEntityDto, ChartOfAccountDetailDto, ChartOfAccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import * as moment from 'moment';
import { EditChartOfAccountComponent } from '../edit-chart-of-account/edit-chart-of-account.component';
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
    selector: 'app-view-chart-of-account',
    templateUrl: './view-chart-of-account.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ChartOfAccountServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewChartOfAccountComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: ChartOfAccountDetailDto;

    canEdit: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.accounting.chartOfAccounts.disable);

    constructor(
        injector: Injector,
        private _chartOfAccountService: ChartOfAccountServiceProxy,
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
        this.title = this.l("View_", this.l("ChartOfAccount"));
        this.navBarItems.push({ label: this.l("ChartOfAccounts"), routerLink: "/app/main/chart-of-accounts" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._chartOfAccountService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: ChartOfAccountDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/main/chart-of-accounts/view-detail', id]); 
    }

    goBack() {
        this.router.navigate(['/app/main/chart-of-accounts/']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.no + " - " + this.model.name,
                deleteLabel: this.l('ChartOfAccount')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.loading = true;
                this._chartOfAccountService.delete(this.model.id)
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

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._chartOfAccountService.enable(input)
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

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._chartOfAccountService.disable(input)
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

        let dialog = this._dialogService.open(EditChartOfAccountComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('ChartOfAccount'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
