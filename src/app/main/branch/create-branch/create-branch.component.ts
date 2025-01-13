import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CreateUpdateBranchInputDto, BranchServiceProxy, ContactAddressDto, BranchUserDto } from '@shared/service-proxies/service-proxies';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { ContactAddressComponent } from '../../../../shared/components/contact-address/contact-address.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { DividerModule } from 'primeng/divider';
import { of } from 'rxjs';
import { FindUserComponent } from '../../../../shared/components/find-user/find-user.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgIf } from '@angular/common';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';

@Component({
    selector: 'app-create-branch',
    templateUrl: './create-branch.component.html',
    animations: [appModuleAnimation()],
    providers: [BranchServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, NgIf, InputTextModule, RadioButtonModule, FindUserComponent, AbpValidationSummaryComponent, ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule]
})
export class CreateBranchComponent extends AppComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateBranchInputDto = new CreateUpdateBranchInputDto();
    users: any[] = [];

    constructor(
        injector: Injector,
        public _branchService: BranchServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateBranchInputDto();
        this.model.billingAddress = new ContactAddressDto();
        this.model.sameAsBillingAddress = true;
        this.model.shippingAddress = new ContactAddressDto();
    };

    mapUsers() {
        if (this.model.sharing == 0 || !this.users || !this.users.length) {
            this.model.branchUsers = [];
            return;
        }

        this.model.branchUsers = this.users.map(b => {
            let user = new BranchUserDto();
            user.memberId = b.id;
            user.userName = b.name;
            return user;
        });
    }

    save(form?: NgForm): void {
        this.saving = true;

        this.mapUsers();

        this._branchService.create(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                if (form) {
                    this.initModel();
                    form.resetForm();
                }
                else {
                    this.cancel();
                }
            });
    }

    saveNew(form: NgForm) {
        this.save(form);
    }

    cancel() {
        window.history.back();
    }

}
