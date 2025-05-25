import { Component, Injector, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CreateUpdateBOMInputDto, BOMServiceProxy, BOMItemDto } from '@shared/service-proxies/service-proxies';
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
import { SelectBOMTypeComponent } from '@shared/components/select/select-bom-type.component';
import { FindItemComponent } from '@shared/components/find-item/find-item.component';
import { TableModule } from 'primeng/table';
import { RecordNotFoundComponent } from '../../../../shared/components/record-not-found/record-not-found.component';
import { InputNumberComponent } from '../../../../shared/components/input-number/input-number.component';

@Component({
    selector: 'app-create-bom',
    templateUrl: './create-bom.component.html',
    providers: [BOMServiceProxy],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [
        FormsModule, NgIf, BusyDirective, InputTextComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule, SelectBOMTypeComponent,
        FindItemComponent, TableModule, RecordNotFoundComponent, InputNumberComponent
    ]
})
export class CreateBOMComponent extends AppComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateBOMInputDto = new CreateUpdateBOMInputDto();
    outputItem: any;
    selectedComponents: any[];

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

    onComponentChange(components: any[]) {
        if (!components || !components.length) return;

        if (!this.model.bomItems) this.model.bomItems = [];

        let addComponents: BOMItemDto[] = [];
        const itemIds = new Set(this.model.bomItems.map((z) => z.itemId));

        for (let z of components) {

            if (itemIds.has(z.id)) {
                this.message.error(this.l('Duplicate', this.l('Components')));
                this.selectedComponents = [];
                return;
            }

            const itemcomponent = BOMItemDto.fromJS({
                itemId: z.id,
                itemName: z.name,
                qty: 1
            });
            addComponents.push(itemcomponent);
            itemIds.add(z.id);
        }

        this.model.bomItems = [...this.model.bomItems, ...addComponents];
        this.selectedComponents = [];
    }

    clearComponents() {
        this.model.bomItems = [];
    }

    removeComponent(item: BOMItemDto) {
        this.model.bomItems = this.model.bomItems.filter((z) => z.itemId != item.itemId);
    }
}
