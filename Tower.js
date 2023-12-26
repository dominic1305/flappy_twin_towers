import { player } from "./main.js";

export default class Tower {
	static towerArr = [new Tower()].filter(() => false);
	static #timerMax = 300;
	static #spawnTimer = Tower.#timerMax;
	static #gap = 200;
	#inPlay = false;
	#collisions = 0;
	/**@private @param {string} elementID @param {number} travelSpeed*/
	constructor(elementID, travelSpeed) {
		this.elementID = elementID;
		this.travelSpeed = travelSpeed;
	}
	static spawn() {
		Tower.#spawnTimer++;
		if (Tower.#spawnTimer <= Tower.#timerMax) return;
		Tower.#spawnTimer = 0;

		const [top, bottom] = Tower.#getGapOffset(Tower.#gap);

		const container = document.createElement('div');
		container.className = 'tower-container';
		container.id = `tower_container_${Math.random().toString(16).slice(2)}`;
		container.style.left = `${document.querySelector('.play-zone').clientWidth + 10}px`;

		const topTower = document.createElement('img');
		topTower.src = './img/tower.png';
		topTower.id = `top_tower_${Math.random().toString(16).slice(2)}`;
		topTower.className = 'top-tower';
		topTower.style.transform = `translateY(-${top}px) rotate(180deg)`;

		const bottomTower = document.createElement('img');
		bottomTower.src = './img/tower.png';
		bottomTower.id = `bottom_tower_${Math.random().toString(16).slice(2)}`;
		bottomTower.className = 'bottom-tower';
		bottomTower.style.transform = `translateY(${bottom}px)`;

		container.appendChild(topTower);
		container.appendChild(bottomTower);
		document.querySelector('.play-zone').appendChild(container);

		Tower.towerArr.push(new Tower(container.id, 2));
	}
	/**@param {number} gapSize*/
	static #getGapOffset(gapSize) {
		const topOffset = gapSize - Math.floor(Math.random() * gapSize + 1);
		const bottomOffset = gapSize - topOffset;
		return [topOffset, bottomOffset];
	}
	get element() {
		return document.querySelector(`#${this.elementID}`);
	}
	get position() {
		return {
			x: parseFloat(window.getComputedStyle(this.element).left),
			y: parseFloat(window.getComputedStyle(this.element).top)
		};
	}
	get boundingBox() {
		return this.element.getBoundingClientRect();
	}
	get children() {
		return this.element.querySelectorAll('img');
	}
	get inBounds() {
		const viewPortRect = document.querySelector('.play-zone').getBoundingClientRect();
		const entityRect = this.boundingBox;
		return !(entityRect.right < viewPortRect.left || entityRect.left > viewPortRect.right);
	}
	get collisionWithPlayer() {
		const playerBoundary = player.boundingBox;
		for (const childRect of Array.from(this.children).map(bin => bin.getBoundingClientRect())) {
			return !(childRect.top > playerBoundary.bottom || childRect.right < playerBoundary.left || childRect.bottom < playerBoundary.top || childRect.left > playerBoundary.right);
		}
	}
	#dispose() {//destructor
		console.log('deleting');
		Tower.towerArr.splice(Tower.towerArr.indexOf(this), 1);
		document.querySelector('.play-zone').removeChild(this.element);
	}
	move() {
		if (!this.#inPlay && this.inBounds) this.#inPlay = true;
		else if (this.#inPlay && !this.inBounds) return this.#dispose();
		this.element.style.left = `${this.position.x - this.travelSpeed}px`;
		if (this.collisionWithPlayer) this.#collisions++;
		if (this.#collisions >= 10) throw new Error('hit tower');
	}
}