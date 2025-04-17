import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemCodeFormulaInputDto, ItemCodeFormulaItemTypeDto, ItemCodeFormulaServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectItemTypeComponent } from '../../../../shared/components/select-item-type/select-item-type.component';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { NgIf } from '@angular/common';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { InputNumberComponent } from '../../../../shared/components/input-number/input-number.component';

@Component({
    selector: 'app-create-item-code-formula',
    templateUrl: './create-item-code-formula.component.html',
    providers: [ItemCodeFormulaServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextComponent, InputNumberComponent, SelectItemTypeComponent, ButtonDirective, Ripple, LocalizePipe, RadioButtonModule ]
})
export class CreateItemCodeFormulaComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateItemCodeFormulaInputDto = new CreateUpdateItemCodeFormulaInputDto();
    itemTypes: any[] = [];

    constructor(
        injector: Injector,
        public _itemCodeFormulaService: ItemCodeFormulaServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateItemCodeFormulaInputDto();
        this.model.type = 0;
        this.model.itemTypes = [];
    };

    save(form?: NgForm): void {
        this.saving = true;

        this.model.itemTypes = !this.itemTypes ? [] : this.itemTypes.map(x => {
            let itemType = new ItemCodeFormulaItemTypeDto();
            itemType.itemType = x;
            return itemType;
        });

        this._itemCodeFormulaService.create(this.model)
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
