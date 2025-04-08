import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateItemCodeFormulaInputDto, ItemCodeFormulaDetailDto, ItemCodeFormulaItemTypeDto, ItemCodeFormulaServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SelectItemTypeComponent } from '../../../../shared/components/select-item-type/select-item-type.component';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-edit-item-code-formula',
    templateUrl: './edit-item-code-formula.component.html',
    providers: [ItemCodeFormulaServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextModule, AbpValidationSummaryComponent, SelectItemTypeComponent, RadioButtonModule, ButtonDirective, Ripple, LocalizePipe]
})
export class EditItemCodeFormulaComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateItemCodeFormulaInputDto = new CreateUpdateItemCodeFormulaInputDto();
    itemTypes: any[] = [];

    constructor(
        injector: Injector,
        public _itemCodeFormulaService: ItemCodeFormulaServiceProxy,
        private _dialogRef: DynamicDialogRef,
        private _dialogConfig: DynamicDialogConfig
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getDetail();
    }

    getDetail() {
        this.saving = true;
        this._itemCodeFormulaService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: ItemCodeFormulaDetailDto) => {
                this.model = new CreateUpdateItemCodeFormulaInputDto();
                this.model.init(result);
                this.itemTypes = result.itemTypes.map(t => t.itemType);
            });
    }

    save(): void {
        this.saving = true;

        this.model.itemTypes = !this.itemTypes ? [] : this.itemTypes.map(x => {
            let itemType = new ItemCodeFormulaItemTypeDto();
            itemType.itemType = x;
            return itemType;
        });

        this._itemCodeFormulaService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

}
