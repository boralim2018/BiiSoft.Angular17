import { Component, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { BranchDetailDto, BranchServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import * as moment from 'moment';
import { AppPermissions } from '@shared/AppPermissions';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { Mixin } from 'ts-mixer';
import { ViewContactAddressComponent } from '../../../../shared/components/contact-address/view-contact-address.component';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NavBarComponent } from '../../../../shared/components/nav-bar/nav-bar.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';

@Component({
    selector: 'app-view-branch',
    templateUrl: './view-branch.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, BranchServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, NgFor, ViewContactAddressComponent, DatePipe]
})
export class ViewBranchComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: BranchDetailDto;

    canEdit: boolean = this.isGranted(AppPermissions.pages.company.branches.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.company.branches.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.company.branches.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.company.branches.disable);
    canSetAsDefault: boolean = this.isGranted(AppPermissions.pages.company.branches.setAsDefault);

    constructor(
        injector: Injector,
        private _branchService: BranchServiceProxy,
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
        this.title = this.l("View_", this.l("Branch"));
        this.navBarItems.push({ label: this.l("Branches"), routerLink: "/app/main/branches" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._branchService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result: BranchDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/main/branches/view-detail', id]); 
    }

    goBack() {
        this.router.navigate(['/app/main/branches']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.name,
                deleteLabel: this.l('Branch')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.loading = true;
                this._branchService.delete(this.model.id)
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
                    this._branchService.enable(input)
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
                    this._branchService.disable(input)
                        .pipe(finalize(() => { this.loading = false; }))
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

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._branchService.setAsDefault(input)
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
        this.router.navigate(['/app/main/branches/edit', this.model.id]);
    }

}
