import { Component, Injector, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ControlValueAccessorComponentBase } from 'shared/control-value-accessor-component-base';


@Component({ template: '' })
export abstract class SelectComponentBase extends ControlValueAccessorComponentBase implements OnInit, OnDestroy {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() appendTo: any = 'body'
    @Input() showClear: boolean = true;
    @Input() multiple: boolean;
    @Input() showFilter: boolean;

    models: any[] = [];
    loading: boolean;
    filter: string;

    keyup: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    keyupDelay: number = 250;
    private keyupSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
        this.bindKeyupEvent();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        if (this.keyupSubscription) this.keyupSubscription.unsubscribe();
    }

    protected bindKeyupEvent() {
        this.keyupSubscription = this.keyup.pipe(
            debounceTime(this.keyupDelay),
            distinctUntilChanged()
        ).subscribe(event => {
            this.onFilter((event.target as HTMLInputElement).value);
        });
    }

    abstract onFilter(filter: string);
}

@Component({ template: '' })
export abstract class LazySelectComponentBase extends SelectComponentBase implements OnInit, OnDestroy {

    @Input() lazy: boolean = true;
    
    //pagination
    skipCount: number = 0;
    maxResultCount: number = 25;
    totalRecords: number = 0;   
    usePagination: boolean = true;
    sortMode: number = 1;

    abstract sortField: string;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.lazy) this.onLazyLoad({ first: 0, last: this.maxResultCount });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    abstract onLazyLoad(event, selected?: any);
}
