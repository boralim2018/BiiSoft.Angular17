import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { CreateUpdateBOMInputDto, BOMDetailDto, BOMServiceProxy } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { InputTextComponent } from '../../../../shared/components/input-text/input-text.component';
import { appModuleAnimation } from '../../../../shared/animations/routerTransition';
import { AppComponentBase } from '../../../../shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { DividerModule } from 'primeng/divider';


@Component({
    selector: 'app-edit-bom',
    templateUrl: './edit-bom.component.html',
    providers: [BOMServiceProxy],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [FormsModule, NgIf, BusyDirective, InputTextComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule]
})
export class EditBOMComponent extends AppComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateBOMInputDto = new CreateUpdateBOMInputDto();
    

    constructor(
        injector: Injector,
        public _bomService: BOMServiceProxy,
        private route: ActivatedRoute
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getDetail();
    }

    getDetail() {
        this.saving = true;
        this._bomService
            .getDetail(this.route.snapshot.params.id)
            .pipe(finalize(() => this.saving = false))
            .subscribe((result: BOMDetailDto) => {
                this.model.init(result);
            });
    }

    save(): void {
        this.saving = true;

        this._bomService.update(this.model)
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
