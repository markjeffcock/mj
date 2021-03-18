/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
    private context;
    private kitItem;
    private assets;
    private attachments;
    constructor(context: MRE.Context);
    /**
     * Once the context is "started", initialize the app.
     */
    private started;
    /**
     * When a user joins, attach something to them.
     */
    private userJoined;
    private userLeft;
    /**
     * Create kit function called to instantiate upon a button input
     */
    private createKit;
}
//# sourceMappingURL=app.d.ts.map