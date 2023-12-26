export default class ScoreBoardManager {
	static #score = 0;
	static #highScore = Number(localStorage.getItem('high-score')) ?? 0;
	static get #board() {
		return document.querySelector('.score-board-container');
	}
	static get scoreInfo() {
		return {
			score: ScoreBoardManager.#score,
			highSore: ScoreBoardManager.#highScore
		};
	}
	static updateScoreBoard() {
		ScoreBoardManager.#board.querySelector('.score').innerHTML = `Score: ${ScoreBoardManager.#score}`;
		ScoreBoardManager.#board.querySelector('.high-score').innerHTML = `High Score: ${ScoreBoardManager.#highScore}`;
	}
	/**@param {number} val*/
	static setHighScore(val) {
		localStorage.setItem('high-score', val);
		ScoreBoardManager.#highScore = val;
	}
	/**@param {number} val*/
	static addToScore(val) {
		ScoreBoardManager.#score += val;
		if (ScoreBoardManager.#score >= ScoreBoardManager.#highScore) ScoreBoardManager.setHighScore(ScoreBoardManager.#score);
	}
}