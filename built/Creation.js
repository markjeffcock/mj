"use strict";
/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
//export all info to databse file then put databse items in array
//and reference array points easy to push aand pop new qs
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
class Creation {
    //returns an MRE actor given the arguments below 
    static createKit(context, name, artifactID, kitPos, kitScale, kitRotation, isGrababble) {
        return MRE.Actor.CreateFromLibrary(context, {
            resourceId: "artifact:" + artifactID,
            actor: {
                name: name,
                grabbable: isGrababble,
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
    static createAttachedKit(context, name, isGrababble, artifactID, kitPos, kitScale, kitRotation, userId) {
        return MRE.Actor.CreateFromLibrary(context, {
            resourceId: "artifact:" + artifactID,
            actor: {
                name: name,
                grabbable: isGrababble,
                transform: {
                    local: {
                        position: kitPos,
                        rotation: kitRotation,
                        scale: kitScale
                    }
                },
                attachment: {
                    attachPoint: 'head',
                    userId
                }
            }
        });
    }
    //returns an MRE actor for text 
    static createText(context, name, textPos, content) {
        return MRE.Actor.Create(context, {
            actor: {
                name: name,
                transform: {
                    app: {
                        position: textPos,
                        rotation: MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), -180.0 * MRE.DegreesToRadians)
                    }
                },
                text: {
                    contents: content,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.3
                }
            }
        });
    }
    static UnSyncedText(context, id, name, textPos, content) {
        return MRE.Actor.Create(context, {
            actor: {
                name: name,
                exclusiveToUser: id,
                transform: {
                    app: {
                        position: textPos,
                        rotation: MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), -180.0 * MRE.DegreesToRadians)
                    }
                },
                text: {
                    contents: content,
                    anchor: MRE.TextAnchorLocation.MiddleCenter,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.3
                }
            }
        });
    }
}
exports.Creation = Creation;
//# sourceMappingURL=Creation.js.map