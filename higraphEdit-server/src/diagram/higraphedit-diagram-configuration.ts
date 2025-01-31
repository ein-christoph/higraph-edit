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
    DefaultTypes,
    DiagramConfiguration,
    EdgeTypeHint,
    getDefaultMapping,
    GModelElement,
    GModelElementConstructor,
    ServerLayoutKind,
    ShapeTypeHint
} from '@eclipse-glsp/server';
import { injectable } from 'inversify';

@injectable()
export class HigraphEditDiagramConfiguration implements DiagramConfiguration {
    layoutKind = ServerLayoutKind.MANUAL;
    needsClientLayout = true;
    animatedUpdate = true;

    constructor(){
        console.log("HigraphEditDiagramConfiguration constructor");
    }

    get typeMapping(): Map<string, GModelElementConstructor<GModelElement>> {
        const mapping = getDefaultMapping();
        return mapping;
    }

    get shapeTypeHints(): ShapeTypeHint[] {
        return [
            {
                elementTypeId: DefaultTypes.NODE,
                deletable: true,
                reparentable: true,
                repositionable: true,
                resizable: true
            },
            {
                elementTypeId: DefaultTypes.COMPARTMENT,
                deletable: true,
                reparentable: true,
                repositionable: true,
                resizable: true
            },{
                elementTypeId: "hyperedge:connector",
                deletable: true,
                reparentable: false,
                repositionable: true,
                resizable: false
            },{
                elementTypeId: 'blob:CartesianProduct',
                deletable: true,
                reparentable: true,
                repositionable: true,
                resizable: true
            },
            {
                elementTypeId: 'blob:notquitesure',
                deletable: true,
                reparentable: true,
                repositionable: true,
                resizable: true
            }

        ];
    }

    get edgeTypeHints(): EdgeTypeHint[] {
        return [
            {
                elementTypeId: DefaultTypes.EDGE,
                deletable: true,
                repositionable: false,
                routable: true,
                sourceElementTypeIds: [DefaultTypes.NODE, 'blob:CartesianProduct'],
                targetElementTypeIds: [DefaultTypes.NODE, 'blob:CartesianProduct']
            },
            {
                elementTypeId: "edge:directed",
                deletable: true,
                repositionable: false,
                routable: true,
                sourceElementTypeIds: [DefaultTypes.NODE, DefaultTypes.PORT,  'blob:CartesianProduct'],
                targetElementTypeIds: [DefaultTypes.NODE,  'blob:CartesianProduct']
            },
            {
                elementTypeId: "edge:hyperedge:toSourceEdge",
                deletable: true,
                repositionable: false,
                routable: true,
                sourceElementTypeIds: [DefaultTypes.NODE, 'blob:CartesianProduct'],
                targetElementTypeIds: ["hyperedge:connector"]
            },
            {
                elementTypeId: "edge:hyperedge:toTargetEdge",
                deletable: true,
                repositionable: false,
                routable: true,
                sourceElementTypeIds: ["hyperedge:connector"],
                targetElementTypeIds: [DefaultTypes.NODE,  'blob:CartesianProduct']
            },
        ];
    }
}
