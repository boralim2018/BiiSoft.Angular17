import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { ItemGradeDetailDto, ItemGradeServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import * as moment from 'moment';
import { EditItemGradeComponent } from '../edit-item-grade/edit-item-grade.component';
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
    selector: 'app-view-item-grade',
    templateUrl: './view-item-grade.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ItemGradeServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, DatePipe]
})
export class ViewItemGradeComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: ItemGradeDetailDto;
    useCode: boolean = this.appSession.itemFieldSetting.useCode;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.disable);
    canSetAsDefault: boolean = this.isGranted(AppPermissions.pages.setup.items.grades.setAsDefault);

    constructor(
        injector: Injector,
        private _itemGradeService: ItemGradeServiceProxy,
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
        this.title = this.l("View_", this.l("ItemGrade"));
        this.navBarItems.push({ label: this.l("ItemGrades"), routerLink: "/app/main/item-grades" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._itemGradeService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: ItemGradeDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/main/item-grades/view-detail', id]);
    }

    goBack() {
        this.router.navigate(['/app/main/item-grades']);
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.name,
                deleteLabel: this.l('ItemGrade')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
            .onClose.subscribe(result => {
                if (result) {
                    this.loading = true;
                    this._itemGradeService.delete(this.model.id)
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
                    this._itemGradeService.enable(input)
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
                    this._itemGradeService.disable(input)
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
                    this._itemGradeService.setAsDefault(input)
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

        let dialog = this._dialogService.open(EditItemGradeComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('ItemGrade'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
