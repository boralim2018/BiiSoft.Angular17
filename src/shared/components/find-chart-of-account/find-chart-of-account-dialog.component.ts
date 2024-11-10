import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { PageChartOfAccountInputDto, FindChartOfAccountDto, ChartOfAccountServiceProxy, GuidNullableFilterInputDto } from '@shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { FindCardListComponentBase } from '@shared/prime-ng-list-component-base';
import { catchError, finalize, of } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { Mixin } from 'ts-mixer';
import { AppDynamicDialogBase } from '../../dynamic-dialog-base';
import { BorderRadius } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { PrimeTemplate } from 'primeng/api';
import { RecordNotFoundComponent } from '../record-not-found/record-not-found.component';
import { BusyDirective } from '../../directives/busy.directive';
import { NgIf, NgStyle, NgFor, NgClass } from '@angular/common';
import { FindSearchActionComponent } from '../find-search-action/find-search-action.component';
import { FindCountryComponent } from '../find-country/find-country.component';
import { TableSettingComponent } from '../table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'find-chart-of-account-dialog',
    templateUrl: './find-chart-of-account-dialog.component.html',
    animations: [appModuleAnimation()],
    providers: [ChartOfAccountServiceProxy],
    standalone: true,
    imports: [OverlayPanelModule, TableSettingComponent, FindCountryComponent, FindSearchActionComponent, NgIf, NgStyle, BusyDirective, NgFor, NgClass, RecordNotFoundComponent, TableModule, PrimeTemplate, CheckboxModule, FormsModule, PaginatorModule]
})
export class FindChartOfAccountDialogComponent extends Mixin(FindCardListComponentBase<FindChartOfAccountDto>, AppDynamicDialogBase) implements OnInit {

    protected get sortField(): string { return 'Code' };

    @ViewChild('findChartOfAccountTable') table: Table;
    @ViewChild('pg') paginator: Paginator;

    countries: any;

    constructor(
        injector: Injector,
        private _chartOfAccountService: ChartOfAccountServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.multiple = this._dialogConfig.data.multiple;
        this.multiCache = this.multiple;
        this.tableCacheKey = "findChartOfAccountTableCache";
        this.containerClass = '.find-chart-of-account-dialog';
    }

    ngOnInit() {
        super.ngOnInit();
        this.initDialogWatcher(dl => { });
    }

    protected initColumns(): void {
        this.columns = [
            { name: 'Code', header: 'Code', width: '15rem', sort: true },
            { name: 'Name', header: 'Name', width: '15rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '15rem', sort: true },
            { name: 'ISO', header: 'ISO', width: '15rem', sort: true },
            { name: 'CountryName', header: 'Country', width: '15rem', sort: true, visible: false }
        ];
        
        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    get showCountry(): boolean {
        return this.selectedColumns && this.selectedColumns.find(f => f.name === 'CountryName') !== undefined;
    }

    protected initFilterInput() {
        super.initFilterInput();
        this.filterInput.isActive = undefined;
        this.filterInput.countries = new GuidNullableFilterInputDto({ exclude: false, ids: [] });
        this.countries = undefined;
    }

    protected getList(input: any, callBack: Function): void {
       
        let findInput = new PageChartOfAccountInputDto();
        findInput.init(input);
        findInput.isActive = true;

        this._chartOfAccountService.find(findInput)
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
            this.message.warn(this.l("PleaseSelect_", this.l("ChartOfAccount")));
            return;
        }
        
        this._dialogRef.close(selected);
    }

    protected getInitCache(): any {
        let cache = super.getInitCache();

        //Add more data in cache
        cache.cardView = this.cardView;
        cache.countries = this.countries;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.cardView = cache.cardView;

        //override from input
        if (this._dialogConfig.data.countries && (!(Array.isArray(this._dialogConfig.data.countries)) || this._dialogConfig.data.countries.length)) {
            this.countries = this._dialogConfig.data.countries;
            this.mapCountriesFilter(this.countries);
        }
        else {
            this.countries = cache.countries
        }
    }

    mapCountriesFilter(event) {
        this.filterInput.countries.ids = !event ? undefined : Array.isArray(event) ? event.map(f => f.id) : [event.id];
    }

    onCountriesChange(event) {
        this.mapCountriesFilter(event);
        this.refresh();
    }
}
