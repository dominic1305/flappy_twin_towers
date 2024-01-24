const player = Player.spawn(10);

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
function gameEnd(endGameMSG) {
	Tower.releaseAll();
	gameOver = true;
	document.body.appendChild(document.querySelector('#game-over-popup-tmeplate').content.cloneNode(true));
	document.querySelector('.game-over-MSG').innerHTML = `you ${endGameMSG}`;

	if (endGameMSG == 'hit the twin towers') {//play sounds and explosions
		const SFX_allahu_akbar = new Audio('./sfx/allahu_akbar.mp3');
		const SFX_explosion = new Audio('./sfx/explosion.mp3');

		const element = document.createElement('img');
		element.className = 'end-game-explosion';
		element.style.top = `${player.position.y}px`;
		element.style.left = `${player.position.x}px`;
		element.src = './img/end-game-explosion.gif';

		document.querySelector('.play-zone').removeChild(player.element);
		setTimeout(() => {//play gif only once
			document.body.removeChild(element);
		}, 1300);

		document.body.appendChild(element);

		SFX_explosion.play();
		SFX_allahu_akbar.play();
	}

	const score = ScoreBoardManager.scoreInfo;
	document.querySelector('.game-over-score').innerHTML = `score: ${score.score}`;
	document.querySelector('.game-over-high-score').innerHTML = `high score: ${score.highSore}`;
	document.querySelector('.game-over-play-again-btn').addEventListener('click', () => location.reload());
	document.body.addEventListener('keyup', (e) => { if (e.key == 'Enter' || e.key == ' ') location.reload(); });
}