import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateWarehouseInputDto, WarehouseBranchDto, WarehouseServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { catchError, finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { NgIf } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FindBranchComponent } from '../../../../shared/components/find-branch/find-branch.component';

@Component({
    selector: 'app-create-warehouse',
    templateUrl: './create-warehouse.component.html',
    providers: [WarehouseServiceProxy],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextModule, RadioButtonModule, FindBranchComponent, AbpValidationSummaryComponent, ButtonDirective, Ripple, LocalizePipe]
})
export class CreateWarehouseComponent extends DynamicDialogBase implements OnInit {
    saving = false;
    model: CreateUpdateWarehouseInputDto = new CreateUpdateWarehouseInputDto();
    branches: any[]=[];

    constructor(
        injector: Injector,
        public _warehouseService: WarehouseServiceProxy,
        private _dialogRef: DynamicDialogRef
    ) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateWarehouseInputDto();
        this.model.warehouseBranches = [];
        this.model.sharing = 0;
    };

    save(form?: NgForm): void {
        this.saving = true;

        this.mapBranches();

        this._warehouseService.create(this.model)
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

    mapBranches() {
        if (this.model.sharing == 0 || !this.branches || !this.branches.length) {
            this.model.warehouseBranches = [];
            return;
        }

        this.model.warehouseBranches = this.branches.map(b => {
            let branch = new WarehouseBranchDto();
            branch.branchId = b.id;
            branch.branchName = b.name;
            return branch;
        });
    }
}
