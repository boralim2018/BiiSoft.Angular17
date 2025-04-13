import { Component, Injector, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { ControlValueAccessor } from '@angular/forms';

@Component({ template: '' })
export abstract class ControlValueAccessorComponentBase extends AppComponentBase implements ControlValueAccessor {

    @Input() required: boolean;

    invalid: boolean;
    dirty: boolean;
    disabled: boolean;
    model: any;

    onChange: (value: any) => void = () => { };
    onTouched: () => void = () => { };

    constructor(injector: Injector) {
        super(injector);
    }

    writeValue(value: any): void {
        this.model = value;
        this.dirty = false;
    }

    registerOnChange(fn: (value: any) => void): void {
        this.onChange = (value: any) => {
            this.dirty = true; // Mark as dirty when the value changes
            fn(value);
        };
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    setValue(value: any) {
        this.model = value;
        this.dirty = true; // Mark as dirty when the value is set manually
        this.onChange(value);
    }
}
