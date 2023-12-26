import Player from "./Player.js";
import Tower from "./Tower.js";
import ScoreBoardManager from "./ScoreBoardManager.js";

export const player = Player.spawn(10);

let gameOver = false;

let TIME;
requestAnimationFrame(function loop(time) {
	if (gameOver) return;
	if (time != null) {
		const delta = time - TIME;
		document.querySelector('.fps-counter').innerHTML = `${Math.round(1000 / delta)}fps`;
		TIME = time;

		//actionable code
		player.move();
		Tower.spawn();
		for (const tower of Tower.towerArr) {
			tower.move();
		}
		ScoreBoardManager.updateScoreBoard();
	}
	requestAnimationFrame(loop);
});

/**@param {string} endGameMSG*/
export function gameEnd(endGameMSG) {
	gameOver = true;
	document.body.appendChild(document.querySelector('#game-over-popup-tmeplate').content.cloneNode(true));
	document.querySelector('.game-over-MSG').innerHTML = `you ${endGameMSG}`;
	const score = ScoreBoardManager.scoreInfo;
	document.querySelector('.game-over-score').innerHTML = `score: ${score.score}`;
	document.querySelector('.game-over-high-score').innerHTML = `high score: ${score.highSore}`;
	document.querySelector('.game-over-play-again-btn').addEventListener('click', () => location.reload());
}