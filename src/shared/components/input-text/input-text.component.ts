import { Component, Injector, OnInit, Input, forwardRef } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { AbstractControl, FormsModule, NG_VALIDATORS } from '@angular/forms';
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
export class InputTextComponent extends ControlValueAccessorComponentBase implements OnInit {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() minlength: number;
    @Input() maxlength: number;
    @Input() pattern: string | RegExp;
    @Input() type: string = 'text';
    @Input() autocomplete: string = "off";

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
        else if (this.type.toLocaleLowerCase() === 'text') {
            this.pattern = this.pattern || /^(?!^\s+$).*$/;
        }
    }

    validate(control: AbstractControl): { [key: string]: any } | null {
        this.invalid = false; // Reset invalid flag

        const value = control.value;
        const nullOrEmpty = this.isNullOrEmpty(value);

        // Skip validation if required is false and value is empty
        if (!this.required && nullOrEmpty) return null;

        if (this.isWhiteSpace(value)) {
            return this.setError({ whitespace: true });
        }

        // Check for required validation
        if (this.required && nullOrEmpty) {
            return this.setError({ required: true });
        }

        // Validate minlength
        if (this.minlength != null && value?.length < +this.minlength) {
            return this.setError({ minlength: { requiredLength: +this.minlength, actualLength: value.length, HTML:'' } });
        }

        // Validate maxlength
        if (this.maxlength != null && value?.length > +this.maxlength) {
            return this.setError({ maxlength: { requiredLength: +this.maxlength, actualLength: value.length } });
        }

        // Validate pattern
        if (this.pattern && value) {
            const regex = typeof this.pattern === 'string' ? new RegExp(this.pattern) : this.pattern;
            if (!regex.test(value)) {
                if (this.type.toLocaleLowerCase() === 'email') return this.setError({ email: true }); 
                if (this.type.toLocaleLowerCase() === 'url') return this.setError({ url: true }); 
                return this.setError({ pattern: { requiredPattern: this.pattern.toString(), actualValue: value } });
            }
        }

        return null; // Valid
    }

}
