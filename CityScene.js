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
        updateGameDimensions(1000, 200);
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
        this.physics.add.collider(this.player,[ this.bottomBarrier, this.topBarrier]);


        //keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.box = this.physics.add.sprite(config.width, config.height, "Box");
        this.lightpost = this.physics.add.sprite(config.width, 0, "LightPost");

        //timer for 15 seconds to change scene
        this.time.delayedCall(15000, () => {
            this.scene.start("BuildingUp");
        }, null, this)

        // Hazard spawning timer
        this.spawnHazardTimer = this.time.addEvent({
            delay: 1900, // Adjust as needed
            loop: true,
            callback: this.spawnHazard,
            callbackScope: this
        });

        window.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.playerScore = this.playerData.loadScore();
    }

    update(){
        //code that moves background
        this.background.tilePositionX += 1;

        //Jump Action
         if (this.cursors.up.isDown  && this.player.body.touching.down)
        {
            this.player.setVelocityY(-400);
        }
        // Quick Descent Action
        if (this.cursors.down.isDown && !this.player.body.touching.down) 
        {
            this.player.setVelocityY(300);
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

        this.physics.add.collider(hazard, this.player, (hazard, player) => {
            hazard.destroy();
            player.setVelocityX(0); // Freeze player's X-axis movement
        });

        this.physics.add.collider(hazard, this.player, () => {
            this.gameOver(); // Game over when player collides with hazzard
        });
    }

    gameOver() {
        this.scene.start("GameOver");
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
}
