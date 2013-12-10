window.onload = function () {

	// canvas to generate gradients
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	// actual sound stuff
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();
	var generators = [
		new MotorSound.NoiseGenerator(),
		new MotorSound.LinearGenerator()
	];
	var motorSound = new MotorSound(context, generators[0]);

	function drawData() {
		// draw new gradient
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#000";

		// draw generated data to canvas
		ctx.beginPath();
		ctx.moveTo(0, (1 - motorSound.data[0]) * canvas.height / 2);
		for (var i = 0, len = motorSound.data.length; i < len; i++) {
			var value = motorSound.data[i];
			ctx.lineTo(i/len*canvas.width, (1 - value) * canvas.height / 2);
		}
		ctx.stroke();
	}

	function regenerateSound() {
		motorSound.regenerate();
		drawData();
	}

	function changeGenerator(index) {
		motorSound.setGenerator(generators[index]);
		drawData();
	}


	// ui listeners
	document.getElementById("speed-slider").oninput = function (event) {
		var speed = event.currentTarget.valueAsNumber;
		document.getElementById("speed").innerHTML = speed;
		motorSound.setSpeed(speed);
	};

	document.getElementById("volume-slider").oninput = function (event) {
		var volume = event.currentTarget.valueAsNumber;
		document.getElementById("volume").innerHTML = volume;
		motorSound.setVolume(volume);
	};

	document.getElementById("generators").onchange = function (event) {
		changeGenerator(event.target.selectedIndex);
	};

	document.getElementById("regenerate").onclick = function () {
		regenerateSound();
	};

	// start
	drawData();

};