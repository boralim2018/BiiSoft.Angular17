import { Component, Injector, OnInit } from '@angular/core';
import { PageItemBrandInputDto, FindItemBrandDto, ItemBrandServiceProxy } from '@shared/service-proxies/service-proxies';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PaginatorModule } from 'primeng/paginator';
import { AppDynamicDialogBase } from '../../dynamic-dialog-base';
import { Mixin } from 'ts-mixer';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { PrimeTemplate } from 'primeng/api';
import { RecordNotFoundComponent } from '../record-not-found/record-not-found.component';
import { BusyDirective } from '../../directives/busy.directive';
import { NgIf, NgStyle, NgFor, NgClass } from '@angular/common';
import { FindSearchActionComponent } from '../find-search-action/find-search-action.component';
import { TableSettingComponent } from '../table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FindItemFieldComponentBase } from '../find-item-field-component-base';

@Component({
    selector: 'find-item-brand-dialog',
    templateUrl: '../template/find-item-field-dialog-template.component.html',
    animations: [appModuleAnimation()],
    providers: [ItemBrandServiceProxy],
    standalone: true,
    imports: [OverlayPanelModule, TableSettingComponent, FindSearchActionComponent, NgIf, NgStyle, BusyDirective, NgFor, NgClass, RecordNotFoundComponent, TableModule, PrimeTemplate, CheckboxModule, FormsModule, PaginatorModule]
})
export class FindItemBrandDialogComponent extends Mixin(FindItemFieldComponentBase<FindItemBrandDto>, AppDynamicDialogBase) implements OnInit {

    constructor(
        injector: Injector,
        private _itemBrandService: ItemBrandServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.multiple = this._dialogConfig.data.multiple;
        this.tableCacheKey = "findItemBrandTableCache";
        this.containerClass = '.find-item-brand-dialog';
    }

    ngOnInit() {
        super.ngOnInit();
        this.initDialogWatcher(dl => { });
    }

    protected getList(input: any, callBack: Function): void {
      
        input.isActive = true;

        let findInput = new PageItemBrandInputDto();
        findInput.init(input);

        this.isTableLoading = true;

        this._itemBrandService.find(findInput)
            .pipe(finalize(() => callBack()))
            .subscribe(result => {
                this.totalCount = result.totalCount;
                this.listItems = result.items.map(m => {
                    m['checked'] = false;
                    return m;
                });
            });

    }

    select(itemBrand?: any) {
        if (itemBrand) {
            this._dialogRef.close(itemBrand);
            return;
        }

        let selected = this.selectedModel;
        if (!selected) {
            this.message.warn(this.l("PleaseSelect_", this.l("ItemBrand")));
            return;
        }
        
        this._dialogRef.close(selected);
    }

}
