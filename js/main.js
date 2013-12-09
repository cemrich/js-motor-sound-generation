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
		gradient.addColorStop(0, "rgba(0, 0, 0, 255)");
		for (var i = 0.05; i < 1; i += Math.random()/8+0.01) {
			gradient.addColorStop(i, "rgba(0, 0, 0," + Math.random() + ")");
		}
		gradient.addColorStop(1, "rgba(0, 0, 0, 255)");
		return gradient;
	}

	// make new random sound data
	function regenerateSound() {
		// draw new gradient
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = getRandomGradient();  
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#fff";

		// get data from gradient
		var imageData = ctx.getImageData(0, 0, canvas.width, 1).data;
		var data = [];
		for (var i = 3, len = imageData.length; i < len; i += 4) {
			var normalized = imageData[i] / 128 - 1;
			data.push(normalized);
			// draw data curve to canvas
			ctx.fillRect(i/4, (1-normalized)*canvas.height/2, 1, 1);
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