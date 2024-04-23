import PlayerData from './playerData.js';

class CityScene extends Phaser.Scene{
    constructor(){
        super({ key: "playGame" });
        this.gravity = 100;
        this.flip = true;
        this.playerLongitude = null;
        this.isKeyDown = false;
        this.default_longitude = 0;
        this.playerData = new PlayerData(); 
        this.playerScore = this.playerData.loadScore();
    }

    init(config){
        this.config = config;
    }

    create() {
        const {width, height} = this.config;
        this.getUserLocation();
        //Background
        this.background = this.add.tileSprite(0, 0, width, height, "StarCity").setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, width, height, true, true, true, true);

        //Player
        this.player = this.add.sprite(150, height/2, "Gravibot");
        this.anims.create({
            key: "Gravibot_anim",
            frames: this.anims.generateFrameNumbers("Gravibot"),
            frameRate: 20,
            repeat: -1
        });

        this.player.play("Gravibot_anim");

        //Hazzards
        this.box = this.physics.add.sprite(width, height, "Box");
        this.lightpost = this.physics.add.sprite(width, 0, "LightPost");

        window.addEventListener("keydown", this.handleKeyDown.bind(this));

        this.playerScore = loadScore();
    }

    update(){
        this.background.tilePositionX += 0.5;
        if (this.playerLongitude !== null) {
            this.moveHazards();
    }
}

getUserLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const longitude = position.coords.longitude;
                this.playerLongitude = longitude;
                this.moveHazards();
            }, 
            error => {
                console.error("Error getting user location: ", error);
                this.playerLongitude = this.default_longitude;
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        this.playerLongitude = this.default_longitude;
    }
}

handleKeyDown(event) {
    if(event.keyCode === 32 && !this.isKeyDown) {
        this.gravity *= -1;
        this.player.setGravityY(this.gravity);
        this.flip = !this.flip;
        this.player.flipY = this.flip;
        this.isKeyDown = true;
    }
}

moveHazards() {
    const hazardSpeeds = { box: -150, lightpost: -200 };

    for (const hazard of [this.box, this.lightpost]) {
        hazard.body.velocity.x = hazardSpeeds[hazard.name];
        if (hazard.x <= 0) {
            this.resetHazardPos(hazard);
        }
    }
}

 //Reser hazard position
    resetHazzardPos(hazzard){
        hazzard.x = this.config.width;
        var randomY = Phaser.Math.Between(0, this.config.height);
        hazzard.y = randomY;
    }
    savePlayerScore(score) {
        this.playerScore = score;
        saveScore(score);
    }
}
