import { Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
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

    loaded: boolean;
    loading: boolean;
    
    //pagination
    skipCount: number = 0;
    maxResultCount: number = 25;
    usePagination: boolean = true;
    sortMode: number = 1;
    dirty: boolean;

    abstract sortField: string;

    keyup: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    keyupDelay: number = 200;
    private keyupSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
        this.bindKeyupEvent();
    }

    ngOnInit(): void {
        if (this.initModel) {
            this.onFilter('', () => { this.loaded = true; });
        }
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
    
    abstract onFilter(filter: string, selectedValue?: any);

    protected mapResult(items: any[]) {
        if (this.multiple) {
            if (this.value && this.value.length) {
                let found: boolean;
                this.value.map((m, i) => {
                    let find = items.find(f => (f == m || f.id === m.id && f.displayName === m.displayName));
                    if (!find) items.push(m);
                    else {
                        this.value[i] = find;
                        found = true;
                    }
                })
                if (found) this.onChange(this.value);
            }
        }
        else {
            if (this.value) {
                let find = items.find(f => (f == this.value || f.id === this.value.id && f.displayName === this.value.displayName));
                if (!find) {
                    items.push(this.value);
                }
                else {
                    this.value = find;
                    this.onChange(this.value);
                }
            }
        }

        this.models = items;
    }

}

