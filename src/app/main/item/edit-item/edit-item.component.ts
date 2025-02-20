import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemInputDto, ItemDetailDto, ItemServiceProxy, ContactAddressDto, ItemZoneDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
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
        this.model.itemZones = [];
    }

    getDetail() {
        this.initModel();
        this.saving = true;
        this._itemService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ItemDetailDto) => {
                this.model.init(result);
                
            });
    }


    save(): void {
        this.saving = true;

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
