import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { PageSangkatCommuneInputDto, FindSangkatCommuneDto, SangkatCommuneServiceProxy, GuidNullableFilterInputDto } from '@shared/service-proxies/service-proxies';
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
import { FindKhanDistrictComponent } from '../find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../find-city-province/find-city-province.component';
import { FindCountryComponent } from '../find-country/find-country.component';
import { TableSettingComponent } from '../table-setting/table-setting.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'find-sangkat-commune-dialog',
    templateUrl: './find-sangkat-commune-dialog.component.html',
    animations: [appModuleAnimation()],
    providers: [SangkatCommuneServiceProxy],
    standalone: true,
    imports: [OverlayPanelModule, TableSettingComponent, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, FindSearchActionComponent, NgIf, NgStyle, BusyDirective, NgFor, NgClass, RecordNotFoundComponent, TableModule, PrimeTemplate, CheckboxModule, FormsModule, PaginatorModule]
})
export class FindSangkatCommuneDialogComponent extends Mixin(FindCardListComponentBase<FindSangkatCommuneDto>, AppDynamicDialogBase) implements OnInit {

    protected get sortField(): string { return 'Code' };

    @ViewChild('findSangkatCommuneTable') table: Table;
    @ViewChild('pg') paginator: Paginator;

    countries: any;
    cityProvinces: any;
    khanDistricts: any;

    constructor(
        injector: Injector,
        private _sangkatCommuneService: SangkatCommuneServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.multiple = this._dialogConfig.data.multiple;
        this.multiCache = this.multiple;
        this.tableCacheKey = "findSangkatCommuneTableCache";
        this.containerClass = '.find-sangkat-commune-dialog';
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
            { name: 'KhanDistrictName', header: 'KhanDistrict', width: '15rem', sort: true },
            { name: 'CityProvinceName', header: 'CityProvicne', width: '15rem', sort: true },
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
        this.filterInput.cityProvinces = new GuidNullableFilterInputDto({ exclude: false, ids: [] });
        this.filterInput.khanDistricts = new GuidNullableFilterInputDto({ exclude: false, ids: [] });
        this.countries = undefined;
        this.cityProvinces = undefined;
        this.khanDistricts = undefined;
    }

    protected getList(input: any, callBack: Function): void {
       
        let findInput = new PageSangkatCommuneInputDto();
        findInput.init(input);
        findInput.isActive = true;

        this._sangkatCommuneService.find(findInput)
            .pipe(finalize(() => callBack()))
            .subscribe(result => {
                this.totalCount = result.totalCount;
                this.listItems = result.items.map(m => {
                    m['checked'] = false;
                    return m;
                });
            },
            err => { callBack(); this.message.error(err.message); });

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
            this.message.warn(this.l("PleaseSelect_", this.l("SangkatCommune")));
            return;
        }
        
        this._dialogRef.close(selected);
    }

    protected getInitCache(): any {
        let cache = super.getInitCache();

        //Add more data in cache
        cache.cardView = this.cardView;
        cache.countries = this.countries;
        cache.cityProvinces = this.cityProvinces;
        cache.khanDistricts = this.khanDistricts;

        return cache;
    }

    protected initDataFromCache(cache: any) {
        super.initDataFromCache(cache);

        //Init more data
        this.cardView = cache.cardView;

        //override from input
        if (this._dialogConfig.data.countries && (!(this._dialogConfig.data.countries instanceof Array) || this._dialogConfig.data.countries.length)) {
            this.countries = this._dialogConfig.data.countries;
            this.mapCountriesFilter(this.countries);
        } else {
            this.countries = cache.countries;
        }

        if (this._dialogConfig.data.cityProvinces && (!(this._dialogConfig.data.cityProvinces instanceof Array) || this._dialogConfig.data.cityProvinces.length)) {
            this.cityProvinces = this._dialogConfig.data.cityProvinces;
            this.mapCityProvincesFitler(this.cityProvinces);
        }
        else {
            this.cityProvinces = cache.cityProvinces;
        }

        if (this._dialogConfig.data.khanDistricts && (!(this._dialogConfig.data.khanDistricts instanceof Array) || this._dialogConfig.data.khanDistricts.length)) {
            this.khanDistricts = this._dialogConfig.data.khanDistricts;
            this.mapKhanDistrictsFitler(this.khanDistricts);
        }
        else {
            this.khanDistricts = cache.khanDistricts;
        }
    }

    mapCountriesFilter(event) {
        this.filterInput.countries.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    };

    onCountriesChange(event) {
        this.mapCountriesFilter(event);
        this.refresh();
    }

    mapCityProvincesFitler(event) {
        this.filterInput.cityProvinces.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onCityProvincesChange(event) {
        this.mapCityProvincesFitler(event);
        this.refresh();
    }

    mapKhanDistrictsFitler(event) {
        this.filterInput.khanDistricts.ids = !event ? undefined : event instanceof Array ? event.map(f => f.id) : [event.id];
    }

    onKhanDistrictsChange(event) {
        this.mapKhanDistrictsFitler(event);
        this.refresh();
    }
}
