window.onload = function () {

	// canvas to generate gradients
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	// actual sound stuff
	var context = new webkitAudioContext();
	var motorSound = new MotorSound(context);

	// get a horizontal gradient with several stops
	function getRandomGradient() {
		var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);  
		gradient.addColorStop(0, "rgb(255, 0, 0)");
		for (var i = 0.05; i < 1; i += Math.random()/8+0.01) {
			var rand = Math.floor(Math.random() * 256);
			gradient.addColorStop(i, "rgb(" + rand + ", 0, 0)");
		}
		gradient.addColorStop(1, "rgb(255, 0, 0)");
		return gradient;
	}

	// make new random sound data
	function regenerateSound() {
		ctx.fillStyle = getRandomGradient();  
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var imageData = ctx.getImageData(0, 0, canvas.width, 1).data;
		var data = [];
		for (var i = 0, len = imageData.length; i < len; i += 4) {
			data.push(imageData[i] / 128 - 1);
		}
		motorSound.setData(data);
	}


	// ui listeners
	document.getElementById("speed-slider").onchange = function (event) {
		var speed = event.srcElement.valueAsNumber;
		document.getElementById("speed").innerHTML = speed;
		motorSound.setSpeed(speed);
	};

	document.getElementById("volume-slider").onchange = function (event) {
		var volume = event.srcElement.valueAsNumber;
		document.getElementById("volume").innerHTML = volume;
		motorSound.setVolume(volume);
	};

	document.getElementById("regenerate").onclick = function () {
		regenerateSound();
	};

	// start
	regenerateSound();

};