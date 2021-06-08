// Video Preview
const videoElement = document.querySelector('video');

// Buttons
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
const nextBtn = document.getElementById('modal-next-btn');
const backBtn = document.getElementById('modal-return-btn');
const confirmBtn = document.getElementById('modal-confirm-btn');
const cancelBtn = document.getElementById('modal-cancel-btn');

// Modal
const videoSelectModal = document.getElementById('video-select-modal');
const videoSelectBox = document.querySelector('.video-select-box');

// Inputs
const videoBitRateInput = document.getElementById('video-bit-rate');
const audioBitRateInput = document.getElementById('audio-bit-rate');
const enableAudioInput = document.getElementById('enable-audio');

// Cards
const videoSelectCard = document.getElementById('video-select-card');
const videoOptionsCard = document.querySelector('.options-card');

// Settings
let settings = {
	enableAudio: false,
	videoBitRate: 50000,
	audioBitRate: 32,
};

module.exports = {
	videoElement,
	startBtn,
	stopBtn,
	videoSelectBtn,
	nextBtn,
	backBtn,
	confirmBtn,
	cancelBtn,
	videoSelectModal,
	videoSelectBox,
	videoBitRateInput,
	audioBitRateInput,
	enableAudioInput,
	videoSelectCard,
	videoOptionsCard,
	settings,
};
