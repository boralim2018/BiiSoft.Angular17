import { Component, Injector, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ControlValueAccessorComponentBase } from 'shared/control-value-accessor-component-base';


@Component({ template: '' })
export abstract class SelectComponentBase extends ControlValueAccessorComponentBase{

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() appendTo: any = 'body'
    @Input() showClear: boolean = true;
    @Input() multiple: boolean;
    @Input() showFilter: boolean = true;
    @Input() showExclude: boolean;
    @Input() exclude: boolean;
    @Output() excludeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onHide: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClear: EventEmitter<any> = new EventEmitter<any>();
   
    models: any[] = [];
    loading: boolean;
    validateMessage: string;
   
    constructor(injector: Injector) {
        super(injector);
        this.placeholder = this.l('Select_', this.label);
    }

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

    filter: string;

    keyup: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    keyupDelay: number = 250;
    private keyupSubscription: Subscription;
    constructor(injector: Injector) {
        super(injector);
        this.bindKeyupEvent();
    }

    ngOnInit(): void {
        if (this.lazy) this.onLazyLoad({ first: 0, last: this.maxResultCount });
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
    abstract onLazyLoad(event, selected?: any);
}
