/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
//export all info to databse file then put databse items in array
//and reference array points easy to push aand pop new qs

import * as MRE from '@microsoft/mixed-reality-extension-sdk';


/**
 * The main class of this app. All the logic goes here.
 */
export class Creation {

	//returns an MRE actor given the arguments below 
	public static createKit(context: MRE.Context, name: string, artifactID: string, kitPos: MRE.Vector3,
		kitScale: MRE.Vector3, kitRotation: MRE.Quaternion, isGrababble?: boolean): MRE.Actor {
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

	public static createAttachedKit(context: MRE.Context, name: string, isGrababble: boolean,
		artifactID: string, kitPos: MRE.Vector3,
		kitScale: MRE.Vector3, kitRotation: MRE.Quaternion, userId: MRE.Guid): MRE.Actor {
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
	public static createText(context: MRE.Context, name: string, textPos: MRE.Vector3, content: string): MRE.Actor {
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
	public static UnSyncedText(context: MRE.Context, id: MRE.Guid, name: string, 
		textPos: MRE.Vector3, content: string): MRE.Actor {
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

	// private parseVectors(vector: string): MRE.Vector3 {
	// 	let realVec = vector.split(",");
	// 	return new MRE.Vector3(Number(realVec[0]), Number(realVec[1]), Number(realVec[2]));
	// }
	// const data = new Uint8Array(Buffer.from(user.id.toString()));
	// 	fs.writeFile('message.txt', data, (err) => {
	// 	if (err) throw err; });
}

