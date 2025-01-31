/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
import {
    ActionHandlerConstructor,
    BindingTarget,
    ComputedBoundsActionHandler,
    DiagramConfiguration,
    DiagramModule,
    GModelFactory,
    GModelIndex,
    InstanceMultiBinding,
    LabelEditValidator,
    ModelState,
    ModelValidator,
    OperationHandlerConstructor,
    SourceModelStorage
} from '@eclipse-glsp/server';
import {  injectable, interfaces } from 'inversify';
import { DeleteElementHandler } from '../generic-handler/delete-element-handler';
import { HigraphEditApplyLabelEditHandler } from '../generic-handler/higraph-apply-label-edit-handler';
import { GenericChangeBoundsHandler } from '../generic-handler/generic-change-bounds-handler';
import { HigraphEditLabelEditValidator } from '../generic-handler/higraph-label-edit-validator';
import { HigraphEditGModelFactory } from '../model/higraphEdit-gmodel-factory';
import { HigraphEditModelIndex } from '../model/higraphedit-model-index';
import { HigraphEditModelState } from '../model/higraphedit-model-state';
import { HigraphEditStorage } from '../model/higraphedit-storage';
import { HigraphEditDiagramConfiguration } from './higraphedit-diagram-configuration';
import { DiagramValidator } from './DiagramValidator';
import { SelectBlobHandler } from '../generic-handler/select-blob-handler';
import { ChangeRoutingPointsHandler } from '../higraph-modules/edge-module/handler-change-routing-points';
import { HigraphEditModuleRegistry } from '../configuration/higraphedit-moduleregistry';

@injectable()
export class HigraphEditDiagramModule extends DiagramModule {

    readonly diagramType = 'higraph-diagram';
    private readonly higraphEditModuleRegistry = HigraphEditModuleRegistry.instance;

    protected override configure(bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind): void {
        super.configure(bind, unbind, isBound, rebind);
    }

    protected bindDiagramConfiguration(): BindingTarget<DiagramConfiguration> {
        return HigraphEditDiagramConfiguration;
    }

    protected bindSourceModelStorage(): BindingTarget<SourceModelStorage> {
        return HigraphEditStorage;
    }

    protected bindModelState(): BindingTarget<ModelState> {
        return { service: HigraphEditModelState };
    }

    protected bindGModelFactory(): BindingTarget<GModelFactory> {
        return HigraphEditGModelFactory;
    }

    protected override configureActionHandlers(binding: InstanceMultiBinding<ActionHandlerConstructor>): void {
        super.configureActionHandlers(binding);
        binding.add(ComputedBoundsActionHandler);
    }

    protected override configureOperationHandlers(binding: InstanceMultiBinding<OperationHandlerConstructor>): void {
        super.configureOperationHandlers(binding);

        this.higraphEditModuleRegistry.reload();
        this.higraphEditModuleRegistry.configureOperationHandlers(binding);

        /*
        binding.add(CreateBlobHandler);
        binding.add(CreateHyperEdgeHandler);
        binding.add(CreateBinaryEdgeHandler);
        binding.add(ChangeRoutingPointsHandler);
        binding.add(CreateDirectedBinaryEdgeHandler);
        binding.add(CreateCartesianProductBlobHandler);
        */

        binding.add(GenericChangeBoundsHandler);
        binding.add(ChangeRoutingPointsHandler);
        binding.add(HigraphEditApplyLabelEditHandler);
        binding.add(DeleteElementHandler);
        binding.add(SelectBlobHandler);
    }

    public changeConfiguration(){
        console.log("changeCOnfigurationInvoked");
    }

    protected override bindGModelIndex(): BindingTarget<GModelIndex> {
        this.context.bind(HigraphEditModelIndex).toSelf().inSingletonScope();
        return { service: HigraphEditModelIndex };
    }

    protected override bindLabelEditValidator(): BindingTarget<LabelEditValidator> | undefined {
        return HigraphEditLabelEditValidator;
    }

    protected override bindModelValidator(): BindingTarget<ModelValidator> | undefined {
        return DiagramValidator;
    }
}
