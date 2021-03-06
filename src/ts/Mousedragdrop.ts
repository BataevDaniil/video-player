class Mousedragdrop {
	public press:boolean;
	public elementIcone:JQuery;
	private grub;
	public mainAreaMovement:(event) => void;
	private shiftLeft:number;
	private shiftTop:number;
	public element:JQuery;
	private callBack:(shiftLeft:number, shiftTop:number) => void;
	public rangeVert;
	public rangeHor;

	constructor(element:JQuery) {
		element.css('position', 'relative');

		this.elementIcone = element.children('.icone');
		this.elementIcone.css('position','absolute');
		this.press = false;
		this.mainAreaMovement = this.areaMovementSquare;

		this.elementIcone.on('mousedown', this.mousedownEvent);
		$(document).on('mouseup', this.mouseupEvent);
		$(document).on('mousemove', this.mousemoveEvent);
		element.on('mousedown', this.clickSlider);

		this.elementIcone.on('touchstart', this.touchstartEvent);
		this.elementIcone.on('touchend', this.touchendEvent);
		this.elementIcone.on('touchmove', this.touchmoveEvent);
		element.on('touchstart', this.touchSlider);

		this.element = element;
		this.shiftLeft = 0;
		this.shiftTop = 0;
		this.callBack = () => {};
		this.setRangeHor(0,100, 0);
		this.setRangeVert(0,100, 0);
	}

	private touchSlider = (event) => {
		this.clickSlider(event.changedTouches[0]);
	};
	public clickSlider = (event) => {
		if (event.target == this.element.get(0)) {
			this.grub = {left : this.elementIcone.width()/2, top : this.elementIcone.height()/2};
			let shiftX = event.pageX - this.element.offset().left;
			if (shiftX < this.elementIcone.width() / 2)
				this.elementIcone.css('left', 0);
			else if (shiftX > this.element.width() - this.elementIcone.width())
				this.elementIcone.css('left', this.element.width() - this.elementIcone.width());
			else
				this.elementIcone.css('left', shiftX);

			let shiftY = event.pageY - this.element.offset().top;
			if (shiftY < this.elementIcone.height() / 2)
				this.elementIcone.css('top', 0);
			else if (shiftY > this.element.height() - this.elementIcone.height())
				this.elementIcone.css('top', this.element.height() - this.elementIcone.height());
			else
				this.elementIcone.css('top', shiftY);
			this.callBack(this.transfShiftLeft(shiftX), this.transfShiftTop(shiftY));
			this.press = true;
		}
	};

	public setPosLeft(left:number) {
		this.elementIcone.css('left',
			(this.element.width() - this.elementIcone.width()) /
			(this.rangeHor.right - this.rangeHor.left) *
			(left - this.rangeHor.left));
	}

	public setPosTop(top:number) {
		this.elementIcone.css('top',
			(this.element.height() - this.elementIcone.height()) /
			(this.rangeVert.top - this.rangeVert.bottom) *
			(top - this.rangeVert.bottom));
	}

	public transfShiftLeft = (left:number) =>{
		return parseFloat((this.rangeHor.left +
		      (this.rangeHor.right - this.rangeHor.left)/
		      (this.element.width() - this.elementIcone.width()) * left).toFixed(4));
	};

	public transfShiftTop = (top:number) => {
		return parseFloat((this.rangeVert.bottom +
		      (this.rangeVert.top - this.rangeVert.bottom)/
			  (this.element.width() - this.elementIcone.width()) * top).toFixed(4));
	};

	public setRangeHor(left:number, right:number, pos:number, step:number = null) {
		this.rangeHor = {left : left, right : right, step: step};
		this.setPosLeft(pos);
	}

	public setRangeVert(bottom:number, top:number, pos:number, step:number = null) {
		this.rangeVert = {bottom : bottom, top : top, step : step};
		this.setPosTop(pos);
	}

	public on(callBack: (shiftLeft:number, shiftTop:number) => void) {
		this.callBack = callBack;
	}

	public mousedownEvent = (event) => {
		this.press = true;
		this.grub = {left : event.pageX - this.elementIcone.offset().left,
			top : event.pageY - this.elementIcone.offset().top};
	};

	public touchstartEvent = (event) => {
		this.press = true;
		let eventTuouch = event.changedTouches[0];
		this.grub = {left : eventTuouch.pageX - this.elementIcone.offset().left,
		             top : eventTuouch.pageY - this.elementIcone.offset().top};
		event.preventDefault();
	};

	public mouseupEvent = () => {
		this.press = false;
	};

	public touchendEvent = (event) => {
		this.press = false;
		event.preventDefault();
	};

	public mousemoveEvent = (event) => {
		if (this.press) {
			let tmp1:number = this.shiftLeft;
			let tmp2:number = this.shiftTop;
			this.mainAreaMovement(event);
			if (tmp1 !== this.shiftLeft || tmp2 !== this.shiftTop) {
				this.callBack(this.transfShiftLeft(this.shiftLeft), this.transfShiftTop(this.shiftTop));
			}
		}
	};
	public touchmoveEvent = (event) => {
		event.preventDefault();
		if (this.press) {
			let tmp1:number = this.shiftLeft;
			let tmp2:number = this.shiftTop;
			this.mainAreaMovement(event.changedTouches[0]);
			if (tmp1 !== this.shiftLeft || tmp2 !== this.shiftTop)
				this.callBack(this.transfShiftLeft(this.shiftLeft), this.transfShiftTop(this.shiftTop));
		}
	};

	public areaMovementSquare(event) {
		let maxShiftTop = this.element.height() - this.elementIcone.height();
		let maxShiftLeft = this.element.width() - this.elementIcone.width();

		let shiftLeft:number = event.pageX - this.element.offset().left - this.grub.left;
		let shiftTop:number = event.pageY - this.element.offset().top - this.grub.top;

		if (shiftLeft > 0)
			if (shiftTop < maxShiftTop)
				if (shiftLeft < maxShiftLeft)
					if (shiftTop > 0)
					//move inside
						this.elementIcone.css('left', shiftLeft)
							.css('top', shiftTop);
					else {
						//top line move
						if (0 < shiftLeft && shiftLeft < maxShiftLeft)
							this.elementIcone.css('left', shiftLeft)
								.css('top', 0);
					}
				else {
					//right line move
					if (0 < shiftTop && shiftTop < maxShiftTop)
						this.elementIcone.css('left', maxShiftLeft)
							.css('top', shiftTop);
				}
			else {
				//bottom line move
				if (0 < shiftLeft && shiftLeft < maxShiftLeft)
					this.elementIcone.css('left', shiftLeft)
						.css('top', maxShiftTop);
			}
		else {
			//left line move
			if (0 < shiftTop && shiftTop < maxShiftTop)
				this.elementIcone.css('left', 0)
					.css('top', shiftTop);
		}

		//left top angle
		if (shiftLeft < 0 && shiftTop < 0)
			this.elementIcone.css('left', 0)
				.css('top', 0);
		//right top angle
		else if (shiftLeft > maxShiftLeft && shiftTop < 0)
			this.elementIcone.css('left', maxShiftLeft)
				.css('top', 0);
		//right bottom angle
		else if (shiftLeft > maxShiftLeft && shiftTop > maxShiftTop)
			this.elementIcone.css('left', maxShiftLeft)
				.css('top', maxShiftTop);
		//left bottom angle
		else if (shiftLeft < 0 && shiftTop > maxShiftTop)
			this.elementIcone.css('left', 0)
				.css('top', maxShiftTop);
		// console.log(this.elementIcone.css('left'));
		this.shiftLeft = parseFloat(this.elementIcone.css('left'));
		this.shiftTop = parseFloat(this.elementIcone.css('top'));
	};
}