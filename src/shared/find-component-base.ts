import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessorComponentBase } from './control-value-accessor-component-base';
import { AbstractControl } from '@angular/forms';

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
        if (this.label) {
            this.validateMessage = this.l("IsRequired", this.label);
            if (!this.placeholder) this.placeholder = this.l('Select_', this.label);
        }
        else if (this.placeholder) {
            this.validateMessage = this.placeholder;
        }
    }
    
    getDisplay(model: any): any {
        if (!model) return;

        return this.isNullOrSpaces(this.optionLabel) || !this.isObject(model) ? model :
            (this.optionLabel == 'name' && model['displayName'] != undefined) || (this.optionLabel == 'displayName' && model['name'] != undefined) ?
            this.getObjLocalizeName(model) : this.getObjValue(model, this.optionLabel);
    }

    remove(i: number) {
        if (Array.isArray(this.model)) {
            this.model.splice(i, 1);
            this.onChange(this.model);
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
            let list = Array.isArray(this.model) ? this.model : [];
            let newList = result.filter(s => list.find(f => f.id == s.id) === undefined);
            this.setValue(list.concat(newList));
        }
        else {
            this.setValue(result);
        }
    }

    validate(control: AbstractControl): { [key: string]: any } | null {

        const value = this.model;

        if (!this.required && this.isNullOrUndefined(value)) return null;

        this.invalid = this.isNullOrUndefined(value) || (this.multiple && value?.length == 0);

        if (this.invalid) return { required: true };

        return null; // Valid
    }

}

