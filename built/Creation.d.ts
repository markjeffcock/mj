/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export declare class Creation {
    static createKit(context: MRE.Context, name: string, artifactID: string, kitPos: MRE.Vector3, kitScale: MRE.Vector3, kitRotation: MRE.Quaternion, isGrababble?: boolean): MRE.Actor;
    static createAttachedKit(context: MRE.Context, name: string, isGrababble: boolean, artifactID: string, kitPos: MRE.Vector3, kitScale: MRE.Vector3, kitRotation: MRE.Quaternion, userId: MRE.Guid): MRE.Actor;
    static createText(context: MRE.Context, name: string, textPos: MRE.Vector3, content: string): MRE.Actor;
    static UnSyncedText(context: MRE.Context, id: MRE.Guid, name: string, textPos: MRE.Vector3, content: string): MRE.Actor;
}
//# sourceMappingURL=Creation.d.ts.map