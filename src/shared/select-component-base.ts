import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ControlValueAccessorComponentBase } from 'shared/control-value-accessor-component-base';

@Component({ template: '' })
export abstract class SelectComponentBase extends ControlValueAccessorComponentBase implements OnInit, OnDestroy {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() filter: boolean = true;
    @Input() initModel: boolean = true;
    @Input() appendTo: any = 'body'
    @Input() showClear: boolean = true;
    @Input() multiple: boolean;
    @Input() optionValue: string = 'id';
    
    models: any[] = [];
    
    loading: boolean;
    
    //pagination
    skipCount: number = 0;
    maxResultCount: number = 25;
    totalRecords: number = 0;   
    usePagination: boolean = true;
    sortMode: number = 1;

    abstract sortField: string;

    keyup: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    keyupDelay: number = 250;
    private keyupSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
        this.bindKeyupEvent();
    }

    ngOnInit(): void {
        if (this.initModel) this.onLazyLoad({ first: 0, last: this.maxResultCount });
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

