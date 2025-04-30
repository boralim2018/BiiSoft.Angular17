import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FindCardListComponentBase } from '@shared/prime-ng-list-component-base';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

@Component({ template: '' })
export abstract class FindItemFieldComponentBase<TOutput> extends FindCardListComponentBase<TOutput> implements OnInit {

    protected get sortField(): string { return 'Name'; }

    @ViewChild('findItemFieldTable') table: Table;
    @ViewChild('pg') paginator: Paginator;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    protected initColumns(): void {
        this.columns = [
            { name: 'Name', header: 'Name', width: '15rem', sort: true },
            { name: 'DisplayName', header: 'DisplayName', width: '15rem', sort: true },
            { name: 'Code', header: 'Code', width: '15rem', sort: true }
        ];

        this.selectedColumns = this.columns.filter(s => s.visible !== false);
    }

    get selectedModel() {
        return this.listItems ? this.listItems.filter(f => f['checked']) : undefined;
    }

    get displayCode(): boolean {
        return this.selectedColumns && this.selectedColumns.find(f => f.name === 'Code') !== undefined;
    }

    abstract select(unit?: any);

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
