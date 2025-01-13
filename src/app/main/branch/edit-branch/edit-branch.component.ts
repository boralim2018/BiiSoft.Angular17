import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateBranchInputDto, BranchDetailDto, BranchServiceProxy, ContactAddressDto, BranchUserDto } from '@shared/service-proxies/service-proxies';
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
import { FindUserComponent } from '../../../../shared/components/find-user/find-user.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgIf } from '@angular/common';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';

@Component({
    selector: 'app-edit-branch',
    templateUrl: './edit-branch.component.html',
    animations: [appModuleAnimation()],
    providers: [BranchServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, NgIf, InputTextModule, RadioButtonModule, FindUserComponent, AbpValidationSummaryComponent, ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule]
})
export class EditBranchComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateBranchInputDto;
    users: any[] = [];

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
                this.setAddressDetails(result.billingAddress);
                this.setAddressDetails(result.shippingAddress);

                if (result.branchUsers && result.branchUsers.length) {
                    this.users = result.branchUsers.map(b => {
                        return { id: b.memberId, userName: b.userName };
                    });
                }

            });
    }

    private setAddressDetails(address: ContactAddressDto): void {
        if (address.countryId) address['country'] = { id: address.countryId, name: address.countryName };
        if (address.cityProvinceId) address['cityProvince'] = { id: address.cityProvinceId, name: address.cityProvinceName };
        if (address.khanDistrictId) address['khanDistrict'] = { id: address.khanDistrictId, name: address.khanDistrictName };
        if (address.sangkatCommuneId) address['sangkatCommune'] = { id: address.sangkatCommuneId, name: address.sangkatCommuneName };
        if (address.villageId) address['village'] = { id: address.villageId, name: address.villageName };
    }

    mapUsers() {
        if (this.model.sharing == 0 || !this.users || !this.users.length) {
            this.model.branchUsers = [];
            return;
        }

        this.model.branchUsers = this.users.map(b => {
            let find = this.model.branchUsers.find(f => f.memberId == b.id);
            if (!find) {
                find = new BranchUserDto();
                find.memberId = b.id;
                find.userName = b.name;
            }

            return find;
        });
    }

    save(): void {
        this.saving = true;

        this.mapUsers();

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
