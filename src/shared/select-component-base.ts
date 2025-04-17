import { Component, Injector, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ControlValueAccessorComponentBase } from 'shared/control-value-accessor-component-base';


@Component({ template: '' })
export abstract class DropdownComponentBase extends ControlValueAccessorComponentBase implements OnInit {

    @Input() name: string;
    @Input() label: string;
    @Input() styleClass: string = 'w-full';
    @Input() placeholder: string;
    @Input() appendTo: any = 'body'
    @Input() showClear: boolean = true;
    @Input() showFilter: boolean = true;

    models: any[] = [];
    loading: boolean;
    validateMessage: string;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.label) {
            this.validateMessage = this.l("IsRequired", this.label);
            if (!this.placeholder) this.placeholder = this.l('Select_', this.label);
        }
        else if (this.placeholder) {
            this.validateMessage = this.placeholder;
        }
    }
}

@Component({ template: '' })
export abstract class SelectComponentBase extends DropdownComponentBase {

    @Input() multiple: boolean;
    @Input() showExclude: boolean;
    @Input() exclude: boolean;
    @Output() excludeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onHide: EventEmitter<any> = new EventEmitter<any>();
    @Output() onClear: EventEmitter<any> = new EventEmitter<any>();
   
    constructor(injector: Injector) {
        super(injector);
    }

    validate(control: AbstractControl): { [key: string]: any } | null {
        const value = this.model;

        if (!this.required && this.isNullOrUndefined(value)) return null;

        this.invalid = this.isNullOrUndefined(value) || (this.multiple && value?.length == 0);

        if (this.invalid) return { required: true };

        return null;
    }

}

@Component({ template: '' })
export abstract class LazySelectComponentBase extends SelectComponentBase implements OnDestroy {

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
        super.ngOnInit();

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
