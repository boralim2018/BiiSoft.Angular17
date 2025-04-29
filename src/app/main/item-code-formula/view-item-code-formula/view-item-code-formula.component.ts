import { Component, Injector, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { ItemCodeFormulaDetailDto, ItemCodeFormulaServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import * as moment from 'moment';
import { EditItemCodeFormulaComponent } from '../edit-item-code-formula/edit-item-code-formula.component';
import { AppPermissions } from '@shared/AppPermissions';
import { ConfirmDeleteComponent } from '@shared/components/confirm-delete/confirm-delete.component';
import { Mixin } from 'ts-mixer';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { NgIf, DatePipe, NgFor } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { NavBarComponent } from '../../../../shared/components/nav-bar/nav-bar.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';

@Component({
    selector: 'app-view-item-code-formula',
    templateUrl: './view-item-code-formula.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ItemCodeFormulaServiceProxy],
    standalone: true,
    imports: [BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, NgFor, DividerModule, TagModule, DatePipe]
})
export class ViewItemCodeFormulaComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: ItemCodeFormulaDetailDto;
    

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemCodeFormulas.disable);

    constructor(
        injector: Injector,
        private _itemCodeFormulaService: ItemCodeFormulaServiceProxy,
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
        this.title = this.l("View_", this.l("ItemCodeFormula"));
        this.navBarItems.push({ label: this.l("ItemCodeFormulas"), routerLink: "/app/main/item-code-formulas" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._itemCodeFormulaService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: ItemCodeFormulaDetailDto) => {
                this.model = result;
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/main/item-code-formulas/view-detail', id]);
    }

    goBack() {
        //this.router.navigate(['/app/main/item-code-formulas']);
        window.history.back();
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.no,
                deleteLabel: this.l('ItemCodeFormula')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
            .onClose.subscribe(result => {
                if (result) {
                    this.loading = true;
                    this._itemCodeFormulaService.delete(this.model.id)
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
            this.l('EnableWarningMessage', this.model.no), this.l('Enable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._itemCodeFormulaService.enable(input)
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
            this.l('DisableWarningMessage', this.model.no), this.l('Disable'), (result) => {
                if (result) {

                    let input = new GuidEntityDto();
                    input.id = this.model.id;

                    this.loading = true;
                    this._itemCodeFormulaService.disable(input)
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

        let dialog = this._dialogService.open(EditItemCodeFormulaComponent, {
            data: { id: this.model.id },
            header: this.l('Edit') + ' ' + this.l('ItemCodeFormula'),
            styleClass: this.responsiveDialogClass
        });

        dialog.onClose.subscribe((result) => {
            if (result) this.getDetail();
        });
    }

}
