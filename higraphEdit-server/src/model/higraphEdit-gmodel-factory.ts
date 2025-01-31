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
import { GGraph, GModelFactory } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { HigraphEditModelState } from './higraphedit-model-state';
import { HigraphEditModuleRegistry } from '../configuration/higraphedit-moduleregistry';

@injectable()
export class HigraphEditGModelFactory implements GModelFactory {
    
    @inject(HigraphEditModelState)
    protected modelState: HigraphEditModelState;

    protected higraphEditModuleRegistry: HigraphEditModuleRegistry;

    constructor(){
        this.higraphEditModuleRegistry = HigraphEditModuleRegistry.instance;
    }

    createModel(): void {

        const higraph = this.modelState.sourceModel;
        this.modelState.index.indexHigraph(higraph);
        
        //delegate creation process to individual modules
        const graphchildren = this.higraphEditModuleRegistry.createModel(higraph);
        
        const newRoot = GGraph.builder()
            .id(higraph.id)
            .addChildren(graphchildren)
            .build();
        this.modelState.updateRoot(newRoot);
    }
}
