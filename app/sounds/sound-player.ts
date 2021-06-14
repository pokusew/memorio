"use strict";

import correctAnswer from './correct-answer.mp3';
import wrongAnswer from './wrong-answer.mp3';


export class SoundPlayer {

	correctAnswer: HTMLAudioElement;
	wrongAnswer: HTMLAudioElement;

	constructor() {

		console.log(`[SoundPlayer] initializing`, correctAnswer, wrongAnswer);

		this.correctAnswer = new Audio(correctAnswer);
		this.wrongAnswer = new Audio(wrongAnswer);

	}

	private static play(audio: HTMLAudioElement) {

		try {

			// we do not need the result
			// noinspection JSIgnoredPromiseFromCall
			audio.play();

		} catch (err) {
			console.log(`[SoundPlayer] an error while attempting to play`, err);
		}

	}

	public playCorrectAnswer() {
		SoundPlayer.play(this.correctAnswer);
	}

	public playWrongAnswer() {
		SoundPlayer.play(this.wrongAnswer);
	}

}
