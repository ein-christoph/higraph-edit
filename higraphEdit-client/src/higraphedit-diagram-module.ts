/********************************************************************************
 * Copyright (c) 2022-2023 EclipseSource and others.
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
    configureDefaultModelElements,
    configureModelElement,
    ConsoleLogger,
    ContainerConfiguration,
    DefaultTypes,
    editFeature,
    editLabelFeature,
    GEdge,
    GEdgeView,
    GLabel,
    GLabelView,
    GNode,
    GPort,
    initializeDiagramContainer,
    LogLevel,
    RectangularNodeView,
    TYPES,
} from '@eclipse-glsp/client';
import 'balloon-css/balloon.min.css';
import { Container, ContainerModule } from 'inversify';
import '../css/diagram.css';
import { CartesianProductView, EdgeView, NotQuiteSureBlobView } from './higraph-views';

const HigraphEditDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    const context = { bind, unbind, isBound, rebind };
    configureDefaultModelElements(context);
    configureModelElement(context, DefaultTypes.LABEL, GLabel, GLabelView, { enable: [editLabelFeature] });

    configureModelElement(context, 'edge:directed', GEdge, EdgeView, { enable: [editFeature] });
    configureModelElement(context, 'blob:CartesianProduct', GNode, CartesianProductView)
    configureModelElement(context, 'blob:notquitesure', GNode, NotQuiteSureBlobView)
    
    //bind hyperedge stuff
    configureModelElement(context, 'edge:hyperedge:toSourceEdge', GEdge, GEdgeView, { enable: [editFeature] }); // undirected
    configureModelElement(context, 'edge:hyperedge:toTargetEdge', GEdge, EdgeView, { enable: [editFeature] }); // directed
    configureModelElement(context, 'hyperedge:connector', GPort, RectangularNodeView);
});

export function initializeHigraphEditDiagramContainer(container: Container, ...containerConfiguration: ContainerConfiguration): Container {
    return initializeDiagramContainer(container, HigraphEditDiagramModule, ...containerConfiguration);
}
