import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { ControlValueAccessor } from '@angular/forms';

@Component({ template: '' })
export abstract class ControlValueAccessorComponentBase extends AppComponentBase implements ControlValueAccessor {

    @Input() required: boolean;
    @Input() invalid: boolean;

    disabled: boolean;
    protected _value: any;
    get value(): any {
        return this._value;
    }
    set value(val: any) {
        this._value = val;
        this.onChange(val);
    }

    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    constructor(injector: Injector) {
        super(injector);
    }

    writeValue(value: any): void {
        this._value = value;
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
