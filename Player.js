export default class Player {
	#keyPressed = false;
	#velocity = 0;
	/**@private @param {string} elementID @param {number} jumpHeight*/
	constructor(elementID, jumpHeight) {
		this.elementID = elementID;
		this.jumpHeight = jumpHeight
	}
	/**@param {number} jumpHeight*/
	static spawn(jumpHeight) {
		const element = document.createElement('img');
		element.src = './img/plane.png';
		element.id = `plane${Math.random().toString(16).slice(2)}`;
		element.className = 'plane';

		element.style.top = '50%';
		element.style.left = '25%';

		document.querySelector('.play-zone').appendChild(element);

		const player = new Player(element.id, jumpHeight);
		player.#attachPlayerControl();
		return player;
	}
	get element() {
		return document.querySelector(`#${this.elementID}`);
	}
	get boundingBox() {
		return this.element.getBoundingClientRect();
	}
	get touchingFloor() {
		const entityRect = this.boundingBox;
		const viewPortRect = document.querySelector('.play-zone').getBoundingClientRect();
		return !(entityRect.bottom < viewPortRect.bottom);
	}
	get touchingRoof() {
		const entityRect = this.boundingBox;
		const viewPortRect = document.querySelector('.play-zone').getBoundingClientRect();
		return !(entityRect.top > viewPortRect.top);
	}
	get position() {
		return {
			x: parseFloat(window.getComputedStyle(this.element).left),
			y: parseFloat(window.getComputedStyle(this.element).top)
		};
	}
	#attachPlayerControl() {
		document.addEventListener('keydown', (e) => {//before keyboard actions
			if (this.#keyPressed) return;
			this.#keyPressed = true;

			if (e.key == ' ') {//flap
				this.#velocity = this.jumpHeight;
			}
		});
		document.addEventListener('keyup', (e) => {//reset values
			this.#keyPressed = false;
		});
	}
	move() {
		if (this.touchingFloor || this.touchingRoof) throw new Error('hit the something');
		this.element.style.top = `${this.position.y - this.#velocity}px`;
		this.#velocity -= 0.5;
	}
}