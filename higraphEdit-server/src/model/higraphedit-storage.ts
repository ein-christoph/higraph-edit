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

import { AbstractJsonModelStorage, MaybePromise, RequestModelAction, SaveModelAction } from '@eclipse-glsp/server/node';
import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { HigraphEditModelState } from './higraphedit-model-state';
import { Higraph } from './higraph-model';

@injectable()
export class HigraphEditStorage extends AbstractJsonModelStorage {
    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState;

    loadSourceModel(action: RequestModelAction): MaybePromise<void> {
        const sourceUri = this.getSourceUri(action);
        const higraph = this.loadFromFile(sourceUri, Higraph.is);

        this.modelState.updateSourceModel(higraph);
    }

    saveSourceModel(action: SaveModelAction): MaybePromise<void> {
        const sourceUri = this.getFileUri(action);
        this.writeFile(sourceUri, this.modelState.sourceModel);
    }

    protected override createModelForEmptyFile(path: string): Higraph {
        return {
            id: uuid.v4(),
            edges: [],
            blobs: []
        };
    }
}
