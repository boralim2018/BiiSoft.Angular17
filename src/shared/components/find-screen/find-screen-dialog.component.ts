import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { PageScreenInputDto, FindScreenDto, ScreenServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table, TableModule } from 'primeng/table';
import { FindCardListComponentBase } from '@shared/prime-ng-list-component-base';
import { catchError, finalize, of } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Paginator, PaginatorModule } from 'primeng/paginator';
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

@Component({
    selector: 'find-screen-dialog',
    templateUrl: './find-screen-dialog.component.html',
    animations: [appModuleAnimation()],
    providers: [ScreenServiceProxy],
    standalone: true,
    imports: [OverlayPanelModule, TableSettingComponent, FindSearchActionComponent, NgIf, NgStyle, BusyDirective, NgFor, NgClass, RecordNotFoundComponent, TableModule, PrimeTemplate, CheckboxModule, FormsModule, PaginatorModule]
})
export class FindScreenDialogComponent extends Mixin(FindCardListComponentBase<FindScreenDto>, AppDynamicDialogBase) implements OnInit {

    protected get sortField(): string { return 'Name'; }

    @ViewChild('findScreenTable') table: Table;
    @ViewChild('pg') paginator: Paginator;
    useCode: boolean = this.appSession.itemFieldSetting.useCode;

    constructor(
        injector: Injector,
        private _screenService: ScreenServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.multiple = this._dialogConfig.data.multiple;
        this.tableCacheKey = "findScreenTableCache";
        this.containerClass = '.find-screen-dialog';
    }

    ngOnInit() {
        super.ngOnInit();
        this.initDialogWatcher(dl => { });
    }

    protected initColumns(): void {
        this.columns = [
            { name: 'Name', header: 'Name', width: '15rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '15rem', sort: true },
            { name: 'Code', header: 'Code', width: '15rem', sort: true }
        ];

        if (!this.useCode) this.columns = this.columns.filter(f => f.name != "Code");

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function): void {
      
        input.isActive = true;

        let findInput = new PageScreenInputDto();
        findInput.init(input);

        this.isTableLoading = true;

        this._screenService.find(findInput)
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

    select(screen?: any) {
        if (screen) {
            this._dialogRef.close(screen);
            return;
        }

        let selected = this.selectedModel;
        if (!selected) {
            this.message.warn(this.l("PleaseSelect_", this.l("Screen")));
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
