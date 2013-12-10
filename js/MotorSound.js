(function (exports) {

	var MotorSound = function (context, generator) {
		this.currentFrame = 0;
		this.context = context;
		this.speed = 0.6;
		this.isPlaying = false;
		this.generator = generator;

		// scriptNode to change sound wave on the run
		this.scriptNode = context.createScriptProcessor(1024);
		this.scriptNode.onaudioprocess = this.process.bind(this);

		// gainNode for volume control
		this.gainNode = context.createGain();
		this.gainNode.gain.value = 0.5;
		this.scriptNode.connect(this.gainNode);

		this.regenerate();
		this.gainNode.connect(this.context.destination);
	};

	MotorSound.prototype.regenerate = function (data) {
		this.data = this.generator.generate();
	};

	MotorSound.prototype.setVolume = function (volume) {
		this.gainNode.gain.value = volume;
	};

	MotorSound.prototype.setSpeed = function (speed) {
		this.speed = speed;
	};

	MotorSound.prototype.process = function (event) {
		// this is the output buffer we can fill with new data
		var channel = event.outputBuffer.getChannelData(0);
		var index;

		for (var i = 0; i < channel.length; ++i) {
			// skip more data frames on higher speed
			this.currentFrame += this.speed;
			index = Math.floor(this.currentFrame) % this.data.length;
			// update buffer from data
			channel[i] = this.data[index];
		}
		this.currentFrame %= this.data.length;
		console.log(this.currentFrame);
	};


	var CanvasGenerator = function () {
		this.canvas = document.createElement('canvas');
		this.canvas.width = 1024;
		this.canvas.height = 1;
		this.ctx = this.canvas.getContext('2d');
	};

	CanvasGenerator.prototype.getRandomGradient = function () {
		// get a horizontal gradient with several stops
		var gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);  
		gradient.addColorStop(0, "rgba(0, 0, 0, 255)");
		for (var i = 0.05; i < 1; i += Math.random()/8+0.01) {
			gradient.addColorStop(i, "rgba(0, 0, 0," + Math.random() + ")");
		}
		gradient.addColorStop(1, "rgba(0, 0, 0, 255)");
		return gradient;
	};

	CanvasGenerator.prototype.generate = function () {
		// draw new gradient
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = this.getRandomGradient();
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// get data from gradient
		var imageData = this.ctx.getImageData(0, 0, this.canvas.width, 1).data;
		var data = [];
		for (var i = 3, len = imageData.length; i < len; i += 4) {
			data.push(imageData[i] / 128 - 1);
		}
		return data;
	};


	exports.MotorSound = MotorSound;
	exports.CanvasGenerator = CanvasGenerator;

})(window);