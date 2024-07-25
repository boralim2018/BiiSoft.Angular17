import { Component, Injector, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AppComponentBase } from 'shared/app-component-base';
import { AbpValidationSummaryComponent } from '../validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FindVillageComponent } from '../find-village/find-village.component';
import { FindSangkatCommuneComponent } from '../find-sangkat-commune/find-sangkat-commune.component';
import { FindKhanDistrictComponent } from '../find-khan-district/find-khan-district.component';
import { FindCityProvinceComponent } from '../find-city-province/find-city-province.component';
import { FindCountryComponent } from '../find-country/find-country.component';
import { NgIf } from '@angular/common';

@Component({
    selector: '[contactAddress], contact-address',
    templateUrl: './contact-address.component.html',
    standalone: true,
    imports: [NgIf, FindCountryComponent, FindCityProvinceComponent, FindKhanDistrictComponent, FindSangkatCommuneComponent, FindVillageComponent, FormsModule, InputTextModule, AbpValidationSummaryComponent]
})
export class ContactAddressComponent extends AppComponentBase implements OnInit {

    @Input() title: string = this.l('ContactAddress');
    @Input() model: any;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

    @Input() country: any;
    @Output() countryChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() cityProvince: any;
    @Output() cityProvinceChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() khanDistrict: any;
    @Output() khanDistrictChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() sangkatCommune: any;
    @Output() sangkatCommuneChange: EventEmitter<any> = new EventEmitter<any>();
    @Input() village: any;
    @Output() villageChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        
    }

    onCountryChange(event) {
        this.model.countryId = event?.id;
        this.countryChange.emit(event);
    }

    onCityProvinceChange(event) {
        this.model.cityProvinceId = event?.id;
        this.cityProvinceChange.emit(event);
    }

    onKhanDistrictChange(event) {
        this.model.khanDistrictId = event?.id;
        this.khanDistrictChange.emit(event);
    }

    onSangkatCommuneChange(event) {
        this.model.sangkatCommuneId = event?.id;
        this.sangkatCommuneChange.emit(event);
    }

    onVillageChange(event) {
        this.model.villageId = event?.id;
        this.villageChange.emit(event);
    }
}
