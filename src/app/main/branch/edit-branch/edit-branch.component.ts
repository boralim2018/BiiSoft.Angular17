import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateBranchInputDto, BranchDetailDto, BranchServiceProxy, BranchContactAddressDto } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { ContactAddressComponent } from '../../../../shared/components/contact-address/contact-address.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-branch',
    templateUrl: './edit-branch.component.html',
    providers: [BranchServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, InputTextModule, AbpValidationSummaryComponent, ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditBranchComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateBranchInputDto;
    contactAddress: BranchContactAddressDto;

    country: any;
    cityProvince: any;
    khanDistrict: any;
    sangkatCommune: any;
    village: any;

    constructor(
        injector: Injector,
        public _branchService: BranchServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getDetail();
    }

    initModel() {
        this.model = new CreateUpdateBranchInputDto();
        this.contactAddress = new BranchContactAddressDto();
    }

    getDetail() {
        this.initModel();
        this.saving = true;
        this._branchService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: BranchDetailDto) => {
                this.model.init(result);
                this.contactAddress = this.model.contactAddresses[0];
                if (this.contactAddress.countryId) this.country = { id: this.contactAddress.countryId, name: this.contactAddress.countryName };
                if (this.contactAddress.cityProvinceId) this.cityProvince = { id: this.contactAddress.cityProvinceId, name: this.contactAddress.cityProvinceName };
                if (this.contactAddress.khanDistrictId) this.khanDistrict = { id: this.contactAddress.khanDistrictId, name: this.contactAddress.khanDistrictName };
                if (this.contactAddress.sangkatCommuneId) this.sangkatCommune = { id: this.contactAddress.sangkatCommuneId, name: this.contactAddress.sangkatCommuneName };
                if (this.contactAddress.villageId) this.village = { id: this.contactAddress.villageId, name: this.contactAddress.villageName };
            });
    }

    save(): void {
        this.saving = true;

        this._branchService.update(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
