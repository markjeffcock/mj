/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
//export all info to databse file then put databse items in array
//and reference array points easy to push aand pop new qs

import * as MRE from '@microsoft/mixed-reality-extension-sdk';
// import { debug } from 'console';

// import { Text } from '@microsoft/mixed-reality-extension-sdk';
// import * as fs from 'fs';
// import { userInfo } from 'os';
import { Creation } from './Creation';

interface Actor {
	name: string;
	ID: string;
	pos: MRE.Vector3;
	scale: MRE.Vector3;
	rot: MRE.Quaternion;
	qText: string;
	choicePos: MRE.Vector3;
	choices: string[];
	isText: boolean;
	answerIndex: number;
}

interface ActorDatabase {
	[key: string]: Actor;
}

const QDatabase: ActorDatabase = require('../public/QuestionDatabase.json');
const AnswerDatabase: ActorDatabase = require('../public/AnswerDatabase.json');
const ButtonDatabase: ActorDatabase = require('../public/NavButtonDatabase.json');
const ChoiceDatabase: ActorDatabase = require('../public/ChoiceButtonDatabase.json');

/**
 * The main class of this app. All the logic goes here.
 */
export default class VRQuiz {

	anwserBackground: MRE.Actor; start: MRE.Actor;

	private VotesPos: MRE.Vector3 = new MRE.Vector3(-6.5, 2.9, -0.1);


	votes: MRE.Actor; votesCount: number = 0;

	anwserBackdrop: MRE.Actor; hider: MRE.Actor;


	private adminID: any = MRE.parseGuid("ce19cb48-59b6-6d0b-c61b-ca4c9fa5b380");//mine 
	private adminID2: any = MRE.parseGuid("aa5f6b13-6e26-58e9-804b-a89c6ca6a2b7");//second account

	// private adminID2: any = MRE.parseGuid("34649be4-bda2-b176-58bb-4a676c14d577");// mohamad 
	private adminIDs: MRE.Guid[] = [MRE.ZeroGuid];


	private stopVotes = false;
	questionNumber = 0;
	currentQuestion = this.start;
	currentChoices = [this.start];
	private usersVoted: MRE.Guid[] = [MRE.ZeroGuid];
	QuestionList = [QDatabase[0]];
	AnswerList = [AnswerDatabase[0]];
	ButtonList = [ButtonDatabase[0]];
	ChoiceList = [ChoiceDatabase[0]];
	CountList = [this.start];
	ChCubeList = [this.start];
	letterList = [this.start];

	tempCheck = 0;

	map = new Map();
	// add a item

	constructor(private context: MRE.Context, private baseUrl: string) {
		this.context.onStarted(() => this.started());
		this.context.onUserJoined(user => this.onUserJoined(user).catch(err => MRE.log.error('app', err)));
		this.context.onUserLeft(user => this.onUserLeft(user));

		// this.context.onUserLeft(user => this.onUserLeft(user));
	}

	private onUserLeft(user: MRE.User) {
		const anchor = this.map.get(user.id);
		if (anchor) {
			anchor.anchor.destroy();
			this.map.delete(user.id);
		}
	}


	private async onUserJoined(user: MRE.User) {
		let Ctexts = ['A', "B", "C", "D"];
		let chTexts = [this.start];
		chTexts.pop();
		for (let i = 0; i < 4; i++) {
			let choicePos = new MRE.Vector3(-4, 1.5 - i, -0.08);
			chTexts.push(Creation.UnSyncedText(this.context, user.id, "choice", choicePos, Ctexts[i]));
		}
		this.map.set(user.id, chTexts);
	}
	/**
	 * Once the context is "started", initialize the app.
	 */
	private populateLists() {
		let databases = [QDatabase, AnswerDatabase, ButtonDatabase, ChoiceDatabase];
		let lists = [this.QuestionList, this.AnswerList, this.ButtonList, this.ChoiceList];
		let i = 0;
		for (i = 0; i < databases.length; i++) {
			const keys = Object.keys(databases[i]);
			lists[i].pop();
			for (const bodyName of keys) {
				lists[i].push(databases[i][bodyName]);
			}
		}

	}
	private started() {
		this.populateLists();
		this.start = Creation.createKit(this.context, this.ButtonList[0].name, this.ButtonList[0].ID,
			this.ButtonList[0].pos, this.ButtonList[0].scale, this.ButtonList[0].rot);
		//make start a button
		const startButtonBehavior = this.start.setBehavior(MRE.ButtonBehavior);
		// When clicked trigger quiz interface and put up first question 
		startButtonBehavior.onClick(user => {
			this.adminID = user.id;
			if (this.checkModerator(user)) {
				this.start.destroy();
				this.beginQuiz();
			}
		});
	}

	private beginQuiz() {
		// this.hider = Creation.createKit(this.context, this.ButtonList[0].name, this.ButtonList[0].ID,
		// 	new MRE.Vector3(11111, -6, 17), this.ButtonList[0].scale, this.ButtonList[0].rot);
		let setNavButtons = [this.start];
		setNavButtons.pop();
		this.CountList.pop();
		this.ChCubeList.pop();
		// let choicePos = new MRE.Vector3(-4, 1.5 - i, -0.08);
		this.anwserBackdrop = Creation.createKit(this.context, "jackey", "1582179819121017152",
			new MRE.Vector3(-3.25, -1.5, 0.3), new MRE.Vector3(-0.001, -0.001, -0.001), this.ChoiceList[0].rot);

		for (let i = 0; i < 4; i++) {
			setNavButtons.push(Creation.createKit(this.context, this.ButtonList[i + 1].name, this.ButtonList[i + 1].ID,
				this.ButtonList[i + 1].pos, this.ButtonList[i + 1].scale, this.ButtonList[i + 1].rot));
			let countPos = new MRE.Vector3(-3.25, -1.5 + i, -0.1);
			this.CountList.push(Creation.createText(this.context, "choice", countPos, ""));
			let cubePos = new MRE.Vector3(-4, -1.5 + i, -0.1);
			this.ChCubeList.push(Creation.createKit(this.context, this.ChoiceList[0].name,
				this.ChoiceList[0].ID, cubePos, this.ChoiceList[0].scale, this.ChoiceList[0].rot));
		}
		this.anwserBackground = setNavButtons[3];
		//display first question animation by default 

		this.currentQuestion = this.createQuestion(0);
		this.currentChoices = this.activateChoices(this.questionNumber);
		this.votes = Creation.createText(this.context, 'votesCount', this.VotesPos, "");
		this.votes.text.height = 2;

		let choice1ButtonBehavior = {
			behavior: this.ChCubeList[0].setBehavior(MRE.ButtonBehavior),
			count: 0, txt: this.CountList[0]
		};
		let buttonList: Array<{ behavior: MRE.ButtonBehavior, count: number, txt: MRE.Actor }>;
		buttonList = [choice1ButtonBehavior];
		for (let i = 1; i < 4; i++) {
			let choiceButtonBehavior = {
				behavior: this.ChCubeList[i].setBehavior(MRE.ButtonBehavior),
				count: 0,
				txt: this.CountList[i]
			};
			buttonList.push(choiceButtonBehavior);
		}
		for (let i = 0; i < buttonList.length; i++) {
			let beh = buttonList[i];
			beh.behavior.onClick(user => {
				if (this.checkModerator(user) && !this.stopVotes) {
					this.showChoiceDistribution(buttonList);
					beh.txt.text.color = MRE.Color3.Green();
					this.stopVotes = true;
					this.usersVoted.push(user.id);
				}
				else if (!this.usersVoted.includes(user.id)) {
					this.usersVoted.push(user.id);
					this.map.get(user.id)[3 - i].text.color = MRE.Color3.Yellow();
					beh.count++;
					this.votesCount++;
					this.votes.text.contents = this.votesCount.toString();
				}
			});
		}

		this.votes.text.contents = this.votesCount.toString();

		//make next, previous, and Anwser icon into button 
		const nextButtonBehavior = setNavButtons[0].setBehavior(MRE.ButtonBehavior);
		const previousButtonBehavior = setNavButtons[1].setBehavior(MRE.ButtonBehavior);
		const showAnwserButtonBehavior = setNavButtons[2].setBehavior(MRE.ButtonBehavior);

		//if next is pressed subtract 1 to question number, set isAnwser to false, and update animation,
		//and reset the choices count
		nextButtonBehavior.onClick(user => {
			if (this.questionNumber < this.QuestionList.length - 1 && this.checkModerator(user)) {
				this.resetChoices(buttonList);
				this.stopVotes = false;
				this.questionNumber++;
				this.anwserBackdrop.transform.local.scale = new MRE.Vector3(0.001, 0.001, 0.001);
				this.currentQuestion = this.activateQuestion(this.questionNumber);
			}
		});
		//if previous is pressed, subtract 1 to question number, set isAnwser to false, and update animation. 
		previousButtonBehavior.onClick(user => {
			if (this.questionNumber > 0 && this.checkModerator(user)) {
				this.resetChoices(buttonList);
				this.stopVotes = false;
				this.questionNumber--;
				this.anwserBackdrop.transform.local.scale = new MRE.Vector3(0.001, 0.001, 0.001);
				this.currentQuestion = this.activateQuestion(this.questionNumber);
			}
		});
		//if anwserOff is pressed destroy it and enable anwserOn icon and update the animation 
		showAnwserButtonBehavior.onClick(user => {
			if (this.checkModerator(user)) {
				// .color = MRE.Color4.FromColor3(MRE.Color3.Black());
				// console.log(this.QuestionList[this.questionNumber].answerIndex);
				if (this.QuestionList[this.questionNumber].answerIndex < 10000) {
					this.anwserBackdrop.transform.local.scale = new MRE.Vector3(-20, -20, -0.001);
					this.activateAnswer(this.questionNumber);
				}


				// console.log(this.QuestionList[this.questionNumber].answerIndex);
			}
		});

	}

	// private checkUserChoice


	private activateQuestion(QNumber: number): MRE.Actor {
		this.currentQuestion.destroy();
		this.anwserBackground.destroy();
		this.destroyChoices(this.currentChoices);
		this.currentChoices = this.activateChoices(QNumber);
		this.anwserBackground = Creation.createKit(this.context, this.ButtonList[4].name,
			this.ButtonList[4].ID, this.ButtonList[4].pos, this.ButtonList[4].scale, this.ButtonList[4].rot)
		return this.createQuestion(this.questionNumber);
	}

	private activateAnswer(QNumber: number) {
		this.currentQuestion.destroy();
		this.anwserBackground.destroy();
		this.anwserBackground = Creation.createKit(this.context, this.ButtonList[5].name,
			this.ButtonList[5].ID, this.ButtonList[5].pos, this.ButtonList[5].scale, this.ButtonList[5].rot)
		let answerIndex = this.QuestionList[QNumber].answerIndex;
		this.currentQuestion = Creation.createKit(this.context, this.AnswerList[answerIndex].name,
			this.AnswerList[answerIndex].ID, this.AnswerList[answerIndex].pos, this.AnswerList[answerIndex].scale,
			this.AnswerList[answerIndex].rot);
	}

	// private hideAnswerChoices() {
	// 	this.map.forEach((values, keys) => {
	// 		let choiceList = this.map.get(keys);
	// 		// console.log(choiceList[0].trasform);
	// 		for (let i = 0; i < choiceList.length; i++) {
	// 			choiceList[i].transform = this.hider.transform;
	// 		}
	// 	})
	// }

	private refreshChoiceCounts(choices: string[]) {
		for (let i = 0; i < this.CountList.length; i++) {
			this.CountList[i].text.contents = choices[i];
		}

	}
	private async selectedColor(choice: MRE.Actor) {
		choice.text.color = MRE.Color3.Green()
	}

	private showChoiceDistribution(buttonList: Array<{ behavior: MRE.ButtonBehavior, count: number, txt: MRE.Actor }>) {
		let totalCount = buttonList[0].count + buttonList[1].count + buttonList[2].count + buttonList[3].count;
		if (totalCount === 0) totalCount = 1;
		let percentages = ["h"];
		percentages.pop();
		for (let i = 0; i < buttonList.length; i++) {
			let perc = ((buttonList[i].count * 100) / totalCount).toFixed(1).toString() + "%";
			percentages.push(perc);
		}
		this.votes.text.height = 0.01;
		this.refreshChoiceCounts(percentages);

	}
	private resetChoices(buttonList: Array<{ behavior: MRE.ButtonBehavior, count: number, txt: MRE.Actor }>) {
		this.resetUserChoices();
		for (let i = 0; i < buttonList.length; i++) {
			buttonList[i].count = 0;
			buttonList[i].txt.text.color = MRE.Color3.LightGray();
			// this.letterList[i].text.color = MRE.Color3.Teal();
		}

		this.votesCount = 0;
		this.votes.text.contents = this.votesCount.toString();
		this.votes.text.height = 2;
		this.refreshChoiceCounts(["", "", "", ""]);
		this.usersVoted = [MRE.ZeroGuid];

	}
	private resetUserChoices() {
		const iterator1 = this.map.values();
		let val = iterator1.next();
		while (!val.done) {
			for (let i = 0; i < 4; i++) {
				(val.value)[i].text.color = MRE.Color3.Teal();
			}
			val = iterator1.next();
		}
	}

	private activateChoices(questionNumber: number): MRE.Actor[] {
		let i = 0;
		let acc = [this.start];
		acc.pop();
		let choice = this.start
		let currentQ = this.QuestionList[questionNumber];
		for (i = 0; i < this.QuestionList[questionNumber].choices.length; i++) {
			let pos = new MRE.Vector3(currentQ.choicePos.x, currentQ.choicePos.y - i, currentQ.choicePos.z);
			choice = Creation.createText(this.context, "choice1", pos,
				this.QuestionList[questionNumber].choices[i]);
			choice.text.color = MRE.Color3.White();
			acc.push(choice);
		}
		return acc;
	}

	private destroyChoices(choices: MRE.Actor[]) {
		let i = 0;
		for (i = 0; i < choices.length; i++) {
			choices[i].destroy();
		}
	}
	private createQuestion(QNumber: number): MRE.Actor {
		let text = this.start;
		if (this.QuestionList[QNumber].isText) {
			text = Creation.createText(this.context, "choice", this.QuestionList[QNumber].pos,
				this.QuestionList[QNumber].qText);
			text.text.color = MRE.Color3.White();
			text.text.height = .4;
			return text;
		}

		return Creation.createKit(this.context, this.QuestionList[QNumber].name,
			this.QuestionList[QNumber].ID, this.QuestionList[QNumber].pos, this.QuestionList[QNumber].scale,
			this.QuestionList[QNumber].rot);

	}
	// private spaceText(text: string): string{
	// 	let acc = "";
	// 	while (text.length > 21){
	// 		let firstSpace = text.indexOf(" ", 18);
	// 		acc += text.substring(0,  firstSpace+1) + "\n";
	// 		text = text.substring( firstSpace+1,text.length);
	// 	}
	// 	return acc + text;
	// }
	private checkModerator(user: MRE.User) {
		// if (user.id !== undefined) return true; 
		// if (user.id === MRE.parseGuid("ce19cb48-59b6-6d0b-c61b-ca4c9fa5b380")) return true; 
		// if (user.id === MRE.parseGuid("31151fa3-be56-583b-1652-dba723a33348")) return true;
		// if (user.id === MRE.parseGuid("ce19cb48-59b6-6d0b-c61b-ca4c9fa5b380")) return true;  
		// return false;
		let roles = user.properties['altspacevr-roles'];
		let roleList = roles.split(",");
		if (roleList.indexOf("moderator") === -1) return false;
		return true;
	}
}