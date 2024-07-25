import { AppComponentBase, NavBarComponentBase } from 'shared/app-component-base';
import { Component, HostListener, Injector, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { interval, Subscription } from 'rxjs';
import { Paginator } from 'primeng/paginator';

@Component({
    template: ''
})
export abstract class PrimeNgListComponentBase<TOutputDto> extends AppComponentBase implements OnInit, OnDestroy {

    protected get rows(): number { return 10; }
    protected get sortMode(): number { return 1; }
    protected get sortField(): string { return 'id'; }

    filterInput: any;
    totalCount: number = 0;
    isTableLoading: boolean;
    listItems: TOutputDto[] = [];
    rowsPerPageOptions: number[] = [10, 15, 20, 30, 50];
    currentPageReportTemplate: string = this.l('Total') + ": {totalRecords}";

    private _tableCacheKey: string;
    protected get tableCacheKey(): string { return this._tableCacheKey; }
    protected set tableCacheKey(value: string) {
        this._tableCacheKey = value;
    }
    abstract table: Table;
    protected tableWidth: number;    
    showGridLine: boolean;

    actionColumnWidth: string = '85px';
    columns: any[];
    _selectedColumns: any[];
    @Input()
    get selectedColumns(): any[] {
        return this._selectedColumns;
    }
    set selectedColumns(val: any[]) {
        this._selectedColumns = this.columns.filter(col => val && val.find(f => f.name === col.name));
    }

    @Output() onTableLoaded: EventEmitter<Table> = new EventEmitter<Table>();

    minHeight: number | undefined;
   
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.initModel();
        this.initTableWatcher();
    }

    private tableWatchTick: number = 0;
    private tableWatcher: Subscription;
    protected initTableWatcher() {
        this.tableWatcher = interval(300).subscribe((x => {
            if (this.tableWatchTick > 10) this.tableWatcher.unsubscribe();
            this.tableWatchTick++;            
            if (this.table) {
                this.tableWatcher.unsubscribe();

                this.initResponsiveLayout();
                this.setMinHeight();
                this.showGridLineChange();
                this.bindTableEvent();

                this.onTableLoaded.emit(this.table);
            }
        }));
    }


    ngOnDestroy() {
        this.saveTableCache();
    }

    @HostListener('window:beforeunload', ['$event'])
    handleClose(event) {
        this.saveTableCache();
    }

    protected saveTableCache() {
        if (!this.tableCacheKey) return;
        let cache = this.getInitCache();
        this.carchService.set(this.tableCacheKey, JSON.stringify(cache));
    }

    protected getInitCache(): any {
        return {
            filterInput: this.filterInput,
            columns: this.columns,
            selectedColumns: this.selectedColumns.map(c => { return { name: c.name } }),
            style: { showGridLine: this.showGridLine, width: this.tableWidth }
        };
    }

    deleteTableCache() {
        if (!this.tableCacheKey) return;
        this.carchService.remove(this.tableCacheKey);
        this.initModel();
        this.refresh();
    }

    protected initModel() {
        this.initColumns();
        this.initFilterInput();
        this.showGridLine = false;

        //override data from cache
        if (this.tableCacheKey) {
            let cacheString = this.carchService.get(this.tableCacheKey);

            if (cacheString) {
                let cache = JSON.parse(cacheString);
                this.initDataFromCache(cache);
            }
        }
    }

    protected initFilterInput() {
        this.filterInput = {
            keyword: '',
            skipCount: 0,
            maxResultCount: this.rows,
            sortMode: this.sortMode,
            sortField: this.sortField,
            usePagination: true
        };
    }

    protected initDataFromCache(cache: any) {

        this.filterInput = cache.filterInput;
        this.tableWidth = cache.style.width;
        this.showGridLine = cache.style.showGridLine;

        let cacheCols = cache.columns.filter(f => this.columns.find(c => c.name == f.name));
        let newCols = this.columns.filter(f => !cache.columns.find(c => c.name == f.name));

        this.columns = cacheCols.concat(newCols);
        this.selectedColumns = cache.selectedColumns;
    }

    protected initResponsiveLayout(tbl?: Table) {
        if (!this.table) return;
        this.table.resizableColumns = !this.isMobile;
        this.table.reorderableColumns = !this.isMobile;
        this.table.tableViewChild.nativeElement.style.width = this.isMobile ? '100%' : this.tableWidth + 'px';
        this.table.tableViewChild.nativeElement.style.minWidth = this.table.tableViewChild.nativeElement.style.width;       
        this.table.columnResizeMode = this.isMobile ? 'fit' : 'expand';
        //this.table.paginatorPosition = this.isMobile ? 'both' : 'bottom';
        //this.table.rowsPerPageOptions = this.isMobile ? null : [10, 20, 30, 50];
        this.table.showCurrentPageReport = !this.isMobile;
        this.table.showJumpToPageDropdown = this.isMobile;
        this.table.showJumpToPageInput = !this.isMobile;
        this.table.showFirstLastIcon = !this.isMobile;	
        this.table.showPageLinks = !this.isMobile;
        this.table.scrollable = !this.isMobile;
    }

    responsiveWidth(width: string): string {
        return this.isMobile ? '' : width;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.initResponsiveLayout();
    }

    protected bindTableEvent() {
        if (!this.table) return;
        this.table.onColReorder.subscribe((event) => this.onColReorder(event));
        this.table.onColResize.subscribe((event) => this.onColResize(event));
        this.onTableLoaded.subscribe(event => this.refresh());
    }

    onColResize(event) {
        let col = this.selectedColumns.find(f => f.name == event.element.id);
        if (col && col.width) {
            col.width = Math.round(event.element.offsetWidth + event.delta) + 'px';
        }
    }

    getColumnInfo(colName: string): HTMLTableHeaderCellElement {
        let tbl = this.table.tableViewChild.nativeElement as HTMLTableElement;
        let ths = Array.from(tbl.querySelectorAll('.p-datatable-thead tr th'));
        var th = ths.find(f => f.id == colName) as HTMLTableHeaderCellElement;
        return th;
    }

    protected get margin(): number {
        return 460; //Header + Footer + margin = 460;
    }

    protected setMinHeight() {
        if (!this.table) return;

        const min = 200;

        this.minHeight = window.screen.height - this.margin;
        if (this.minHeight < min) this.minHeight = min; 

        let container = this.table.containerViewChild.nativeElement as HTMLElement;
        let wraper = container.querySelector('.p-datatable-wrapper') as HTMLElement;
        if (wraper) wraper.style.minHeight = this.minHeight + 'px';
    }

    onColReorder(event) {
        let drag = this._selectedColumns[event.dropIndex];
        let drop = this._selectedColumns[event.dragIndex - event.dropIndex < 0 ? event.dropIndex - 1 : event.dropIndex + 1];
        let dragIndex = this.columns.indexOf(this.columns.find(f => f.name === drag.name));
        let dropIndex = this.columns.indexOf(this.columns.find(f => f.name === drop.name));

        this.columns.splice(dragIndex, 1);
        this.columns.splice(dropIndex, 0, drag);
        this.selectedColumns = event.columns;
    }

    showGridLineChange(event?: Event) {
        if (this.table) this.table.styleClass = this.showGridLine ? 'p-datatable-striped p-datatable-gridlines' : 'p-datatable-striped';
    }

    protected abstract initColumns(): void;
    protected abstract getList(input: any, callBack: Function): void;

    public loadData(event?: LazyLoadEvent) {

        //event.first = First row offset
        //event.rows = Number of rows per page
        //event.sortField = Field name to sort in single sort mode
        //event.sortOrder = Sort order as number, 1 for asc and -1 for dec in single sort mode
        //multiSortMeta: An array of SortMeta objects used in multiple columns sorting. Each SortMeta has field and order properties.
        //filters: Filters object having field as key and filter value, filter matchMode as value
        //globalFilter: Value of the global filter if available

        if (event) {
            this.filterInput.maxResultCount = event && event.rows > 0 ? event.rows : this.filterInput.maxResultCount;
            this.filterInput.skipCount = event ? event.first : 0;
            this.filterInput.sortMode = event && event.sortOrder ? event.sortOrder : this.filterInput.sortMode;
            this.filterInput.sortField = event && event.sortField ? event.sortField : this.filterInput.sortField;
            this.filterInput.keyword = event && event.globalFilter ? event.globalFilter : this.filterInput.keyword;
        }

        this.isTableLoading = true;
        this.getList(this.filterInput, () => { this.isTableLoading = false; });
    }

    refresh(event?: Event) {
        if (this.table) this.table.filterGlobal(this.filterInput.keyword, 'contains');
        else this.loadData();
    }

}

@Component({
    template: ''
})
export abstract class FindCardListComponentBase<TOutput> extends PrimeNgListComponentBase<TOutput>  {
    
    cardView: boolean = true;
    multiple: boolean;
    multiCache: boolean;
    protected get tableCacheKey(): string | undefined { return !super.tableCacheKey ? undefined : this.multiCache ? super.tableCacheKey + "1" : super.tableCacheKey; }
    protected set tableCacheKey(value: string | undefined) { super.tableCacheKey = value; }

    abstract paginator: Paginator;
    protected initResponsiveLayout() {
        super.initResponsiveLayout();
        this.paginator.showCurrentPageReport = !this.isMobile;
        this.paginator.showJumpToPageDropdown = this.isMobile;
        this.paginator.showJumpToPageInput = !this.isMobile;
        this.paginator.showFirstLastIcon = !this.isMobile;
        this.paginator.showPageLinks = !this.isMobile;
    }
}
