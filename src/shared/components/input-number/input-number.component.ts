import { Component, Injector, OnInit, Input, forwardRef } from '@angular/core';
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
export class InputNumberComponent extends ControlValueAccessorComponentBase implements OnInit {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() minDigits: number = 0;
    @Input() maxDigits: number = 0;
    @Input() RTL: boolean;
    @Input() format: boolean = true;
    @Input() useGrouping: boolean = true;
    @Input() min: number = 0;
    @Input() max: number;
    @Input() maxlength: number;

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

}
