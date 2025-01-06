import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { FieldCDetailDto, FieldCServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import * as moment from 'moment';
import { EditFieldCComponent } from '../edit-field-c/edit-field-c.component';
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
    selector: 'app-view-field-c',
    templateUrl: './view-field-c.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, FieldCServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewFieldCComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: FieldCDetailDto;
    useCode: boolean = this.appSession.itemFieldSetting?.useCode;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.fieldCs.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.fieldCs.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.fieldCs.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.fieldCs.disable);
    canSetAsDefault: boolean = this.isGranted(AppPermissions.pages.setup.items.fieldCs.setAsDefault);

    constructor(
        injector: Injector,
        private _fieldCService: FieldCServiceProxy,
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
        this.title = this.l("View_", this.l("FieldC"));
        this.navBarItems.push({ label: this.l("FieldCs"), routerLink: "/app/main/field-c" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._fieldCService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: FieldCDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/main/field-c/view-detail', id]);
    }

    goBack() {
        this.router.navigate(['/app/main/field-c']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.name,
                deleteLabel: this.l('FieldC')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
            .onClose.subscribe(result => {
                if (result) {
                    this.loading = true;
                    this._fieldCService.delete(this.model.id)
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
                    this._fieldCService.enable(input)
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
                    this._fieldCService.disable(input)
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

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._fieldCService.setAsDefault(input)
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

        let dialog = this._dialogService.open(EditFieldCComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('FieldC'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
