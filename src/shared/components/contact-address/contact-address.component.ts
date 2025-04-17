import { Component, Injector, OnInit, EventEmitter, Output, Input, forwardRef, ViewChild } from '@angular/core';
import { AbpValidationSummaryComponent } from '../validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FindVillageComponent } from '../find-village/find-village.component';
import { FindSangkatCommuneComponent } from '../find-sangkat-commune/find-sangkat-commune.component';
import { FindKhanDistrictComponent } from '../find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../find-city-province/find-city-province.component';
import { FindCountryComponent } from '../find-country/find-country.component';
import { NgIf } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { ControlValueAccessorComponentBase } from '../../control-value-accessor-component-base';
import { InputTextComponent } from '../input-text/input-text.component'; 

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
    imports: [
        NgIf, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, FindSangkatCommuneComponent,
        FindVillageComponent, FormsModule, InputTextModule, AbpValidationSummaryComponent, CheckboxModule, InputTextComponent]
})
export class ContactAddressComponent extends ControlValueAccessorComponentBase implements OnInit {

    @Input() name: string;
    @Input() title: string = this.l('ContactAddress');
    @Input() requiredPostalCode: boolean;
    @Input() requiredStreet: boolean;
    @Input() requiredHouseNo: boolean;
    @Input() isShippingAddress: boolean;
    @Input() sameAsBillingAddress: boolean;
    @Output() sameAsBillingAddressChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('countryRef') countryRef: FindCountryComponent;
    @ViewChild('cityProvinceRef') cityProvinceRef: FindCityProvinceComponent;
    @ViewChild('khanDistrictRef') khanDistrictRef: FindKhanDistrictComponent;
    @ViewChild('sangkatCommuneRef') sangkatCommuneRef: FindSangkatCommuneComponent;
    @ViewChild('villageRef') villageRef: FindVillageComponent;
    @ViewChild('postalCodeRef') postalCodeRef: InputTextComponent;
    @ViewChild('streetRef') streetRef: InputTextComponent;
    @ViewChild('houseNoRef') houseNoRef: InputTextComponent;

    
    touchedCountry: boolean;
    touchedCityProvince: boolean;
    touchedKhanDistrict: boolean;
    touchedSangkatCommune: boolean;
    touchedVillage: boolean;

    khanDistrictEnable: boolean = this.feature.isEnabled("App.Setup.Locations.KhanDistricts");
    sangkatCommuneEnable: boolean = this.feature.isEnabled("App.Setup.Locations.SangkatCommunes");
    villageEnable: boolean = this.feature.isEnabled("App.Setup.Locations.Villages");

    get addressLevel(): number {
        return this.appSession.generalSetting?.contactAddressLevel ?? 0;
    }

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        if (this.isShippingAddress) this.title = this.l('ShippingAddress');
        if (!this.model) this.model = {};
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

    onPostalCodeChange(event) {
        this.onChange(this.model);
        this.onTouched();
    }

    onStreetChange(event) {
        this.onChange(this.model);
        this.onTouched();
    }

    onHouseNoChange(event) {
        this.onChange(this.model);
        this.onTouched();
    }

    validate(control: AbstractControl): { [key: string]: any } | null {
       
        if (this.isShippingAddress && this.sameAsBillingAddress) return null;

        if (this.isNullOrUndefined(this.model)) return { required: true };

        let countryValidate = control.value?.country?.id && !this.countryRef.model ? null : this.countryRef.validate(control);
        if (countryValidate) return countryValidate;

        const addressLevel = this.addressLevel;

        if (addressLevel >= 1) {
            let validate = control.value?.cityProvince?.id && !this.cityProvinceRef.model ? null : this.cityProvinceRef.validate(control);
            if (validate) return validate;
        }

        if (addressLevel >= 2 && this.khanDistrictEnable) {
            let validate = control.value?.khanDistrict?.id && !this.khanDistrictRef.model ? null : this.khanDistrictRef.validate(control);
            if (validate) return validate;
        }

        if (addressLevel >= 3 && this.sangkatCommuneEnable) {
            let validate = control.value?.sangkatCommune?.id && !this.sangkatCommuneRef.model ? null : this.sangkatCommuneRef.validate(control);
            if (validate) return validate;
        }

        if (addressLevel >= 4 && this.villageEnable) {
            let validate = control.value?.village?.id && !this.villageRef.model ? null : this.villageRef.validate(control);
            if (validate) return validate;
        }

        if (this.requiredPostalCode) {
            if (control.value.postalCode != this.postalCodeRef.model) this.postalCodeRef.model = control.value.postalCode;
            let validate = this.postalCodeRef.validate(control);
            if (validate) return validate;
        }

        if (this.requiredStreet) {
            if (control.value.street != this.streetRef.model) this.streetRef.model = control.value.street;
            let validate = this.streetRef.validate(control);
            if (validate) return validate;
        }

        if (this.requiredHouseNo) {
            if (control.value.houseNo != this.houseNoRef.model) this.houseNoRef.model = control.value.houseNo;
            let validate = this.houseNoRef.validate(control);
            if (validate) return validate;
        }
        
        return null;
    }

}
