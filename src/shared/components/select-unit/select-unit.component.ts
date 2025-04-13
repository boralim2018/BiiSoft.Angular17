import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { CommonLookupServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { SelectComponentBase } from 'shared/select-component-base';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'select-length-unit, [selectLengthUnit]',
    templateUrl: '../template/select-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectLengthUnitComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SelectLengthUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, MultiSelectModule, CheckboxModule, FormsModule, NgIf, NgClass, InputTextModule]
})
export class SelectLengthUnitComponent extends SelectComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getModels();
    }

    getModels() {
        this.loading = true;
        this._service.getLengthUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items;
            });
    }
}


@Component({
    selector: 'select-weight-unit, [selectWeightUnit]',
    templateUrl: '../template/select-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectWeightUnitComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SelectWeightUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, MultiSelectModule, CheckboxModule, FormsModule, NgIf, NgClass, InputTextModule]
})
export class SelectWeightUnitComponent extends SelectComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getModels();
    }

    getModels() {
        this.loading = true;
        this._service.getWeightUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items;
            });
    }
}


@Component({
    selector: 'select-area-unit, [selectAreaUnit]',
    templateUrl: '../template/select-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectAreaUnitComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SelectAreaUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, MultiSelectModule, CheckboxModule, FormsModule, NgIf, NgClass, InputTextModule]
})
export class SelectAreaUnitComponent extends SelectComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getModels();
    }

    getModels() {
        this.loading = true;
        this._service.getAreaUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items;
            });
    }
}


@Component({
    selector: 'select-volume-unit, [selectVolumeUnit]',
    templateUrl: '../template/select-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectVolumeUnitComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SelectVolumeUnitComponent),
            multi: true,
        },
        CommonLookupServiceProxy
    ],
    standalone: true,
    imports: [DropdownModule, MultiSelectModule, CheckboxModule, FormsModule, NgIf, NgClass, InputTextModule]
})
export class SelectVolumeUnitComponent extends SelectComponentBase implements OnInit {

    constructor(injector: Injector,
        private _service: CommonLookupServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getModels();
    }

    getModels() {
        this.loading = true;
        this._service.getVolumeUnits()
            .pipe(finalize(() => { this.loading = false; }))
            .subscribe((result) => {
                this.models = result.items;
            });
    }
}
