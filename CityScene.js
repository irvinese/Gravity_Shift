const PlayerData = require("./PlayerData.js");

class CityScene extends Phaser.Scene {
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

        //Barrier for bottom of background
        this.bottomBarrier = this.physics.add.staticSprite(width / 2, height, "bottomBarrier");
        this.bottomBarrier.setSize(width, 1); // Set the size to cover the entire width of the scene
        this.bottomBarrier.setVisible(false);

        //barrier for the top of the screen
        this.topBarrier = this.physics.add.staticSprite(width / 2, 0, "topBarrier");
        this.topBarrier.setSize(width, 1); // Set the size to cover the entire width of the scene
        this.topBarrier.setVisible(false);
        

        //Player
        this.player = this.physics.add.sprite(50, height - 50, "Gravibot");
        this.player.setScale(.7);
        this.anims.create({
            key: "Gravibot_anim",
            frames: this.anims.generateFrameNumbers("Gravibot"),
            frameRate: 20,
            repeat: -1
        });

        this.player.play("Gravibot_anim");

        //Collision between player and barrier
        this.physics.add.collider(this.player,[ this.bottomBarrier, this.topBarrier]);

        //Hazzards
        this.box = this.physics.add.sprite(width, height, "Box");
        this.lightpost = this.physics.add.sprite(width, 0, "LightPost");

        //keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.playerScore = this.playerData.loadScore();
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
        console.log("update");
    }
    if (this.cursors.left.isDown) {
        this.movePlayer(-150); // Move left
    } else if (this.cursors.right.isDown) {
        this.movePlayer(250); // Move right
    }
        // Check if player reaches the end
    if (this.player.x >= this.config.width) {
            // Stop the player movement
        this.player.setVelocityX(0);

            // Transition to the next scene
        this.scene.start("BuildingUp");
    }
        this.hazzard(this.box, -150);
        this.hazzard(this.lightpost, -200);

        //Jump Action

    if (this.cursors.up.isDown  && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
    }
}
    movePlayer(velocityX) {
        this.player.setVelocityX(velocityX);
    }
 //Reser hazard position
    resetHazzardPos(hazzard){
        hazzard.x = this.width;
        hazzard.y = Phaser.Math.Between(0, this.height);
    }

    }
    savePlayerScore(score) {
        this.playerScore = score;
        this.playerData.saveScore(score);
    }
    //hazard movement
    hazzard(hazzard, speed){
        hazzard.body.velocity.x = speed;
        if (hazzard.x <= 0) {
            this.resetHazzardPos(hazzard);
        }
    }

