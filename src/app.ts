/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
//==========================
// import the sync-fix module.
//==========================
import { UserSyncFix } from './sync-fix'

/**
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
	//private kitItem: MRE.Actor = null;
	private assets: MRE.AssetContainer;

	//==========================
	// Declare a syncfix attribute to handle the synchronization fixes.
	// In this case, syncfix will call the synchronization functions
	// no more than once every 5000 ms (5 sec).
	//==========================
	private syncfix = new UserSyncFix(5000);

	//====================
	// Track which attachments belongs to which user
	// NOTE: The MRE.Guid will be the ID of the user.  Maps are more efficient with Guids for keys
	// than they would be with MRE.Users.
	//
	// Things to do:
	// 
	// b) Creating sync call
	// 
	// 
	// e) off button for wrist button (delay)
	// f) document how to use in Galleries
	// g) Write many bumfs audio
	// h) Adopt Dargon Quaternion solution
	//====================
	private attachments = new Map<MRE.Guid, MRE.Actor>();
	private buttonAlreadyClicked = false;
	private wristAlreadyclicked = false;

	//====================
	// AudioButton objects
	//====================
	private audioButton: MRE.Actor;
	private audioMain: MRE.Actor;

	// MJ revised constructor to include parameters
	constructor(private context: MRE.Context, private params: MRE.ParameterSet) {
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
	private started() {
		// set up somewhere to store loaded assets (meshes, textures,
		// animations, gltfs, etc.)
		this.assets = new MRE.AssetContainer(this.context);

		//Check that debug logic works here
		console.log(`started`);
		console.log(`value ${this.params.item}`);

		// spawn a copy of a kit item
		this.audioButton = MRE.Actor.CreateFromLibrary(this.context, {
			// the number below is the item's artifact id. Button
			resourceId: 'artifact:1695152330615292136'
		});

		// new Set this item as a button

		const audioPos: MRE.Vector3 = new MRE.Vector3(0, 0, 0);
		const audioScale: MRE.Vector3 = new MRE.Vector3(1, 1, 1);
		const audioRotation: MRE.Quaternion =
			MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), -180.0 * MRE.DegreesToRadians);

		this.audioButton.created().then(() =>
			this.audioButton.setBehavior(MRE.ButtonBehavior).onClick((user) => {
				console.log(`clicked`);
				//uses the parameter ?art=nnn where nnn is an audio item in an Altspace kit
				this.audioMain = this.createKit("AudioName", user, `artifact:${this.params.item}`,
					audioPos, audioScale, audioRotation)
			}));

		//==========================
		// Set up the synchronization function
		//==========================
		this.syncfix.addSyncFunc(() => this.synchronizeAttachments());
	}

	/**
	 * When a user joins, attach a wrist button to them.
	 */
	private userJoined(user: MRE.User) {
		// print the user's name to the console
		console.log(`${user.name} joined`);
		console.log(`${this.params.wrist} wristvalue`);

		// attach an item to the user - a button
		//====================
		// Assign the return value of CreateFromLibrary() to a variable.
		//====================
		//
		// Attach Button for User onto their wrist (if wrist parameter='Y')
		//
		if (this.params.wrist === "Y") {
		//	private wristButton: MRE.Actor;
			const wristScale: MRE.Vector3 = new MRE.Vector3(0.4, 0.4, 0.4);
			const wristPos: MRE.Vector3 = new MRE.Vector3(0, 0.02, -0.05);
			const wristRotation: MRE.Quaternion =
				MRE.Quaternion.RotationAxis(new MRE.Vector3(0, -1, 1), -180.0 * MRE.DegreesToRadians);

			const attachment = MRE.Actor.CreateFromLibrary(
				this.context,
				{
					resourceId: 'artifact:1695152330615292136',
					actor: {
						attachment: {
							attachPoint: 'left-hand',
							userId: user.id
						},
						transform: {
							local: {
								position: wristPos,
								rotation: wristRotation,
								scale: wristScale
							}
						}
					}
				}
			);

			//====================
			// Associate the attachment with the user in the 'attachments' map.
			//====================
			this.attachments.set(user.id, attachment);

			//=====================
			// Set the wrist attachment as a Button
			//=====================

			const attachPos: MRE.Vector3 = new MRE.Vector3(0, 0, 0);
			//const attachPos: MRE.Vector3 = attachment.transform.local.position;
			console.log(`${attachment.transform.local.position} wristposition`);
			const attachScale: MRE.Vector3 = new MRE.Vector3(1, 1, 1);
			const attachRotation: MRE.Quaternion =
				MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), -180.0 * MRE.DegreesToRadians);

			// Set this item as a button
			attachment.created().then(() =>
				attachment.setBehavior(MRE.ButtonBehavior).onClick((user) => {
					console.log(`clicked`);
					//uses the parameter ?art=nnn where nnn is an audio artifact in an Altspace kit
					this.createKit("AudioWrist", user, `artifact:${this.params.item}`,
						attachPos, attachScale, attachRotation)
				}));
		}

		//==========================
		// Let 'syncfix' know a user has joined.
		//==========================
		this.syncfix.userJoined();
	}

	//====================
	// When a user leaves, remove the attachment (if any) and destroy it
	//====================
	private userLeft(user: MRE.User) {
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
	 * Create kit function called to instantiate the audio upon a button input
	 */
	private createKit(name: string, user: MRE.User, artifactID: string, kitPos: MRE.Vector3,
		kitScale: MRE.Vector3, kitRotation: MRE.Quaternion): MRE.Actor {
		console.log(`${artifactID} passed`);
		console.log(`${kitPos} position passed`);
		// If already clicked destory instantiated audio
		if (this.buttonAlreadyClicked) {
			this.audioMain.destroy();
			this.buttonAlreadyClicked = false;
		}	else {
			// if selected from wrist, audio exclusive to the user.
			if (name === "AudioWrist") {
				return MRE.Actor.CreateFromLibrary(this.context, {
					resourceId: artifactID,
					actor: {
						name: name,
						exclusiveToUser: user.id,
						parentId: user.id,
						transform: {
							local: {
								position: kitPos,
								rotation: kitRotation,
								scale: kitScale
							}
						}
					}
				});
			} else	{
				this.buttonAlreadyClicked= true;
				return MRE.Actor.CreateFromLibrary(this.context, {
					resourceId: artifactID,
					actor: {
						name: name,
						parentId: user.id,
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
	}

	//==========================
	// Synchronization function for attachments
	// Need to detach and reattach every attachment
	//==========================
	private synchronizeAttachments() {
		// Loop through all values in the 'attachments' map
		// The [key, value] syntax breaks each entry of the map into its key and
		// value automatically.  In the case of 'attachments', the key is the
		// Guid of the user and the value is the actor/attachment.
		for (const [userId, attachment] of this.attachments) {
			// Store the current attachpoint.
			const attachPoint = attachment.attachment.attachPoint;

			// Detach from the user
			attachment.detach();

			// Reattach to the user
			attachment.attach(userId, attachPoint);

			// Reset the main item as a button (seemed to only work 50% of time)
			const audioPos: MRE.Vector3 = new MRE.Vector3(0, 0, 0);
			const audioScale: MRE.Vector3 = new MRE.Vector3(1, 1, 1);
			const audioRotation: MRE.Quaternion =
				MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), -180.0 * MRE.DegreesToRadians);
			this.audioButton.created().then(() =>
				this.audioButton.setBehavior(MRE.ButtonBehavior).onClick((user) => {
					//uses the parameter ?art=nnn where nnn is an audio item in an Altspace kit
					this.audioMain = this.createKit("AudioName", user, `artifact:${this.params.item}`,
						audioPos, audioScale, audioRotation)
				}));

		}
	}

}
