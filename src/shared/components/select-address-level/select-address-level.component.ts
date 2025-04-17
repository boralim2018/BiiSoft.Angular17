import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { DropdownComponentBase } from 'shared/select-component-base';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'select-address-level, [selectAddressLevel]',
    templateUrl: '../template/dropdown-template.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectAddressLevelComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => SelectAddressLevelComponent),
            multi: true,
        }
    ],
    standalone: true,
    imports: [DropdownModule, FormsModule, NgIf, NgClass]
})
export class SelectAddressLevelComponent extends DropdownComponentBase implements OnInit {

    constructor(injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getModels();
    }

    getModels() {
        this.models = [
            { value: 0, label: `L0 : ${this.l('Country')}` },
            { value: 1, label: `L1 : ${this.l('CityProvince')}` }
        ];

        if (this.feature.isEnabled("App.Setup.Locations.KhanDistricts")) this.models.push({ value: 2, label: `L2 : ${this.l('KhanDistrict')}` });
        if (this.feature.isEnabled("App.Setup.Locations.SangkatCommunes")) this.models.push({ value: 3, label: `L3 : ${this.l('SangkatCommune')}` });
        if (this.feature.isEnabled("App.Setup.Locations.Villages")) this.models.push({ value: 4, label: `L4 : ${this.l('Village')}` });
    }
}
