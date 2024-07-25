import { Component, Injector, OnInit } from '@angular/core';
import { DynamicDialogBase } from '@shared/dynamic-dialog-base';
import { RoleServiceProxy, GetRoleForEditOutput, RoleDto, PermissionDto, RoleEditDto } from '@shared/service-proxies/service-proxies';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TreeNode } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AbpValidationSummaryComponent } from '../../../../shared/components/validation/abp-validation.summary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BusyDirective } from '../../../../shared/directives/busy.directive';
import { FormsModule } from '@angular/forms';

@Component({
    templateUrl: 'edit-role-dialog.component.html',
    providers: [RoleServiceProxy],
    standalone: true,
    imports: [FormsModule, BusyDirective, TabViewModule, InputTextModule, AbpValidationSummaryComponent, InputTextareaModule, TreeModule, ButtonDirective, Ripple, LocalizePipe]
})
export class EditRoleDialogComponent extends DynamicDialogBase implements OnInit {
    
    saving = false;
    role = new RoleEditDto();
    selectedNodes: TreeNode<PermissionDto>[] = [];
    nodeItems: TreeNode<PermissionDto>[];   

    constructor(
        injector: Injector,
        private _roleService: RoleServiceProxy,
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
        this._roleService
            .getRoleForEdit(this._dialogConfig.data.id)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result: GetRoleForEditOutput) => {
                this.role = result.role;
                this.mapNode(result.permissions, result.grantedPermissionNames);
            });
    }

    private mapNode(source: PermissionDto[], selected: string[]) {

        let allNodes: TreeNode<PermissionDto>[] = [];
        let nestedNodes: TreeNode<PermissionDto>[] = [];

        source.map(n => {

            let node : TreeNode<PermissionDto> =            
            {
                data: n,
                label: n.displayName,
                expandedIcon: "pi pi-folder-open",
                collapsedIcon: "pi pi-folder",
                children: []
            };

            allNodes.push(node);

            if (n.parent === undefined) {
                node.expanded = true;
                nestedNodes.push(node);
            }
            else {
                var parent = allNodes.find(s => s.data.name == n.parent.name);
                if (parent) parent.children.push(node);
            }            
        });

        this.nodeItems = nestedNodes;
        this.selectedNodes = allNodes.filter(f => selected.find(s => s === f.data.name) !== undefined);
    }

    save(): void {
        this.saving = true;

        const role = new RoleDto();
        role.init(this.role);
        role.grantedPermissions = this.selectedNodes.map(f => f.data.name);

        this._roleService.update(role)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result) => {
                this.notify.success(this.l('SavedSuccessfully'));
                this._dialogRef.close(result)
            });
    }    

}
