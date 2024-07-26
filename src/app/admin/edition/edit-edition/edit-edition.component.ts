import { Component, Injector, OnInit } from '@angular/core';
import {
    EditionServiceProxy,
    EditionEditDto,
    FlatFeatureDto,
    CreateOrUpdateEditionDto,
    NameValueDto,
    GetEditionEditOutput
} from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TreeNode, PrimeTemplate } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { NgIf } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit',
    templateUrl: './edit-edition.component.html',
    providers: [EditionServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, TabViewModule, InputTextModule, AbpValidationSummaryComponent, TreeModule, PrimeTemplate, NgIf, InputNumberModule, DropdownModule, ButtonDirective, Ripple, LocalizePipe]
})
export class EditEditionComponent extends DynamicDialogBase implements OnInit {

    saving = false;
    edition = new EditionEditDto();
    selectedNodes: TreeNode<FlatFeatureDto>[] = [];
    nodeItems: TreeNode<FlatFeatureDto>[] = [];
    allNodes: TreeNode<FlatFeatureDto>[] = [];

    constructor(
        injector: Injector,
        private _editionService: EditionServiceProxy,
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
        this._editionService
            .getEditionForEdit(this._dialogConfig.data.id)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: GetEditionEditOutput) => {
                this.edition = result.edition;
                this.mapNode(result.features, result.featureValues);
            });
    }

    private mapNode(source: FlatFeatureDto[], selected: NameValueDto[]) {

        this.allNodes = [];
        this.selectedNodes = [];
        this.nodeItems = [];

        source.map(n => {

            let find = selected.find(f => f.name === n.name);
            if (find) {
                n.defaultValue = find.value;
            }

            let node: TreeNode<FlatFeatureDto> =
            {
                data: n,
                label: n.displayName,
                expandedIcon: "pi pi-folder-open",
                collapsedIcon: "pi pi-folder",
                children: [],
                selectable: n.inputType.name === "CHECKBOX"
            };

            this.allNodes.push(node);

            if (!n.parentName) {
                node.expanded = true;
                this.nodeItems.push(node);
            }
            else {
                var parent = this.allNodes.find(s => s.data.name == n.parentName);
                if (parent) parent.children.push(node);
            }
        });

       
        this.selectedNodes = this.allNodes.filter(f =>
            selected.find(s =>
                s.name === f.data.name && this.validFeatureValue(s.value, f.data.inputType.validator)                
            ) !== undefined);
    }

    validFeatureValue(value: any, validator: any): boolean {

        if (validator && validator.name === 'NUMERIC') {
            const numValue = parseInt(value);
            return !isNaN(numValue) && validator.attributes.MinValue <= numValue && numValue <= validator.attributes.MaxValue;
        }

        return !this.isNullOrSpaces(value) && value.toLowerCase() !== 'false';
    }

    save(): void {

        let invalid = this.nodeItems.find(f =>
            f.data.inputType.name !== "CHECKBOX" &&
            !this.validFeatureValue(f.data.defaultValue, f.data.inputType.validator));

        if (invalid) {
            this.message.error(this.l("Invalid", this.l("FeatureValue")));
            return;
        }

        this.saving = true;

        const _edition = new CreateOrUpdateEditionDto();
        _edition.edition = new EditionEditDto();
        _edition.edition.init(this.edition);
        _edition.featureValues = this.allNodes.map(n => {
            let selected = this.selectedNodes.find(f => f.data.name === n.data.name);
            let feature = NameValueDto.fromJS({
                name: n.data.name,
                value: n.data.inputType.name !== "CHECKBOX" ? n.data.defaultValue : selected ? "true" : "false"
            });
            return feature;
        });

        this._editionService
            .createOrUpdateEdition(_edition)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(true);
            });
    }

    onInputChange(node: TreeNode<FlatFeatureDto>, value: any) {
        if (this.validFeatureValue(value, node.data.inputType.validator)) {
            var find = this.selectedNodes.find(f => f.data.name == node.data.name);
            if (!find) this.selectedNodes.push(node);
        }
        else {
            this.selectedNodes = this.selectedNodes.filter(f => f.data.name != node.data.name);
        }
    }
}
