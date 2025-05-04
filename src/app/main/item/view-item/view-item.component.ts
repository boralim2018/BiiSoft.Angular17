import { Component, Injector, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadComponentBase, NavBarComponentBase } from '@shared/app-component-base';
import { ItemDetailDto, ItemServiceProxy, GuidEntityDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
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
import { SafeUrlPipe } from '../../../../shared/pipes/safe-resource-url.pipe';
import { AppConsts } from '../../../../shared/AppConsts';
import { RecordNotFoundComponent } from '../../../../shared/components/record-not-found/record-not-found.component';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-view-item',
    templateUrl: './view-item.component.html',
    animations: [appModuleAnimation()],
    providers: [DialogService, ItemServiceProxy],
    standalone: true,
    imports: [
        BusyDirective, NavBarComponent, ButtonDirective, Ripple, NgIf, DividerModule, TagModule, NgFor,
        ViewContactAddressComponent, DatePipe, SafeUrlPipe, TableModule, RecordNotFoundComponent]
})
export class ViewItemComponent extends Mixin(FileDownloadComponentBase, NavBarComponentBase) implements OnInit {

    loading: boolean;
    model: ItemDetailDto;
    fileUrl: string = AppConsts.blankImageUrl;

    canEdit: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.edit);
    canDelete: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.delete);
    canEnable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.enable);
    canDisable: boolean = this.isGranted(AppPermissions.pages.setup.items.itemList.disable);

    chartOfAccountEnable: boolean = this.feature.isEnabled("App.Accounting.ChartOfAccounts");

    constructor(
        injector: Injector,
        private _itemService: ItemServiceProxy,
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

    loadFile() {
        if (this.model.imageId) {
            this.download(this.model.imageId, "blob", (result) => {
                this.fileUrl = window.URL.createObjectURL(result);
            });
        }
        else {
            this.fileUrl = AppConsts.blankImageUrl;
        }
    }

    initNavBar() {
        this.title = this.l("View_", this.l("Item"));
        this.navBarItems.push({ label: this.l("Items"), routerLink: "/app/main/items" });
        this.setTitle();
    }

    getDetail() {
        this.loading = true;
        this._itemService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe((result: ItemDetailDto) => {
                this.model = result;

                this.loadFile();
            });
    }

    goTo(id: string | undefined) {
        if (id) this.router.navigate(['/app/main/items/view-detail', id]); 
    }

    goBack() {
        //this.router.navigate(['/app/main/items']);
        window.history.back();
    }

    delete(): void {

        this._dialogService.open(ConfirmDeleteComponent, {
            data: {
                deleteObj: this.model.name,
                deleteLabel: this.l('Item')
            },
            header: this.l('ConfirmDelete'),
            styleClass: this.responsiveDialogClass
        })
        .onClose.subscribe(result => {
            if (result) {
                this.loading = true;
                this._itemService.delete(this.model.id)
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
                    this._itemService.enable(input)
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
                    this._itemService.disable(input)
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
        this.router.navigate(['/app/main/items/edit', this.model.id]);
    }

}
