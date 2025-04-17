import { Component, Injector, OnInit, Input, forwardRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { AbstractControl, FormsModule, NG_VALIDATORS, Validator } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbpValidationSummaryComponent } from '../validation/abp-validation.summary.component';
import { ControlValueAccessorComponentBase } from '../../control-value-accessor-component-base';
import { InputTextModule } from 'primeng/inputtext';


@Component({
    selector: 'input-text, [inputText]',
    templateUrl: './input-text.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputTextComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputTextComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [FormsModule, NgIf, NgClass, AbpValidationSummaryComponent, InputTextModule]
})
export class InputTextComponent extends ControlValueAccessorComponentBase implements OnInit, Validator {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() minlength: number;
    @Input() maxlength: number;
    @Input() pattern: string | RegExp;
    @Input() type: string = 'text';

    invalidPattern: any;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.label) {
            if (!this.placeholder) this.placeholder = this.l('PleaseEnter_', this.label);
        }

        if (this.type.toLocaleLowerCase() === 'email') {
            this.pattern = this.pattern || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email regex pattern
        }
        else if (this.type.toLocaleLowerCase() === 'url') {
            this.pattern = this.pattern || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/; // URL regex pattern
        }
    }

    validate(control: AbstractControl): { [key: string]: any } | null {
        const value = this.model;
        this.invalidPattern = null; // Reset invalidPattern flag

        // Skip validation if required is false and value is empty
        if (!this.required && this.isNullOrSpaces(value)) return null;

        // Check for required validation
        if (this.required && this.isNullOrSpaces(value))  return { required: true };

        // Validate minlength
        if (this.minlength != null && value?.length < +this.minlength) {
            return { minlength: { requiredLength: +this.minlength, actualLength: value.length } };
        }

        // Validate maxlength
        if (this.maxlength != null && value?.length > +this.maxlength) {
            return { maxlength: { requiredLength: +this.maxlength, actualLength: value.length } };
        }

        // Validate pattern
        if (this.pattern && value) {
            const regex = typeof this.pattern === 'string' ? new RegExp(this.pattern) : this.pattern;
            if (!regex.test(value)) {              
                if (this.type.toLocaleLowerCase() === 'email') return this.invalidPattern = { email: true }; // Email validation error
                if (this.type.toLocaleLowerCase() === 'url') return this.invalidPattern = { url: true }; // URL validation error
                return this.invalidPattern = { pattern: { requiredPattern: this.pattern.toString(), actualValue: value } };
            }
        }

        return null; // Valid
    }

}
