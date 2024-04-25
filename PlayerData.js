class PlayerData {
    constructor() {
    }
    saveScore(score) {
        localStorage.setItem('playerScore', score);
    }
    loadScore() {
        return parseInt(localStorage.getItem('playerScore')) || 0;
    }
    saveSettings(settings) {
        localStorage.setItem('playerSettings', JSON.stringify(settings));
    }
    loadSettings() {
        return JSON.parse(localStorage.getItem('playerSettings')) || {};
    }
    clearPlayerData() {
        localStorage.removeItem('playerScore');
        localStorage.removeItem('playerSettings');
    }
}
export default PlayerData;
