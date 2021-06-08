const electron = require('electron');
const fs = require('fs');
const ysFixWebmDuration = require('fix-webm-duration');
const helpers = require('./helpers');
const globals = require('./globals');

const { writeFileSync } = fs;
const { desktopCapturer } = electron;
const { enable } = helpers;
const { nextBtn, videoElement, videoSelectBox, settings } = globals;

let recordedChunks = [];
let mediaRecorder;
let videoStartTime;

async function loadInitialPreview() {

	const inputSources = await desktopCapturer.getSources({
		types: ['screen'],
	});

	const srcId = inputSources[0].id;

	const constraints = {
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: srcId,
			},
		},
	};

	const stream = await navigator.mediaDevices.getUserMedia(constraints);

	videoElement.srcObject = stream;
	videoElement.onloadedmetadata = () => videoElement.play();
}

const getVideoSources = async function () {
	const inputSources = await desktopCapturer.getSources({
		types: ['window', 'screen'],
	});

	inputSources.forEach(async (source) => {
		await createSourcePreview(source);
	});
};

function clearVideoSelection(){
	const videos = document.querySelectorAll(
		'.video-select-box div .video-selected'
	);
	videos.forEach((video) => {
		video.classList.remove('video-selected');
	});
}

async function createSourcePreview(source) {

	const img = document.createElement('img');
	img.classList.add('video-preview');
	img.src = source.thumbnail.toDataURL();
	img.onclick = () => {
		clearVideoSelection();
		img.classList.add('video-selected');
		enable(nextBtn);
	};
	img.setAttribute('src-id', source.id);

	const label = document.createElement('label');
	label.innerText = source.name;

	const div = document.createElement('div');
	div.appendChild(img);
	div.appendChild(label);

	videoSelectBox.append(div);
}

const selectSource = async function (srcId){
	let constraints = {};

	const previewConstraints= {
		audio: false,
		video: {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: srcId,
			},
		},
	};

	if (settings.enableAudio) {
		constraints = {
			audio: {
				mandatory: {
					chromeMediaSource: 'desktop',
				},
			},
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: srcId,
				},
			},
		};
	} else {
		constraints = {
			audio: settings.enableAudio,
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: srcId,
				},
			},
		};
	}

	const PreviewStream = await navigator.mediaDevices.getUserMedia(
		previewConstraints
	);
	const stream = await navigator.mediaDevices.getUserMedia(constraints);
	stream.getVideoTracks()[0].applyConstraints({ frameRate: 60 });

	videoElement.srcObject = PreviewStream;
	videoElement.onloadedmetadata = () => videoElement.play();

	const options= {
		mimeType: 'video/webm; codecs=vp8',
		videoBitsPerSecond: settings.videoBitRate * 1000,
		audioBitsPerSecond: settings.audioBitRate * 1000,
	};
	mediaRecorder = new MediaRecorder(stream, options);

	mediaRecorder.onstart = () => {
		videoStartTime = new Date();
	};
	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.onstop = handleStop;
};

function handleDataAvailable(e) {
	recordedChunks.push(e.data);
}

async function handleStop() {
	const blob = new Blob(recordedChunks, {
		type: 'video/webm; codecs=vp8',
	});

	const endTime= new Date();

	const duration = endTime - videoStartTime;

	ysFixWebmDuration(blob, duration, async function (fixedBlob) {
		const buffer = Buffer.from(await fixedBlob.arrayBuffer());

		const { filePath } = await electron.remote.dialog.showSaveDialog({
			buttonLabel: 'Save video',
			defaultPath: `vid-${Date.now()}.webm`,
		});

		if (filePath) {
			writeFileSync(filePath, buffer);
		}

		recordedChunks = [];
	});
}

function getMediaRecorder(){
	return mediaRecorder;
}

module.exports = {
	selectSource,
	getVideoSources,
	loadInitialPreview,
	getMediaRecorder,
};