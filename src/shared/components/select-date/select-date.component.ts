import { Component, Injector, OnInit, Input, forwardRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbpValidationSummaryComponent } from '../validation/abp-validation.summary.component';
import { ControlValueAccessorComponentBase } from '../../control-value-accessor-component-base';

@Component({
    selector: 'select-date, [selectDate]',
    templateUrl: './select-date.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectDateComponent),
        multi: true
    }],
    standalone: true,
    imports: [FormsModule, NgIf, CalendarModule, AbpValidationSummaryComponent]
})
export class SelectDateComponent extends ControlValueAccessorComponentBase implements OnInit {

    @Input() label: string;
    @Input() placeholder: string;
    @Input() inputId: string;
    @Input() appendTo: any = 'body'
    @Input() required: boolean;
    @Input() invalid: boolean;
    
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {      
        this.placeholder = this.l('Select_', this.l('Date'));
    }
    
}
