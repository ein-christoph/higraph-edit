/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    Command,
    CreateNodeOperation,
    DefaultTypes,
    GCompartment,
    JsonCreateNodeOperationHandler,
    MaybePromise,
    Point
} from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import * as uuid from 'uuid';
import { HigraphEditModelState } from '../../model/higraphedit-model-state';
import { CartesianProductBlob } from './CartesianProduct-model';

@injectable()
export class CreateCartesianProductBlobHandler extends JsonCreateNodeOperationHandler {
    readonly elementTypeIds = ["blob:CartesianProduct"];

    @inject(HigraphEditModelState)
    protected override modelState: HigraphEditModelState

    override createCommand(operation: CreateNodeOperation): MaybePromise<Command | undefined> {
        return this.commandOf(() => {
            const relativeLocation = this.getRelativeLocation(operation) ?? Point.ORIGIN;
            const blob = this.createBlob(relativeLocation);
            const taskList = this.modelState.sourceModel;
            taskList.blobs.push(blob);
        });
    }

    protected createBlob(position: Point): CartesianProductBlob {
        const nodeCounter = this.modelState.index.getAllByClass(GCompartment).length;
        return {
            id: uuid.v4(),
            name: `CartesianProduct${nodeCounter}`,
            position,
            subblobIDs: [],
            type: 'blob:CartesianProduct',
            orthogonalComponents: [
                {
                    id: uuid.v4(),
                    name: `CP${nodeCounter}-left`,
                    position,
                    subblobIDs: [],
                    type: DefaultTypes.NODE
                },
                {
                    id: uuid.v4(),
                    name: `CP${nodeCounter}-right`,
                    position,
                    subblobIDs: [],
                    type: DefaultTypes.NODE
                }
            ]
        };
    }

    get label(): string {
        return 'Cartesian Product Blob';
    }
}
