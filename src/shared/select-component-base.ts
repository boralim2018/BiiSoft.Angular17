import { Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppComponentBase } from 'shared/app-component-base';

@Component({ template: '' })
export abstract class SelectComponentBase extends AppComponentBase implements OnInit, OnDestroy {

    @Input() name: string;
    @Input() placeholder: string;
    @Input() filter: boolean = true;
    @Input() initModel: boolean = true;
    @Input() appendTo: any = 'body'
    @Input() showClear: boolean = true;
    @Input() required: boolean;
    @Input() multiple: boolean;
    @Input() optionValue: string = 'id';
    @Input() selectedModel: any;
    @Output() selectedModelChange: EventEmitter<any> = new EventEmitter<any>();
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
        else {
            this.loaded = true;
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

    onChange(event: any) {
        this.selectedModelChange.emit(event.value);
        this.dirty = !this.selectedModel || (this.multiple && !(this.selectedModel && this.selectedModel.length))
    }

    abstract onFilter(filter: string, callBack?: Function);

    protected mapResult(items: any[]) {
        if (this.multiple) {
            if (this.selectedModel && this.selectedModel.length) {
                let found: boolean;
                this.selectedModel.map((m, i) => {
                    let find = items.find(f => (f == m || f.id === m.id && f.displayName === m.displayName));
                    if (!find) items.push(m);
                    else {
                        this.selectedModel[i] = find;
                        found = true;
                    }
                })
                if (found) this.selectedModelChange.emit(this.selectedModel);
            }
        }
        else {
            if (this.selectedModel) {
                let find = items.find(f => (f == this.selectedModel || f.id === this.selectedModel.id && f.displayName === this.selectedModel.displayName));
                if (!find) {
                    items.push(this.selectedModel);
                }
                else {
                    this.selectedModel = find;
                    this.selectedModelChange.emit(this.selectedModel);
                }
            }
        }

        this.models = items;
    }

}

