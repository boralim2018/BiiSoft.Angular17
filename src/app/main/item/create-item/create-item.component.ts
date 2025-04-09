import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CreateUpdateItemInputDto, ItemServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { ContactAddressComponent } from '../../../../shared/components/contact-address/contact-address.component';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { DividerModule } from 'primeng/divider';
import { FindUserComponent } from '../../../../shared/components/find-user/find-user.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgIf } from '@angular/common';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';
import { SelectItemCategoryComponent } from '../../../../shared/components/select-item-type/select-item-category.component';
import { AttachFileComponent } from '../../../../shared/components/attach-file/attach-file.component';

@Component({
    selector: 'app-create-item',
    templateUrl: './create-item.component.html',
    animations: [appModuleAnimation()],
    providers: [ItemServiceProxy],
    standalone: true,
    imports: [
        FormsModule, BusyDirective, NgIf, InputTextModule, RadioButtonModule, FindUserComponent, AbpValidationSummaryComponent,
        ContactAddressComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule, SelectItemCategoryComponent, AttachFileComponent ]
})
export class CreateItemComponent extends AppComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateItemInputDto = new CreateUpdateItemInputDto();
    users: any[] = [];

    constructor(
        injector: Injector,
        public _itemService: ItemServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateItemInputDto();
        this.model.itemZones = [];
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._itemService.create(this.model)
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
