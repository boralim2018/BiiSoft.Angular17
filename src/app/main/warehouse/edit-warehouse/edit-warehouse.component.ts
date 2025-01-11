import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateWarehouseInputDto, WarehouseBranchDto, WarehouseDetailDto, WarehouseServiceProxy } from '@shared/service-proxies/service-proxies';
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { FindBranchComponent } from '../../../../shared/components/find-branch/find-branch.component';

@Component({
    selector: 'app-edit-warehouse',
    templateUrl: './edit-warehouse.component.html',
    providers: [WarehouseServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextModule, RadioButtonModule, FindBranchComponent, AbpValidationSummaryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class EditWarehouseComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateWarehouseInputDto = new CreateUpdateWarehouseInputDto();
    branches: any[] = [];

    constructor(
        injector: Injector,
        public _warehouseService: WarehouseServiceProxy,
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
        this._warehouseService
            .getDetail(this._dialogConfig.data.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: WarehouseDetailDto) => {
                this.model = new CreateUpdateWarehouseInputDto(result);
                if (result.warehouseBranches && result.warehouseBranches.length) {
                    this.branches = result.warehouseBranches.map(b => {
                        let branch = { id: b.branchId, name: b.branchName };
                        return branch;
                    });
                }
            });
    }

    save(): void {
        this.saving = true;

        this.mapBranches();

        this._warehouseService.update(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

    mapBranches() {
        if (this.model.sharing == 0 || !this.branches || !this.branches.length) {
            this.model.warehouseBranches = [];
            return;
        }

        this.model.warehouseBranches = this.branches.map(b => {
            let find = this.model.warehouseBranches.find(f => f.branchId == b.id);
            if (!find) {
                find = new WarehouseBranchDto();
                find.branchId = b.id;
                find.branchName = b.name;
            }

            return find;
        });
    }
}
