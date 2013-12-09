(function (exports) {

	var MotorSound = function (context) {
		this.currentFrame = 0;
		this.context = context;
		this.speed = 0.6;
		this.isPlaying = false;

		// scriptNode to change sound wave on the run
		this.scriptNode = context.createJavaScriptNode(1024, 1, 1);
		this.scriptNode.onaudioprocess = this.process.bind(this);

		// gainNode for volume control
		this.gainNode = context.createGainNode();
		this.gainNode.gain.value = 0.5;
		this.scriptNode.connect(this.gainNode);
	};

	MotorSound.prototype.setData = function (data) {
		this.data = data;
		this.gainNode.connect(this.context.destination);
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
	};

	exports.MotorSound = MotorSound;

})(window);