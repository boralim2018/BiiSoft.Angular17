import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemSizeInputDto, ItemSizeServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { NgIf } from '@angular/common';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';

@Component({
    selector: 'app-create-item-size',
    templateUrl: './create-item-size.component.html',
    providers: [ItemSizeServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateItemSizeComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateItemSizeInputDto = new CreateUpdateItemSizeInputDto();
    useCode: boolean = this.appSession.itemFieldSetting?.useCode;

    constructor(
        injector: Injector,
        public _itemSizeService: ItemSizeServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateItemSizeInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._itemSizeService.create(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                if (form) {
                    this.initModel();
                    form.resetForm();
                }
                else {
                    this._dialogRef.close(result);
                }
            });
    }

    saveNew(form: NgForm) {
        this.save(form);
    }
}
