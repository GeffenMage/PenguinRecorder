const electron = require('electron');
const helpers = require('./helpers');
const globals = require('./globals');
const video = require('./video');

const { getVideoSources, selectSource, loadInitialPreview } = video;
const { disable, enable, hide, show } = helpers;
const { remote } = electron;
const {
	startBtn,
	stopBtn,
	nextBtn,
	backBtn,
	confirmBtn,
	cancelBtn,
	videoSelectBtn,
	videoSelectModal,
	videoBitRateInput,
	audioBitRateInput,
	videoSelectBox,
	enableAudioInput,
	settings,
	videoOptionsCard,
	videoSelectCard,
} = globals;

async function init() {
	document.getElementById('min-btn').addEventListener('click', function () {
		const window = remote.BrowserWindow.getFocusedWindow();
		window.minimize();
	});

	document.getElementById('max-btn').addEventListener('click', function () {
		const window = remote.BrowserWindow.getFocusedWindow();

		if (window.isMaximized()) window.unmaximize();
		else window.maximize();
	});

	document.getElementById('close-btn').addEventListener('click', function () {
		const window = remote.BrowserWindow.getFocusedWindow();
		window.close();
	});

	document.getElementById('no-audio-select').onclick = () => {
		document
			.getElementById('yes-audio-select')
			.parentElement.classList.remove('is-active');
		document
			.getElementById('no-audio-select')
			.parentElement.classList.add('is-active');

		enableAudioInput.checked = false;
		disable(audioBitRateInput);
	};

	document.getElementById('yes-audio-select').onclick = () => {
		document
			.getElementById('yes-audio-select')
			.parentElement.classList.add('is-active');
		document
			.getElementById('no-audio-select')
			.parentElement.classList.remove('is-active');

		enableAudioInput.checked = true;
		enable(audioBitRateInput);
	};

	document.querySelectorAll('.delete').forEach((el) => {
		el.onclick = () => closeModal();
	});

	startBtn.onclick = () => {
		const mediaRecorder = video.getMediaRecorder();

		mediaRecorder.start();
		document.querySelector('.main-video').classList.add('recording');
		hide(startBtn);
		show(stopBtn);
		disable(videoSelectBtn);
	};

	stopBtn.onclick = () => {
		const mediaRecorder = video.getMediaRecorder();

		mediaRecorder.stop();
		document.querySelector('.main-video').classList.remove('recording');
		hide(stopBtn);
		show(startBtn);
		enable(videoSelectBtn);
		enableSettingsInputs();
	};

	videoSelectBtn.onclick = openModal;

	// Modal Events
	cancelBtn.onclick = closeModal;

	confirmBtn.onclick = () => {
		const selectedVideo = document.querySelector(
			'.video-select-box .video-selected'
		);
		const srcId = selectedVideo.getAttribute('src-id');
		applySettings();
		selectSource(srcId);

		show(startBtn);
		videoSelectBtn.innerText = 'Change Video Source';

		closeModal();
	};

	nextBtn.onclick = () => {
		hide(videoSelectCard);
		show(videoOptionsCard);
		videoSelectCard.classList.remove('slide-from-left');
	};

	backBtn.onclick = () => {
		videoSelectCard.classList.add('slide-from-left');
		show(videoSelectCard);
		hide(videoOptionsCard);
	};

	await loadInitialPreview();
}

document.onreadystatechange = async function () {
	if (document.readyState == 'complete') {
		await init();
	}
};

async function openModal() {
	videoSelectModal.classList.add('is-active');
	getVideoSources().then(() => {
		document.getElementById('loader').classList.add('is-hidden');
	});
}

function closeModal() {
	videoSelectBox.innerHTML = '';
	disable(nextBtn);
	videoSelectCard.classList.remove('slide-from-left');
	document.getElementById('loader').classList.remove('is-hidden');
	videoSelectModal.classList.remove('is-active');
	hide(videoOptionsCard);
	show(videoSelectCard);
}

function applySettings() {
	if (videoBitRateInput.value != '' || null)
		settings.videoBitRate = parseInt(videoBitRateInput.value);
	if (audioBitRateInput.value != '' || null)
		settings.audioBitRate = parseInt(audioBitRateInput.value);

	settings.enableAudio = enableAudioInput.checked;
	blockSettingsInputs();
}

function blockSettingsInputs() {
	videoBitRateInput.disabled = true;
	audioBitRateInput.disabled = true;
	enableAudioInput.disabled = true;
}

function enableSettingsInputs() {
	videoBitRateInput.disabled = false;
	audioBitRateInput.disabled = false;
	enableAudioInput.disabled = false;
}
