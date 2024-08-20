import { Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ControlValueAccessorComponentBase } from 'shared/app-component-base';

@Component({ template: '' })
export abstract class SelectComponentBase extends ControlValueAccessorComponentBase implements OnInit, OnDestroy {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() filter: boolean = true;
    @Input() initModel: boolean = true;
    @Input() appendTo: any = 'body'
    @Input() showClear: boolean = true;
    @Input() required: boolean;
    @Input() multiple: boolean;
    @Input() optionValue: string = 'id';
    @Input() invalid: boolean;

    //set value(val: any | undefined) {
    //    this._value = val;        
    //    if (val && !this.initModel && !this.loaded) {
    //        this.onFilter("");
    //        this.loaded = true;
    //    }

    //    this.onChange(val);
    //}
    //private _selectedModel: any;
    //@Input()
    //set selectedModel(value: any) {
    //    this._selectedModel = value;

    //    if (value && !this.initModel && !this.loaded) {
    //        this.onFilter("");
    //        this.loaded = true;
    //    }
    //}
    //get selectedModel(): any {
    //    return this._selectedModel;
    //}

    //@Output() selectedModelChange: EventEmitter<any> = new EventEmitter<any>();
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

    //onChange(event: any) {
    //    this.selectedModelChange.emit(event.value);
    //    this.dirty = !this.selectedModel || (this.multiple && !(this.selectedModel && this.selectedModel.length))
    //}

    abstract onFilter(filter: string, callBack?: Function);

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
                //if (found) this.selectedModelChange.emit(this.value);
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
                    //this.selectedModelChange.emit(this.value);
                    this.onChange(this.value);
                }
            }
        }

        this.models = items;
    }

}

