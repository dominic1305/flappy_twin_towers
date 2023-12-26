import Player from "./Player.js";
import Tower from "./Tower.js";
import ScoreBoardManager from "./ScoreBoardManager.js";

export const player = Player.spawn(10);

let TIME;
requestAnimationFrame(function loop(time) {
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