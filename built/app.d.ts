/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as MRE from '@microsoft/mixed-reality-extension-sdk';
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
/**
 * The main class of this app. All the logic goes here.
 */
export default class VRQuiz {
    private context;
    private baseUrl;
    anwserBackground: MRE.Actor;
    start: MRE.Actor;
    private VotesPos;
    votes: MRE.Actor;
    votesCount: number;
    anwserBackdrop: MRE.Actor;
    hider: MRE.Actor;
    private adminID;
    private adminID2;
    private adminIDs;
    private stopVotes;
    questionNumber: number;
    currentQuestion: MRE.Actor;
    currentChoices: MRE.Actor[];
    private usersVoted;
    QuestionList: Actor[];
    AnswerList: Actor[];
    ButtonList: Actor[];
    ChoiceList: Actor[];
    CountList: MRE.Actor[];
    ChCubeList: MRE.Actor[];
    letterList: MRE.Actor[];
    tempCheck: number;
    map: Map<any, any>;
    constructor(context: MRE.Context, baseUrl: string);
    private onUserLeft;
    private onUserJoined;
    /**
     * Once the context is "started", initialize the app.
     */
    private populateLists;
    private started;
    private beginQuiz;
    private activateQuestion;
    private activateAnswer;
    private refreshChoiceCounts;
    private selectedColor;
    private showChoiceDistribution;
    private resetChoices;
    private resetUserChoices;
    private activateChoices;
    private destroyChoices;
    private createQuestion;
    private checkModerator;
}
export {};
//# sourceMappingURL=app.d.ts.map