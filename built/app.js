"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
/**
 * The main class of this app. All the logic goes here.
 */
class HelloWorld {
    constructor(context) {
        this.context = context;
        this.kitItem = null;
        //====================
        // Track which attachments belongs to which user
        // NOTE: The MRE.Guid will be the ID of the user.  Maps are more efficient with Guids for keys
        // than they would be with MRE.Users.
        //====================
        this.attachments = new Map();
        this.context.onStarted(() => this.started());
        this.context.onUserJoined((user) => this.userJoined(user));
        //====================
        // Set up a userLeft() callback
        //====================
        this.context.onUserLeft((user) => this.userLeft(user));
    }
    /**
     * Once the context is "started", initialize the app.
     */
    started() {
        // set up somewhere to store loaded assets (meshes, textures,
        // animations, gltfs, etc.)
        this.assets = new MRE.AssetContainer(this.context);
        // spawn a copy of a kit item
        this.kitItem = MRE.Actor.CreateFromLibrary(this.context, {
            // the number below is the item's artifact id. Button
            resourceId: 'artifact:1695152330615292136'
        });
        // Set this item as a Button
        const audioButtonBehavior = this.kitItem.setBehavior(MRE.ButtonBehavior);
        const audioPos = new MRE.Vector3(0, 0, 0);
        const audioScale = new MRE.Vector3(1, 1, 1);
        const audioRotation = MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), -180.0 * MRE.DegreesToRadians);
        // Test Button
        audioButtonBehavior.onClick(_ => {
            console.log(`clicked`);
            // this was the boar
            //this.createKit("AudioName", "artifact:1545602115391455543",
            this.createKit("AudioName", "artifact:1695910552020190071", audioPos, audioScale, audioRotation);
        });
    }
    /**
     * When a user joins, attach something to them.
     */
    userJoined(user) {
        // print the user's name to the console
        console.log(`${user.name} joined`);
        // attach an item to the user - a button
        //====================
        // Assign the return value of CreateFromLibrary() to a variable.
        //====================
        const attachment = MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: 'artifact:1695152330615292136',
            actor: {
                attachment: {
                    attachPoint: 'left-hand',
                    userId: user.id
                }
            }
        });
        //====================
        // Associate the attachment with the user in the 'attachments' map.
        //====================
        this.attachments.set(user.id, attachment);
    }
    //====================
    // When a user leaves, remove the attachment (if any) and destroy it
    //====================
    userLeft(user) {
        // See if the user has any attachments.
        if (this.attachments.has(user.id)) {
            const attachment = this.attachments.get(user.id);
            // Detach the Actor from the user
            attachment.detach();
            // Destroy the Actor.
            attachment.destroy();
            // Remove the attachment from the 'attachments' map.
            this.attachments.delete(user.id);
        }
    }
    /**
     * Create kit function called to instantiate upon a button input
     */
    createKit(name, artifactID, kitPos, kitScale, kitRotation) {
        return MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: artifactID,
            actor: {
                name: name,
                transform: {
                    local: {
                        position: kitPos,
                        rotation: kitRotation,
                        scale: kitScale
                    }
                }
            }
        });
    }
}
exports.default = HelloWorld;
//# sourceMappingURL=app.js.map