let draw = {
	dotOptions: {
		color: '#000',
		radius: 5,
		initialPositionX: 100,
		initialPositionY: 100,
		dotsToConnect: 2
	},
	lineOptions: {
		color: 'green'
	},
	globalOptions: {
		global_width: window.innerWidth,
		global_height: window.innerHeight,
		ratio: 1,
	},
	interface: {
		dotsConnectInput: document.getElementById('dots-connect-count'),
		dotsColorInput: document.getElementById('dots-color')
	},
	canvas: document.getElementById('canvas'),
	context: canvas.getContext('2d'),
	dots: [],

	/**
	 * Scale canvas
	 * @return {undefined}
	 */
	scale() {
		this.globalOptions.global_width = window.innerWidth;
		this.globalOptions.global_height = window.innerHeight;
		if (this.context.webkitBackingStorePixelRatio < 2) this.globalOptions.ratio = window.devicePixelRatio || 1;
		this.canvas.setAttribute('width', this.globalOptions.global_width * this.globalOptions.ratio);
		this.canvas.setAttribute('height', this.globalOptions.global_height * this.globalOptions.ratio);
	},
	/**
	 * Init
	 * @return {undefo=ied}
	 */
	init() {
		this.context.save();
		this.context.scale(this.globalOptions.ratio, this.globalOptions.ratio);
		this.scale();
		this.drawDot(this.dotOptions.initialPositionX, this.dotOptions.initialPositionY);
		this.saveDot(this.dotOptions.initialPositionX, this.dotOptions.initialPositionY);
		this.context.restore();

		this.handleEvents();
	},
	/**
	 * Draw dot on canvas
	 * @param  {number} positionX
	 * @param  {number} positionY
	 * @return {undefined}
	 */
	drawDot(positionX, positionY) {
		this.context.beginPath();
		this.context.arc(positionX, positionY, this.dotOptions.radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = this.dotOptions.color;
		this.context.fill();
	},
	/**
	 * Push dot to dots array
	 * @param  {number} positionX
	 * @param  {number} positionY
	 * @return {undefined}
	 */
	saveDot(positionX, positionY) {
		this.dots.push({
			x: positionX,
			y: positionY
		});
	},
	/**
	 * Draw line from dot to passed coordinate
	 * @param  {number} startCoordinate
	 * @param  {number} endCoordinate
	 * @return {undefined}
	 */
	drawLine(startCoordinate, endCoordinate) {
		this.context.beginPath();
		this.context.moveTo(startCoordinate.x, startCoordinate.y);
		this.context.lineTo(endCoordinate.x, endCoordinate.y);
		this.context.strokeStyle = this.lineOptions.color;
		this.context.stroke();
	},
	/**
	 * Get mouse position on canvas
	 * @param  {object} canvas 
	 * @param  {object} event
	 * @return {object}
	 */
	getMousePos(canvas, event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	},
	/**
	 * Get last dots from dots array
	 * @return {array}
	 */
	getLastDots() {
		return this.dots.slice(-this.dotOptions.dotsToConnect);
	},
	/**
	 * Change number of connected dots
	 * @param  {object} event
	 * @return {undefined}
	 */
	changeConnectedDotsCount(event) {
		let val = event.target.value;
		if (val > 0) {
			this.interface.dotsConnectInput.classList.remove('error');
			this.dotOptions.dotsToConnect = Math.floor(val);
		} else {
			this.interface.dotsConnectInput.classList.add('error');
		}
	},
	/**
	 * Change line color
	 * @param  {object} event
	 * @return {undefined}
	 */
	changeLineColor(event) {
		this.lineOptions.color = event.target.value;
	},
	/**
	 * Conect dots
	 * @param  {object} event
	 * @return {undefined}
	 */
	connectDots(event) {
		let mousePos = this.getMousePos(canvas, event),
			dotsToConnect = this.getLastDots();
		this.drawDot(mousePos.x, mousePos.y);
		for (let i = 0; i < dotsToConnect.length; i++) {
			this.drawLine(mousePos, dotsToConnect[i]);
		}
		this.saveDot(mousePos.x, mousePos.y)
	},
	/**
	 * Handle events
	 * @return {undefined}
	 */
	handleEvents() {
		this.canvas.addEventListener('mousedown', (event) => this.connectDots(event), false);
		this.interface.dotsConnectInput.addEventListener('input', (event) => this.changeConnectedDotsCount(event));
		this.interface.dotsColorInput.addEventListener('change', (event) => this.changeLineColor(event));
	},
	/**
	 * Setup
	 * @return {undefined}
	 */
	setup() {
		if (this.context) {
			this.init();
		}
	}


};

draw.setup();