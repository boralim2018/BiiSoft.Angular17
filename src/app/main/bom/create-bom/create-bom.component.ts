import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateBOMInputDto, BOMServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { NgIf } from '@angular/common';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-create-bom',
    templateUrl: './create-bom.component.html',
    providers: [BOMServiceProxy],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule]
})
export class CreateBOMComponent extends AppComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateBOMInputDto = new CreateUpdateBOMInputDto();
    

    constructor(
        injector: Injector,
        public _bomService: BOMServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.initModel();
    }

    initModel() {
        this.model = new CreateUpdateBOMInputDto();
    };

    save(form?: NgForm): void {
        this.saving = true;

        this._bomService.create(this.model)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));

                if (form) {
                    this.initModel();
                    form.resetForm(this.model);
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
