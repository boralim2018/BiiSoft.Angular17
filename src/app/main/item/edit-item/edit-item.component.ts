import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemInputDto, ItemDetailDto, ItemServiceProxy, ContactAddressDto, ItemUserDto } from '@shared/service-proxies/service-proxies';
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
    selector: 'app-edit-item',
    templateUrl: './edit-item.component.html',
    animations: [appModuleAnimation()],
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, NgIf, InputTextModule, RadioButtonModule, FindUserComponent, AbpValidationSummaryComponent, ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule]
})
export class EditItemComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateItemInputDto;
    users: any[] = [];

    constructor(
        injector: Injector,
        public _itemService: ItemServiceProxy,
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
        this.model = new CreateUpdateItemInputDto();
        this.model.billingAddress = new ContactAddressDto();
        this.model.shippingAddress = new ContactAddressDto();
    }

    getDetail() {
        this.initModel();
        this.saving = true;
        this._itemService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ItemDetailDto) => {
                this.model.init(result);
                this.setAddressDetails(result.billingAddress);
                this.setAddressDetails(result.shippingAddress);

                if (result.itemUsers && result.itemUsers.length) {
                    this.users = result.itemUsers.map(b => {
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
            this.model.itemUsers = [];
            return;
        }

        this.model.itemUsers = this.users.map(b => {
            let find = this.model.itemUsers.find(f => f.memberId == b.id);
            if (!find) {
                find = new ItemUserDto();
                find.memberId = b.id;
                find.userName = b.name;
            }

            return find;
        });
    }

    save(): void {
        this.saving = true;

        this.mapUsers();

        this._itemService.update(this.model)
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
