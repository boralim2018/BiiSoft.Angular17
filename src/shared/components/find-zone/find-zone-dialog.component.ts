import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { FindZoneInputDto, FindZoneDto, ZoneServiceProxy, GuidFilterInputDto } from '@shared/service-proxies/service-proxies';
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
import { FindWarehouseComponent } from '../find-warehouse/find-warehouse.component';
import { TableSettingComponent } from '../table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'find-zone-dialog',
    templateUrl: './find-zone-dialog.component.html',
    animations: [appModuleAnimation()],
    providers: [ZoneServiceProxy],
    standalone: true,
    imports: [OverlayPanelModule, TableSettingComponent, FindWarehouseComponent, FindSearchActionComponent, NgIf, NgStyle, BusyDirective, NgFor, NgClass, RecordNotFoundComponent, TableModule, PrimeTemplate, CheckboxModule, FormsModule, PaginatorModule]
})
export class FindZoneDialogComponent extends Mixin(FindCardListComponentBase<FindZoneDto>, AppDynamicDialogBase) implements OnInit {

    protected get sortField(): string { return 'Name' };

    @ViewChild('findZoneTable') table: Table;
    @ViewChild('pg') paginator: Paginator;

    warehouses: any;

    constructor(
        injector: Injector,
        private _zoneService: ZoneServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.multiple = this._dialogConfig.data.multiple;
        this.multiCache = this.multiple;
        this.tableCacheKey = "findZoneTableCache";
        this.containerClass = '.find-zone-dialog';
    }

    ngOnInit() {
        super.ngOnInit();
        this.initDialogWatcher(dl => { });
    }

    protected initColumns(): void {
        this.columns = [
            { name: 'Name', header: 'Name', width: '15rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '15rem', sort: true },
            { name: 'WarehouseName', header: 'Warehouse', width: '15rem', sort: true }
        ];
        
        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    get showWarehouse(): boolean {
        return this.selectedColumns && this.selectedColumns.find(f => f.name === 'WarehouseName') !== undefined;
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
        this.filterInput.warehouseFilter = new GuidFilterInputDto({ exclude: false, ids: [] });
        this.warehouses = undefined;
    }

    protected getList(input: any, callBack: Function): void {
       
        let findInput = new FindZoneInputDto();
        findInput.init(input);
        findInput.isActive = true;

        this._zoneService.find(findInput)
            .pipe(finalize(() => callBack()))
            .subscribe(result => {
                this.totalCount = result.totalCount;
                this.listItems = result.items.map(m => {
                    m['checked'] = false;
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
            this.message.warn(this.l("PleaseSelect_", this.l("Zone")));
            return;
        }
        
        this._dialogRef.close(selected);
    }

    protected getInitCache(): any {
        let cache = super.getInitCache();

        //Add more data in cache
        cache.cardView = this.cardView;
        cache.warehouses = this.warehouses;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.cardView = cache.cardView;

        //override from input
        if (this._dialogConfig.data.warehouses && (!(Array.isArray(this._dialogConfig.data.warehouses)) || this._dialogConfig.data.warehouses.length)) {
            this.warehouses = this._dialogConfig.data.warehouses;
            this.mapWarehousesFilter(this.warehouses);
        }
        else {
            this.warehouses = cache.warehouses
        }
    }

    mapWarehousesFilter(event) {
        this.filterInput.warehouseFilter.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onWarehousesChange(event) {
        this.mapWarehousesFilter(event);
        this.refresh();
    }
}
