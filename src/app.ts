/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as MRE from '@microsoft/mixed-reality-extension-sdk';

/**
 * sleep() function
 * Returns a Promise that resolves after 'ms' milliseconfs, To casue your code to paues for that
 * time, use 'Await(ms)' in an async function
 */
 //function sleep(ms: number) {
 //	return new Promise((resolve) => {
 //		setTimeout(resolve, ms);
 //	 });
 //}
 /**//
 * The main class of this app. All the logic goes here.
 */
export default class HelloWorld {
	//private kitItem: MRE.Actor = null;
	private assets: MRE.AssetContainer;

	//====================
	// Track which attachments belongs to which user
	// NOTE: The MRE.Guid will be the ID of the user.  Maps are more efficient with Guids for keys
	// than they would be with MRE.Users.
	//
	// Things to do:
	// a) Hardening initial call
	// b) Creating sync call
	// c) Document
	// d) Parameterise wrist on/off
	// e) solve timeout blocking
	// f) instantiation of sound for wrist
	// g) Write many bumfs audio
	// h) Adopt Dargon Quaternion solution
	//====================
	private attachments = new Map<MRE.Guid, MRE.Actor>();

	//====================
	// AudioButton object
	//====================
	private audioButton: MRE.Actor;

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
		console.log(`value ${this.params.art}`);

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
		// Test Button
		//
		// new Set this item as a button

		this.audioButton.created().then(() =>
			this.audioButton.setBehavior(MRE.ButtonBehavior).onClick((user) => {
				console.log(`clicked`);
				//uses the parameter ?art=nnn where nnn is an audio artifact in an Altspace kit
				this.createKit("AudioName", `artifact:${this.params.art}`,
					audioPos, audioScale, audioRotation)
			})
		);		
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

			//====================
			// Set the wrist attachment as a Button
			//====================

			const attachButtonBehavior = attachment.setBehavior(MRE.ButtonBehavior);

			const attachPos: MRE.Vector3 = new MRE.Vector3(0, 0, 0);
			const attachScale: MRE.Vector3 = new MRE.Vector3(1, 1, 1);
			const attachRotation: MRE.Quaternion =
				MRE.Quaternion.RotationAxis(MRE.Vector3.Up(), -180.0 * MRE.DegreesToRadians);

			attachButtonBehavior.onClick(_ => {
				console.log(`clicked`);
				//uses the parameter ?art=nnn where nnn is an audio artifact in an Altspace kit
				this.createKit("AudioWrist", `artifact:${this.params.art}`,
					attachPos, attachScale, attachRotation)
			});
		}
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
	private createKit(name: string, artifactID: string, kitPos: MRE.Vector3,
		kitScale: MRE.Vector3, kitRotation: MRE.Quaternion) {
		//kitScale: MRE.Vector3, kitRotation: MRE.Quaternion): MRE.Actor {
		console.log(`${artifactID} passed`);
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
		// sleep for 5 seconds to reduce double-click issues
		//await sleep(5000);
		});

	}

}
