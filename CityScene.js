class CityScene extends Phaser.Scene {
    constructor() {
        super("playGame");
        this.gravity = 100;
        this.flip = true;
        this.playerLongitude = null;
        this.isKeyDown = false;
        this.default_longitude = 0;
        this.playerScore = 0; // Initialize player score
    }

    create() {
        this.getUserLocation();
        updateGameDimensions(1000,200);
        //Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "StarCity").setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, config.width, config.height, true, true, true, true);

        //Barrier for bottom of background
        this.bottomBarrier = this.physics.add.staticSprite(config.width / 2, config.height, "bottomBarrier");
        this.bottomBarrier.setSize(config.width, 1); // Set the size to cover the entire width of the scene
        this.bottomBarrier.setVisible(false);

        //barrier for the top of the screen
        this.topBarrier = this.physics.add.staticSprite(config.width / 2, 0, "topBarrier");
        this.topBarrier.setSize(config.width, 1); // Set the size to cover the entire width of the scene
        this.topBarrier.setVisible(false);

        // Left barrier
        this.leftBarrier = this.physics.add.staticSprite(0, config.height / 2, "leftBarrier");
        this.leftBarrier.setSize(1, config.height); // Set the size to cover the entire height of the scene
        this.leftBarrier.setVisible(false);

        //Player
        this.player = this.physics.add.sprite(50, config.height - 50, "Gravibot");
        this.player.setScale(.6);
        this.anims.create({
            key: "Gravibot_anim",
            frames: this.anims.generateFrameNumbers("Gravibot"),
            frameRate: 20,
            repeat: -1
        });

        this.player.play("Gravibot_anim");

        //Collision between player and barrier
        this.physics.add.collider(this.player, this.bottomBarrier);
        this.physics.add.collider(this.player, this.topBarrier);

        //keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        //timer for 15 seconds to change scene
        this.time.delayedCall(15000, () => {
            this.scene.start("BuildingDown");
        }, null, this);

        // Hazard spawning timer
        this.spawnHazardTimer = this.time.addEvent({
            delay: 1550, // Adjust as needed
            loop: true,
            callback: this.spawnHazard,
            callbackScope: this
        });
    }

    update() {
        //code that moves background
        this.background.tilePositionX += 1;

        //Jump Action
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }

        // Quick Descent Action
        if (this.cursors.down.isDown && !this.player.body.touching.down) {
            this.player.setVelocityY(300);
        }
    }

    getUserLocation() {
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

    spawnHazard() {
        // Randomly select hazard type
        const bottomHazardType = Phaser.Math.Between(0, 1); // Box or Antenna
        const topHazardType = 0; // Drone

        // Spawn hazard off-screen to the right
        const hazardX = config.width + 50; // Off the screen on the right side
        const topHazardY = 50; // Specific Y position at the top of the scene
        const bottomHazardY = config.height - 50; // Specific Y position at the bottom of the scene

        let hazardY;
        let hazard;

        // Randomly select between top and bottom positions for hazard Y
        if (Phaser.Math.Between(0, 1) === 0) {
            hazardY = topHazardY;
            hazard = this.physics.add.sprite(hazardX, hazardY, "Drone"); // Spawn Drone at the top
            hazard.body.setSize(hazard.width * 0.7, hazard.height * 0.7);
        } else {
            hazardY = bottomHazardY;
            if (bottomHazardType === 0) {
                hazard = this.physics.add.sprite(hazardX, hazardY, "Box"); // Spawn Box at the bottom
                hazard.body.setSize(hazard.width * 0.7, hazard.height * 0.7);
            } else {
                hazard = this.physics.add.sprite(hazardX, hazardY, "LightPost"); // Spawn Antenna at the bottom
                hazard.body.setSize(hazard.width * 0.7, hazard.height * 0.7);
            }
        }

        // Disable gravity for the hazard
        hazard.body.allowGravity = false;

        // Set velocity for the hazard to move towards the left (adjust speed as needed)
        hazard.setVelocity(-200, 0);

        // Collider with player
        this.physics.add.collider(hazard, this.player, () => {
            this.gameOver(); // Game over when player collides with hazard
        });
    }

    gameOver() {
        this.scene.start("GameOver");
    }

    //Reset hazard position
    resetHazardPos(hazard) {
        hazard.x = config.width;
        hazard.y = Phaser.Math.Between(0, config.height);
    }

    savePlayerScore(score) {
        this.playerScore = score;
        this.playerData.saveScore(score);
    }

    //hazard movement
    hazzard(hazard, speed) {
        hazard.body.velocity.x = speed;
        if (hazard.x <= 0) {
            this.resetHazardPos(hazard);
        }
    }
}
