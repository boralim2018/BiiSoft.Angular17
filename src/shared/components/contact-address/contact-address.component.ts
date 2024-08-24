import { Component, Injector, OnInit, EventEmitter, Output, Input, forwardRef } from '@angular/core';
import { AbpValidationSummaryComponent } from '../validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { FindVillageComponent } from '../find-village/find-village.component';
import { FindSangkatCommuneComponent } from '../find-sangkat-commune/find-sangkat-commune.component';
import { FindKhanDistrictComponent } from '../find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../find-city-province/find-city-province.component';
import { FindCountryComponent } from '../find-country/find-country.component';
import { NgIf } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ControlValueAccessorComponentBase } from '../../control-value-accessor-component-base';

@Component({
    selector: '[contactAddress], contact-address',
    templateUrl: './contact-address.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ContactAddressComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ContactAddressComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [NgIf, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, FindSangkatCommuneComponent, FindVillageComponent, FormsModule, InputTextModule, AbpValidationSummaryComponent, CheckboxModule]
})
export class ContactAddressComponent extends ControlValueAccessorComponentBase implements OnInit, Validator {

    @Input() name: string;
    @Input() title: string = this.l('ContactAddress');
    @Input() addressLevel: number;
    @Input() requiredPostalCode: boolean;
    @Input() requiredStreet: boolean;
    @Input() requiredHouseNo: boolean;
    @Input() isShippingAddress: boolean;
    @Input() sameAsBillingAddress: boolean;
    @Output() sameAsBillingAddressChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    
    touchedCountry: boolean;
    touchedCityProvince: boolean;
    touchedKhanDistrict: boolean;
    touchedSangkatCommune: boolean;
    touchedVillage: boolean;

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this.isShippingAddress) this.title = this.l('ShippingAddress');
    }

    onCountryChange(event) {
        this.model.countryId = event?.id;
        this.onChange(this.model);
        this.onTouched();
        this.touchedCountry = true;
    }

    onCityProvinceChange(event) {
        this.model.cityProvinceId = event?.id;
        this.onChange(this.model);
        this.onTouched();
        this.touchedCityProvince = true;
    }

    onKhanDistrictChange(event) {
        this.model.khanDistrictId = event?.id;
        this.onChange(this.model);
        this.onTouched();
        this.touchedKhanDistrict = true;
    }

    onSangkatCommuneChange(event) {
        this.model.sangkatCommuneId = event?.id;
        this.onChange(this.model);
        this.onTouched();
        this.touchedSangkatCommune = true;
    }

    onVillageChange(event) {
        this.model.villageId = event?.id;
        this.onChange(this.model);
        this.onTouched();
        this.touchedVillage = true;
    }

    validate(control: AbstractControl): { [key: string]: any } | null {
        const isValid = this.sameAsBillingAddress || (
            this.model.countryId &&
            (this.addressLevel < 1 || this.model.cityProvinceId) && 
            (this.addressLevel < 2 || this.model.khanDistrictId) && 
            (this.addressLevel < 3 || this.model.sangkatCommuneId) && 
            (this.addressLevel < 4 || this.model.villageId) &&
            (!this.requiredPostalCode || this.model.postalCode) &&
            (!this.requiredStreet || this.model.street) &&
            (!this.requiredHouseNo || this.model.houseNo)
        );

        let result = isValid ? null : { invalid: true };
        return result;
    }

}
