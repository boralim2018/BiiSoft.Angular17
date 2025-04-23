import { Component, Injector, OnInit, Input, forwardRef, SimpleChanges, OnChanges } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule, NG_VALIDATORS } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessorComponentBase } from '../../control-value-accessor-component-base';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'input-number, [inputNumber]',
    templateUrl: './input-number.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true,
        },
    ],
    standalone: true,
    imports: [FormsModule, NgIf, NgClass, InputNumberModule]
})
export class InputNumberComponent extends ControlValueAccessorComponentBase implements OnInit, OnChanges {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() RTL: boolean;
    @Input() format: boolean = true;
    @Input() useGrouping: boolean = true;
    @Input() min: number = 0;
    @Input() max: number;
    @Input() minDigits: number = 0;
    @Input() maxDigits: number = 2;
    @Input() maxlength: number;
    @Input() prefix: string;
    @Input() suffix: string;

    pre: string;
    suf: string;

    inputStyleClass: string;

    validateMessage: string;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.label) {
            this.validateMessage = this.l("IsRequired", this.label);
            if (!this.placeholder) this.placeholder = this.l('PleaseEnter_', this.label);
        }
        else if (this.placeholder) {
            this.validateMessage = this.placeholder;
        }

        if (this.RTL) this.inputStyleClass = 'text-right';
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['prefix'] /*&& !changes['prefix'].firstChange*/) {
            this.updatePrefix();
        }
        if (changes['suffix'] /*&& !changes['suffix'].firstChange*/) {
            this.updateSuffix();
        }
    }

    onBlur() {
        this.updatePrefix();
        this.updateSuffix();
        this.onTouched();
    }

    private updatePrefix() {
        this.pre = this.prefix ? this.prefix + ' ' : undefined;
    }

    private updateSuffix() {
        this.suf = this.suffix ? ' ' + this.suffix : undefined;
    }

    onFocus() {
        this.suf = undefined;
        this.pre = undefined;
    }

}
