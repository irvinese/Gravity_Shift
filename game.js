
    var config = {
        width: 1000,
        height: 200,
        scene: [preload, CityScene, BuildingUp, BuildingRoof, BuildingDown],
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade:{
                gravity: {
                    y: 100
                },
                debug: true
            }
        }
    }

    var game = new Phaser.Game(config);

    // Function to update game dimensions
function updateGameDimensions(width, height) {
    config.width = width;
    config.height = height;
    game.scale.resize(width, height);
}