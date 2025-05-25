import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { FindItemDto, ItemServiceProxy, FindItemInputDto } from '@shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { FindCardListComponentBase } from '@shared/prime-ng-list-component-base';
import { finalize } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Mixin } from 'ts-mixer';
import { AppDynamicDialogBase } from '../../dynamic-dialog-base';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { PrimeTemplate } from 'primeng/api';
import { RecordNotFoundComponent } from '../record-not-found/record-not-found.component';
import { BusyDirective } from '../../directives/busy.directive';
import { NgIf, NgStyle, NgFor, NgClass } from '@angular/common';
import { FindSearchActionComponent } from '../find-search-action/find-search-action.component';
import { TableSettingComponent } from '../table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { FileDownloadComponentBase } from '../../app-component-base';
import { ColumnType } from '@shared/AppEnums';
import { SafeUrlPipe } from '../../../shared/pipes/safe-resource-url.pipe';
import { AppConsts } from '../../AppConsts';

@Component({
    selector: 'find-item-dialog',
    templateUrl: './find-item-dialog-template.component.html',
    animations: [appModuleAnimation()],
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [
        OverlayPanelModule, TableSettingComponent, FindSearchActionComponent, NgIf, NgStyle, BusyDirective,
        NgFor, NgClass, RecordNotFoundComponent, TableModule, PrimeTemplate, CheckboxModule, FormsModule,
        PaginatorModule, TagModule, SafeUrlPipe ]
})
export class FindItemDialogComponent extends Mixin(FindCardListComponentBase<FindItemDto>, AppDynamicDialogBase, FileDownloadComponentBase) implements OnInit {

    protected get sortField(): string { return 'Name' };

    @ViewChild('findTable') table: Table;
    @ViewChild('pg') paginator: Paginator;

    constructor(
        injector: Injector,
        private _itemService: ItemServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.multiple = this._dialogConfig.data.multiple;
        this.multiCache = this.multiple;
        this.tableCacheKey = "findItemTableCache";
        this.containerClass = '.find-item-dialog';
    }

    ngOnInit() {
        super.ngOnInit();
        this.initDialogWatcher(dl => { });
    }

    protected initColumns(): void {
        this.columns = [
            { name: 'ImageId', header: 'Image', width: '15rem', sort: true, type: ColumnType.Image },
            { name: 'Code', header: 'Code', width: '15rem', sort: true },
            { name: 'Name', header: 'Name', width: '25rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '25rem', sort: true },
            { name: 'IsActive', header: 'Status', width: '15rem', sort: true }
        ];
        
        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected initFilterInput() {
        super.initFilterInput();

        this.filterInput = FindItemInputDto.fromJS(this.filterInput);

        this.filterInput.isActive = undefined;
    }


    loadFile(row: FindItemDto) {
        if (row.imageId) {
            this.download(row.imageId, "blob", (result) => {
                row['fileUrl'] = window.URL.createObjectURL(result);
            });
        }
        else {
            row['fileUrl'] = AppConsts.blankImageUrl;
        }
    }

    protected getList(input: any, callBack: Function): void {

        const self = this;

        let findInput = new FindItemInputDto();
        findInput.init(input);
        findInput.isActive = true;

        this._itemService.find(findInput)
            .pipe(finalize(() => callBack()))
            .subscribe(result => {
                this.totalCount = result.totalCount;
                this.listItems = result.items.map(m => {
                    m['checked'] = false;
                    self.loadFile(m);

                    return m;
                });
            });

    }

    get selectedModel() {
        return this.listItems ? this.listItems.filter(f => f['checked']) : undefined;
    }

    select(model?: any) {
        if (model) {
            this._dialogRef.close(model);
            return;
        }

        let selected = this.selectedModel;
        if (!selected) {
            this.message.warn(this.l("PleaseSelect_", this.l("Item")));
            return;
        }
        
        this._dialogRef.close(selected);
    }

    protected getInitCache(): any {
        let cache = super.getInitCache();

        //Add more data in cache
        cache.cardView = this.cardView;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.cardView = cache.cardView;
    }

}
