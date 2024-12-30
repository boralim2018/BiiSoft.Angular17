import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { PageVGAInputDto, FindVGADto, VGAServiceProxy } from '@shared/service-proxies/service-proxies';
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
    selector: 'find-vga-dialog',
    templateUrl: './find-vga-dialog.component.html',
    animations: [appModuleAnimation()],
    providers: [VGAServiceProxy],
    standalone: true,
    imports: [OverlayPanelModule, TableSettingComponent, FindSearchActionComponent, NgIf, NgStyle, BusyDirective, NgFor, NgClass, RecordNotFoundComponent, TableModule, PrimeTemplate, CheckboxModule, FormsModule, PaginatorModule]
})
export class FindVGADialogComponent extends Mixin(FindCardListComponentBase<FindVGADto>, AppDynamicDialogBase) implements OnInit {

    protected get sortField(): string { return 'Name'; }

    @ViewChild('findVGATable') table: Table;
    @ViewChild('pg') paginator: Paginator;

    constructor(
        injector: Injector,
        private _vgaService: VGAServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);

        this.multiple = this._dialogConfig.data.multiple;
        this.tableCacheKey = "findVGATableCache";
        this.containerClass = '.find-vga-dialog';
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
        
        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    protected getList(input: any, callBack: Function): void {
      
        input.isActive = true;

        let findInput = new PageVGAInputDto();
        findInput.init(input);

        this.isTableLoading = true;

        this._vgaService.find(findInput)
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

    select(vga?: any) {
        if (vga) {
            this._dialogRef.close(vga);
            return;
        }

        let selected = this.selectedModel;
        if (!selected) {
            this.message.warn(this.l("PleaseSelect_", this.l("VGA")));
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
