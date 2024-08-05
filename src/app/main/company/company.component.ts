import { Component, Injector, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableSettingComponent } from '../../../shared/components/table-setting/table-setting.component';
import { AppComponentBase, NavBarComponentBase } from '../../../shared/app-component-base';
import { Mixin } from 'ts-mixer';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { DividerModule } from 'primeng/divider';
import { finalize } from 'rxjs/operators';
import { BranchDetailDto, BranchServiceProxy, ContactAddressDto, CreateUpdateBranchInputDto } from '../../../shared/service-proxies/service-proxies';
import { appModuleAnimation } from '../../../shared/animations/routerTransition';
import { BusyDirective } from '../../../shared/directives/busy.directive';
import { InputTextModule } from 'primeng/inputtext';
import { AbpValidationSummaryComponent } from '../../../shared/components/validation/abp-validation.summary.component';
import { ContactAddressComponent } from '../../../shared/components/contact-address/contact-address.component';
import { LocalizePipe } from '../../../shared/pipes/localize.pipe';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrl: './company.component.scss',
    animations: [appModuleAnimation()],
    providers: [BranchServiceProxy],
    standalone: true,
    imports: [FormsModule, StepperModule, ButtonModule, OverlayPanelModule, TableSettingComponent, DividerModule, NavBarComponent, BusyDirective, InputTextModule, AbpValidationSummaryComponent, ContactAddressComponent, LocalizePipe],
})
export class CompanyComponent extends Mixin(AppComponentBase, NavBarComponentBase) implements OnInit {

    title: string = this.l('CompanySetup');
    activeStep: number = 0;    
    saving: boolean;

    model: CreateUpdateBranchInputDto;

    country: any;
    cityProvince: any;
    khanDistrict: any;
    sangkatCommune: any;
    village: any;

    country2: any;
    cityProvince2: any;
    khanDistrict2: any;
    sangkatCommune2: any;
    village2: any;

    constructor(
        injector: Injector,
        private _branchService: BranchServiceProxy)
    {
        super(injector);

    }

    ngOnInit() {
        this.setTitle();

        this.getDetail();
    }

    initModel() {
        this.model = new CreateUpdateBranchInputDto();
        this.model.billingAddress = new ContactAddressDto();
        this.model.shippingAddress = new ContactAddressDto();
    }

    getDetail() {
        this.initModel();
        this.saving = true;
        this._branchService
            .getDetail("59b503f5-37cd-4fe0-bef2-b70a74e317db")
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: BranchDetailDto) => {
                this.model.init(result);

                if (this.model.billingAddress.countryId) this.country = { id: this.model.billingAddress.countryId, name: this.model.billingAddress.countryName };
                if (this.model.billingAddress.cityProvinceId) this.cityProvince = { id: this.model.billingAddress.cityProvinceId, name: this.model.billingAddress.cityProvinceName };
                if (this.model.billingAddress.khanDistrictId) this.khanDistrict = { id: this.model.billingAddress.khanDistrictId, name: this.model.billingAddress.khanDistrictName };
                if (this.model.billingAddress.sangkatCommuneId) this.sangkatCommune = { id: this.model.billingAddress.sangkatCommuneId, name: this.model.billingAddress.sangkatCommuneName };
                if (this.model.billingAddress.villageId) this.village = { id: this.model.billingAddress.villageId, name: this.model.billingAddress.villageName };

                if (this.model.shippingAddress.countryId) this.country2 = { id: this.model.shippingAddress.countryId, name: this.model.shippingAddress.countryName };
                if (this.model.shippingAddress.cityProvinceId) this.cityProvince2 = { id: this.model.shippingAddress.cityProvinceId, name: this.model.shippingAddress.cityProvinceName };
                if (this.model.shippingAddress.khanDistrictId) this.khanDistrict2 = { id: this.model.shippingAddress.khanDistrictId, name: this.model.shippingAddress.khanDistrictName };
                if (this.model.shippingAddress.sangkatCommuneId) this.sangkatCommune2 = { id: this.model.shippingAddress.sangkatCommuneId, name: this.model.shippingAddress.sangkatCommuneName };
                if (this.model.shippingAddress.villageId) this.village2 = { id: this.model.shippingAddress.villageId, name: this.model.shippingAddress.villageName };
            });
    }
}
