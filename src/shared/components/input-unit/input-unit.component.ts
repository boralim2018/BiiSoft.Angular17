import { Component, forwardRef, Injector, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { InputTextModule } from 'primeng/inputtext';
import { NgIf } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ControlValueAccessorComponentBase } from '../../control-value-accessor-component-base';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({ template: '' })
export abstract class InputUnitComponentBase extends ControlValueAccessorComponentBase implements OnInit {

    @Input() name: string;
    @Input() label: string;
    @Input() placeholder: string = '';
    @Input() minDigits: number = 0;
    @Input() maxDigits: number = 4;
    @Input() unit: any;
    @Output() unitChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() unitObjChange: EventEmitter<any> = new EventEmitter<any>();

    units: any[] = [];    
    loading: boolean;
    validateMessage: string;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        if (this.label) {
            this.validateMessage = this.l("IsRequired", this.label);
            if (!this.placeholder) this.placeholder = this.l('Select_', this.label);
        }
    }

    onUnitChange(event: any) {
        if (event.value == undefined || event.value == null) {
            this.unitObjChange.emit(undefined);
        }
        else {
            let obj = this.units.find(f => f.value === event.value);
            this.unitObjChange.emit(obj);
        }
        this.unitChange.emit(event.value);
    }

}

@Component({
    selector: 'input-length-unit, [inputLengthUnit]',
    templateUrl: './input-unit.component.html',
    styleUrl: './input-unit.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputLengthUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, InputTextModule, InputNumberModule]
})
export class InputLengthUnitComponent extends InputUnitComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getUnits();
    }

    getUnits() {
        this.loading = true;
        this._service.getLengthUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.units = result.items;
            });
    }
}


@Component({
    selector: 'input-weight-unit, [inputWeightUnit]',
    templateUrl: './input-unit.component.html',
    styleUrl: './input-unit.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputWeightUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, InputTextModule, InputNumberModule]
})
export class InputWeightUnitComponent extends InputUnitComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getUnits();
    }

    getUnits() {
        this.loading = true;
        this._service.getWeightUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.units = result.items;
            });
    }
}



@Component({
    selector: 'input-area-unit, [inputAreaUnit]',
    templateUrl: './input-unit.component.html',
    styleUrl: './input-unit.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputAreaUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, InputTextModule, InputNumberModule]
})
export class InputAreaUnitComponent extends InputUnitComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getUnits();
    }

    getUnits() {
        this.loading = true;
        this._service.getAreaUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.units = result.items;
            });
    }
}


@Component({
    selector: 'input-volume-unit, [inputVolumeUnit]',
    templateUrl: './input-unit.component.html',
    styleUrl: './input-unit.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputVolumeUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, InputTextModule, InputNumberModule]
})
export class InputVolumeUnitComponent extends InputUnitComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getUnits();
    }

    getUnits() {
        this.loading = true;
        this._service.getVolumeUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.units = result.items;
            });
    }
}
