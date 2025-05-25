import { Component, Injector, OnInit } from '@angular/core';
import { CreateUpdateBOMInputDto, BOMDetailDto, BOMServiceProxy, BOMItemDto } from '@shared/service-proxies/service-proxies';
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
import { TableModule } from 'primeng/table';
import { FindItemComponent } from '../../../../shared/components/find-item/find-item.component';
import { InputNumberComponent } from '../../../../shared/components/input-number/input-number.component';
import { RecordNotFoundComponent } from '../../../../shared/components/record-not-found/record-not-found.component';
import { SelectBOMTypeComponent } from '../../../../shared/components/select/select-bom-type.component';


@Component({
    selector: 'app-edit-bom',
    templateUrl: './edit-bom.component.html',
    providers: [BOMServiceProxy],
    animations: [appModuleAnimation()],
    standalone: true,
    imports: [
        FormsModule, NgIf, BusyDirective, InputTextComponent, ButtonDirective, Ripple, LocalizePipe, DividerModule, SelectBOMTypeComponent,
        FindItemComponent, TableModule, RecordNotFoundComponent, InputNumberComponent
    ]
})
export class EditBOMComponent extends AppComponentBase implements OnInit {
    saving = false;
    model: CreateUpdateBOMInputDto = new CreateUpdateBOMInputDto();
    outputItem: any;
    selectedComponents: any[];

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
                this.outputItem = { id: result.itemId, name: result.itemName };
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
