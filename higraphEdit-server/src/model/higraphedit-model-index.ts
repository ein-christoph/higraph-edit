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
import { GModelIndex } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import { Higraph, HigraphBlob, HigraphEdge, THigraphModelElement } from './higraph-model';

@injectable()
export class HigraphEditModelIndex extends GModelIndex {
    protected idToHigraphEditElements = new Map<string, THigraphModelElement>();

    indexHigraph(higraph: Higraph): void {
        this.idToHigraphEditElements.clear();
        for (const element of [...higraph.blobs, ...higraph.edges]) {
            this.idToHigraphEditElements.set(element.id, element);
        }
    }

    findBlob(id:string):HigraphBlob | undefined{
        const blob = this.findElement(id);
        return HigraphBlob.is(blob) ? blob : undefined;
    }

    findEdge(id:string):HigraphEdge | undefined{
        const edge = this.findElement(id);
        return HigraphEdge.is(edge) ? edge : undefined;
    }

    findElement(id: string): THigraphModelElement | undefined {
        return this.idToHigraphEditElements.get(id);
    }
}
