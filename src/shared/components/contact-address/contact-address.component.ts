import { Component, Injector, OnInit, EventEmitter, Output, Input, forwardRef, ViewChild } from '@angular/core';
import { AbpValidationSummaryComponent } from '../validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { AbstractControl, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
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

    onSameAsBillingAddressChange(event) {
        this.sameAsBillingAddressChange.emit(event);
        this.onChange(this.model);
        this.onTouched();
    }

    onCountryChange(event) {
        this.model.countryId = event?.id;
        this.onChange(this.model);
        this.onTouched();
    }

    onCityProvinceChange(event) {
        this.model.cityProvinceId = event?.id;
        this.onChange(this.model);
        this.onTouched();
    }

    onKhanDistrictChange(event) {
        this.model.khanDistrictId = event?.id;
        this.onChange(this.model);
        this.onTouched();
    }

    onSangkatCommuneChange(event) {
        this.model.sangkatCommuneId = event?.id;
        this.onChange(this.model);
        this.onTouched();
    }

    onVillageChange(event) {
        this.model.villageId = event?.id;
        this.onChange(this.model);
        this.onTouched();
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
        this.invalid = false; // Reset invalid flag

        if (this.isShippingAddress && this.sameAsBillingAddress) return null;

        const value = control.value;

        if (this.isNullOrUndefined(value)) {
            return this.setError({ required: true });
        }

        if (!value?.countryId) {
            return this.setError({ required: { requiredCountry: true } });
        }

        const addressLevel = this.addressLevel;

        if (addressLevel >= 1 && !value?.cityProvinceId) {
            return this.setError({ required: { requiredCityProvince: true } });
        }

        if (addressLevel >= 2 && !value?.khanDistrictId) {
            return this.setError({ required: { requiredKhanDistrict: true } });
        }

        if (addressLevel >= 3 && !value?.sangkatCommuneId) {
            return this.setError({ required: { requiredSangkatCommune: true } });
        }

        if (addressLevel >= 4 && !value?.villageId) {
            return this.setError({ required: { requiredVillage: true } });
        }

        if (this.isWhiteSpace(value?.postalCode)) {
            return this.setError({ whitespace: { invalidPostalCode: true } });
        }

        if (this.requiredPostalCode && !value?.postalCode) {
            return this.setError({ required: { requiredPostalCode: true } });
        }
        
        if (this.isWhiteSpace(value?.street)) {
            return this.setError({ whitespace: { invalidStreet: true } });
        }

        if (this.requiredStreet && !value?.street) {
            return this.setError({ required: { requiredStreet: true } });
        }

        if (this.isWhiteSpace(value?.houseNo)) {
            return this.setError({ whitespace: { invalidHouseNo: true } });
        }

        if (this.requiredHouseNo && !value?.houseNo) {
            return this.setError({ required: { requiredHouseNo: true } });
        }        
        
        return null;
    }

}
