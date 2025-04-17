import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { DropdownComponentBase } from 'shared/select-component-base';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'select-digit, [selectDigit]',
    templateUrl: '../template/dropdown-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectDigitComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SelectDigitComponent),
            multi: true,
        }
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, NgClass]
})
export class SelectDigitComponent extends DropdownComponentBase implements OnInit {

    constructor(injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getModels();
    }

    getModels() {
        this.models = [1, 2, 3, 4, 5, 6];
    }
}
