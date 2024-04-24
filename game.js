
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
});