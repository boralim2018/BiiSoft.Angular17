import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateBranchInputDto, BranchDetailDto, BranchServiceProxy, ContactAddressDto } from '@shared/service-proxies/service-proxies';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { ContactAddressComponent } from '../../../../shared/components/contact-address/contact-address.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { of } from 'rxjs';

@Component({
    selector: 'app-edit-branch',
    templateUrl: './edit-branch.component.html',
    providers: [BranchServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule]
})
export class EditBranchComponent extends DynamicDialogBase implements OnInit {
    saving = false;
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
        public _branchService: BranchServiceProxy,
        private route: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.route.params.subscribe(params => {          
            this.getDetail();
        });
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
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.saving = false))
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

    save(): void {
        this.saving = true;

        this._branchService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                this.cancel();
            });
    }
    
    cancel() {
        window.history.back();
    }

}
