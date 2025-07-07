module.exports = function(deltaTime) {
    const seconds = Math.floor(deltaTime / 1000);
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let formattedString = '';

    if (days > 0) {
        formattedString += `${days}d `;
    }
    
    if (hours > 0) {
        formattedString += `${hours}h `;
    }
    
    if (minutes > 0) {
        formattedString += `${minutes}m `;
    }

    if (remainingSeconds > 0 || formattedString === '') {
        formattedString += `${remainingSeconds}s`;
    }

    return formattedString;
}