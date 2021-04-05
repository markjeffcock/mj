/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class Bumf {
    private context;
    private params;
    private assets;
    private syncfix;
    private attachments;
    private buttonAlreadyClicked;
    private wristAlreadyclicked;
    private audioButton;
    private audioMain;
    private audioWrist;
    constructor(context: MRE.Context, params: MRE.ParameterSet);
    /**
     * Once the context is "started", initialize the app.
     */
    private started;
    /**
     * When a user joins, attach a wrist button to them.
     */
    private userJoined;
    private userLeft;
    /**
     * Create kit function called to instantiate the audio upon a button input
     */
    private createKit;
    private synchronizeAttachments;
}
//# sourceMappingURL=app.d.ts.map