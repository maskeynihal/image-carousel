function imageCarousel(
	carouselContainer,
	width = '400px',
	height = '200px',
	animationTime = 1,
	holdTime = 2
) {
	var self = this;
	this.carouselContainer = carouselContainer;
	this.width = width;
	this.height = height;
	this.speed = animationTime;
	this.animationTime = animationTime;
	this.images = this.carouselContainer.querySelectorAll('img');

	this.setCarouselImageWrapper = null;
	this.carouselIndicator = null;

	this.startPoint = 0;
	this.endPoint = 0;
	this.slidingAnimationId;
	this.isSliding = false;

	this.imageIndex = 0;
	this.startingAnimationTime = 0;
	this.holdTime = holdTime;

	this.arrowButtonStyles = {
		position: 'absolute',
		top: '50%',
		transform: 'translateY(-50%)',
		'z-index': '999',
	};

	this.transitionSpeed = 0;

	this.setAnimationTime = (function () {
		self.animationTime = self.animationTime * 1000;
	})();

	this.setTransitionSpeed = function (pixelToBeMoved) {
		return pixelToBeMoved / self.animationTime;
	};

	this.setCarouselContainerStyle = function () {
		self.carouselContainer.style.width = self.width;
		self.carouselContainer.style.height = self.height;
		self.carouselContainer.style.overflow = 'hidden';
		self.carouselContainer.style.position = 'relative';
	};

	this.setCarouselItemWrapper = function (image) {
		var itemWrapper = document.createElement('div');
		itemWrapper.setAttribute('class', 'carousel-item-wrapper');
		itemWrapper.style.width = self.width;
		itemWrapper.style.height = self.height;
		image.parentNode.insertBefore(itemWrapper, image);
		itemWrapper.appendChild(image);
	};

	this.setCarouselImageWrapper = function (images) {
		var carouselImageWrapperDiv = document.createElement('div');
		self.carouselImageWrapper = carouselImageWrapperDiv;
		carouselImageWrapperDiv.setAttribute('class', 'carousel-image-wrapper');
		var totalWidth = `${images.length * parseInt(self.width)}px`;
		carouselImageWrapperDiv.style.width = totalWidth;
		carouselImageWrapperDiv.style.left = '0px';
		carouselImageWrapperDiv.classList.add('clearfix');
		images.forEach(function (image) {
			image.parentNode.insertBefore(carouselImageWrapperDiv, image);
			carouselImageWrapperDiv.appendChild(image);
			self.setCarouselItemWrapper(image);
		});
	};

	this.setImageWidth = function (images, width, height) {
		images.forEach(function (image) {
			image.style.width = width;
			image.style.height = height;
		});
	};

	this.slideRight = function () {
		var currentImageIndex = parseInt(self.imageIndex);
		var nextImageIndex =
			currentImageIndex + 1 > self.images.length - 1
				? 0
				: currentImageIndex + 1;
		self.slide(nextImageIndex);
	};

	this.slideLeft = function () {
		var currentImageIndex = parseInt(self.imageIndex);
		var nextImageIndex =
			currentImageIndex - 1 < 0
				? self.images.length - 1
				: currentImageIndex - 1;
		self.slide(nextImageIndex);
	};

	this.calculateStartAndEndPoint = function (nextIndex) {
		var slideAmount = (self.imageIndex - nextIndex) * parseInt(self.width);

		self.startPoint = parseInt(self.carouselImageWrapper.style.left);
		self.endPoint =
			parseInt(self.carouselImageWrapper.style.left) + slideAmount;
	};

	this.slide = function (nextIndex) {
		if (self.isSliding) {
			return;
		}

		self.isSliding = true;
		self.calculateStartAndEndPoint(nextIndex);
		window.requestAnimationFrame(self.slidingAnimation);
		self.imageIndex = nextIndex;
		self.setActiveIndictor(self.imageIndex);
	};

	this.slidingAnimation = function (timestamp) {
		if (self.startingAnimationTime === 0) {
			self.startingAnimationTime = timestamp;
		}

		var elapsed = timestamp - self.startingAnimationTime;

		var pixelMove = Math.abs(
			Math.abs(self.endPoint) - Math.abs(self.startPoint)
		);

		var speed = Math.min(
			elapsed * self.setTransitionSpeed(pixelMove),
			pixelMove
		);

		if (self.endPoint < self.startPoint) {
			speed = -speed;
		}

		if (elapsed < self.animationTime) {
			window.requestAnimationFrame(self.slidingAnimation);
		} else {
			self.startingAnimationTime = 0;
			self.isSliding = false;
		}

		self.carouselImageWrapper.style.left = self.startPoint + speed + 'px';
	};

	this.createCarouselButtons = function () {
		leftArrow = document.createElement('div');
		leftArrow.id = 'leftArrow';
		self.carouselContainer.appendChild(leftArrow);
		leftArrow.innerHTML +=
			'<img src="https://img.icons8.com/carbon-copy/50/000000/chevron-left.png">';
		leftArrow.style.left = '0';
		leftArrow.classList.add('arrow-button');
		Object.assign(leftArrow.style, self.arrowButtonStyles);
		leftArrow.addEventListener('click', self.slideLeft);

		rightArrow = document.createElement('div');
		rightArrow.id = 'rightArrow';
		self.carouselContainer.appendChild(rightArrow);
		rightArrow.innerHTML +=
			'<img src="https://img.icons8.com/carbon-copy/50/000000/chevron-right.png"/>';
		rightArrow.style.right = '0';
		rightArrow.classList.add('arrow-button');
		Object.assign(rightArrow.style, self.arrowButtonStyles);
		rightArrow.addEventListener('click', self.slideRight);

		self.createIndicatorDot();
	};

	this.createIndicatorDot = function () {
		self.carouselIndicator = document.createElement('ul');
		self.carouselIndicator.style.width = self.width;
		self.carouselIndicator.id = 'carouselIndicator';
		self.carouselIndicator.classList.add('clearfix', 'carousel-indicator');

		var index = 0;
		self.images.forEach(function (image) {
			var carouselIndicatorItem = document.createElement('li');

			carouselIndicatorItem.setAttribute('index', index);

			carouselIndicatorItem.classList.add('carousel-indicator-item');
			self.carouselIndicator.appendChild(carouselIndicatorItem);

			carouselIndicatorItem.addEventListener('click', function (event) {
				self.slide(event.target.attributes.index.value);
			});
			index++;
		});

		self.setActiveIndictor(0);
		self.carouselContainer.appendChild(self.carouselIndicator);
	};

	this.setActiveIndictor = function (index) {
		if (self.carouselIndicator.querySelector('.active')) {
			self.carouselIndicator
				.querySelector('.active')
				.classList.remove('active');
		}
		self.carouselIndicator.children[index].classList.add('active');
	};

	this.setCarouselContainerStyle();
	this.setCarouselImageWrapper(this.images);
	this.setImageWidth(this.images, this.width, this.height);
	this.createCarouselButtons();
	this.automaticSliding = (function () {
		setInterval(function () {
			nextIndex = self.imageIndex + 1;

			if (nextIndex > self.images.length - 1) {
				nextIndex = 0;
			}
			self.slide(nextIndex);
		}, self.holdTime * 1000);
	})();
}
