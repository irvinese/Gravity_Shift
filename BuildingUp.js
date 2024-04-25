class BuildingUp extends Phaser.Scene{
    constructor(){
        super("BuildingUp");
    }

    gravity = 100
    flip = true

    create() {
        updateGameDimensions(200, 1000);


        //Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "BuildingUp").setOrigin(0, 0);
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

    // Right barrier
    this.rightBarrier = this.physics.add.staticSprite(config.width, config.height / 2, "rightBarrier");
    this.rightBarrier.setSize(1, config.height); // Set the size to cover the entire height of the scene
    this.rightBarrier.setVisible(false);

        //Player
        this.player = this.physics.add.sprite(50, config.height - 50, "Gravibot");
        this.player.setScale(.6);
        this.player.setRotation(-Math.PI / 2);
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
        this.physics.add.collider(this.player, this.leftBarrier);
        this.physics.add.collider(this.player, this.rightBarrier);

        //keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();


        //timer for 15 seconds to change scene
        this.time.delayedCall(15000, () => {
            this.scene.start("BuildingRoof");
        }, null, this)

        //sets the gravity to the right
        this.physics.world.gravity.x = 100;

        this.spawnHazardTimer = this.time.addEvent({
            delay: 1500, // Adjust as needed
            loop: true,
            callback: this.spawnHazard,
            callbackScope: this
        });
    }
    update(){
        //code that moves background
        this.background.tilePositionY -= 1;

        //Jump Action
         if (this.cursors.up.isDown  && this.player.body.touching.right)
        {
            this.player.setVelocityX(-400);
        }
        // Quick Descent Action
        if (this.cursors.down.isDown && !this.player.body.touching.right) 
        {
            this.player.setVelocityX(400); // Downward velocity for quick descent
        }
       }
       spawnHazard() {
        // Randomly select hazard type
        const bottomHazardType = Phaser.Math.Between(0, 1); // Box or Antenna
        const topHazardType = 0; // Drone
    
        // Spawn hazard off-screen to the right
        const topHazardX = config.width - 150;
        const bottomHazardX = config.width - 50; // Right edge of the scene
        const topHazardY = 50; // Specific Y position at the top of the scene
        const bottomHazardY = 0; // Specific Y position at the bottom of the scene
    
        let hazardY;
        let hazard;
    
        // Randomly select between top and bottom positions for hazard Y
        if (Phaser.Math.Between(0, 1) === 0) {
            hazardY = topHazardY;
            hazard = this.physics.add.sprite(topHazardX, hazardY, "Drone"); // Spawn Drone at the top
            hazard.body.setSize(hazard.width * 0.7, hazard.height * 0.7);
        } else {
            hazardY = bottomHazardY;
            if (bottomHazardType === 0) {
                hazard = this.physics.add.sprite(bottomHazardX, hazardY, "Evil"); // Spawn Box at the bottom
                hazard.setRotation(-Math.PI / 2);
                hazard.setFlipX(true);
                hazard.body.setSize(hazard.width * 0.7, hazard.height * 0.7);
            } else {
                hazard = this.physics.add.sprite(bottomHazardX, hazardY, "Suctioncup_Man"); // Spawn Antenna at the bottom
                hazard.setScale(.25);
                hazard.body.setSize(hazard.width * 0.7, hazard.height * 0.7);
            }
        }
    
        // Disable gravity for the hazard
        hazard.body.allowGravity = false;
    
        // Set velocity for the hazard to move towards the left (adjust speed as needed)
        hazard.setVelocity(0, 200);

        this.physics.add.collider(hazard, this.player, (hazard, player) => {
            hazard.destroy();
            player.setVelocityX(0); // Freeze player's X-axis movement
        });
    }
    
    
    
}