const player = Player.spawn(10);
let gameOver = false;
const SFX_allahu_akbar = new Audio('./sfx/allahu_akbar.mp3');
const SFX_explosion = new Audio('./sfx/explosion.mp3');

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

void function() {
	document.querySelector('.sfx-toggle').dataset.active = localStorage.getItem('sfx-bool') ?? 1;
	document.querySelector('.sfx-toggle').src = (Boolean(Number(document.querySelector('.sfx-toggle').dataset.active))) ? './img/audio.png' : './img/no-audio.png';
}();

/**@param {string} endGameMSG*/
async function gameEnd(endGameMSG) {
	Tower.releaseAll();
	gameOver = true;
	document.body.appendChild(document.querySelector('#game-over-popup-tmeplate').content.cloneNode(true));
	document.querySelector('.game-over-MSG').innerHTML = `you ${endGameMSG}`;

	if (endGameMSG == 'hit the twin towers') {//play sounds and explosions
		const element = document.createElement('img');
		element.className = 'end-game-explosion';
		element.style.top = `${player.position.y}px`;
		element.style.left = `${player.position.x}px`;
		element.src = './img/end-game-explosion.gif';

		document.querySelector('.play-zone').removeChild(player.element);
		setTimeout(() => {//play gif only once
			document.querySelector('.play-zone').removeChild(element);
		}, 1300);

		document.querySelector('.play-zone').appendChild(element);

		if (Boolean(Number(document.querySelector('.sfx-toggle').dataset.active))) {
			SFX_explosion.play();
			SFX_allahu_akbar.play();
		}
	}

	const score = ScoreBoardManager.scoreInfo;
	document.querySelector('.game-over-score').innerHTML = `score: ${score.score}`;
	document.querySelector('.game-over-high-score').innerHTML = `high score: ${score.highSore}`;
	document.querySelector('.game-over-play-again-btn').addEventListener('click', () => location.reload());
	document.body.addEventListener('keyup', (e) => { if (e.key == 'Enter' || e.key == ' ') location.reload(); });
}

document.querySelector('.sfx-toggle').addEventListener('click', (e) => {
	e.target.dataset.active = Number(!Boolean(Number(e.target.dataset.active)));
	e.target.src = (Boolean(Number(e.target.dataset.active))) ? './img/audio.png' : './img/no-audio.png';
	localStorage.setItem('sfx-bool', e.target.dataset.active);
});