import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessorComponentBase } from './control-value-accessor-component-base';

@Component({ template: '' })
export abstract class FindComponentBase extends ControlValueAccessorComponentBase implements OnInit {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() showClear: boolean = true;
    @Input() multiple: boolean;
    @Input() optionLabel: string = 'name';

    @Input() showExclude: boolean;
    @Input() exclude: boolean;
    @Output() excludeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    validateMessage: string;
    
    constructor(injector: Injector) {
        super(injector);
    }
    
    ngOnInit(): void {
        if (!this.validateMessage) this.validateMessage = this.placeholder ? this.placeholder : this.l("ThisFieldIsRequired");
    }
    
    getDisplay(model: any): any {
        if (!model) return;

        return this.isNullOrSpaces(this.optionLabel) || !this.isObject(model) ? model :
            (this.optionLabel == 'name' && model['displayName'] != undefined) || (this.optionLabel == 'displayName' && model['name'] != undefined) ?
            this.getObjLocalizeName(model) : this.getObjValue(model, this.optionLabel);
    }

    remove(i: number) {
        if (this._value instanceof Array) {
            this._value.splice(i, 1);
            this.onChange(this._value);
            this.onTouched();
        }
    }

    clear() {
        this.setValue(undefined);
        this.onTouched();
    }

    protected mapFindResult(result: any) {
        if (!result) return;

        if (this.multiple) {
            let list = this._value instanceof Array ? this._value : [];
            let newList = result.filter(s => list.find(f => f.id == s.id) === undefined);
            this.setValue(list.concat(newList));
        }
        else {
            this.setValue(result);
        }
    }

}

