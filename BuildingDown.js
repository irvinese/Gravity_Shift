class BuildingDown extends Phaser.Scene{
    constructor(){
        super("BuildingDown");
    }

    gravity = 100
    flip = true

    create() {
        updateGameDimensions(200, 1000);
        //Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "BuildingDown").setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, config.width, config.height, true, true, true, true);

        //Barrier for bottom of background
        this.bottomBarrier = this.physics.add.staticSprite(config.width / 2, config.height, "bottomBarrier");
        this.bottomBarrier.setSize(config.width, 1); // Set the size to cover the entire width of the scene
        this.bottomBarrier.setVisible(false);

        //barrier for the top of the screen
        this.topBarrier = this.physics.add.staticSprite(config.width / 2, 0, "topBarrier");
        this.topBarrier.setSize(config.width, 1); // Set the size to cover the entire width of the scene
        this.topBarrier.setVisible(false);

         // Right barrier
    this.rightBarrier = this.physics.add.staticSprite(config.width, config.height / 2, "rightBarrier");
    this.rightBarrier.setSize(1, config.height); // Set the size to cover the entire height of the scene
    this.rightBarrier.setVisible(false);
 
         // Left barrier
     this.leftBarrier = this.physics.add.staticSprite(0, config.height / 2, "leftBarrier");
     this.leftBarrier.setSize(1, config.height); // Set the size to cover the entire height of the scene
     this.leftBarrier.setVisible(false);

        //Player
        this.player = this.physics.add.sprite(50, 50, "Gravibot");
        this.player.setScale(.6);
        this.player.setRotation(Math.PI / 2);
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
 
        //Hazzards
        this.box = this.physics.add.sprite(config.width, config.height, "Box");
        this.lightpost = this.physics.add.sprite(config.width, 0, "LightPost");

        //keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();

        window.onkeydown = e => {
            if (e.keyCode === 32 && !this.isKeyDown){
                this.gravity *= -1
                this.player.setGravityY(this.gravity);
                if (this.flip){
                    this.flip = false;
                } 
                else {
                    this.flip = true;
                }
                this.player.flipY = this.flip;
                this.isKeyDown = true;
            }
        };

        //timer for 15 seconds to change scene
        this.time.delayedCall(15000, () => {
            this.scene.start("playGame");
        }, null, this)

        //sets the gravity to the left
        this.physics.world.gravity.y = -100; // Vertical gravity
        this.physics.world.gravity.x = -100; // Horizontal gravity

        this.spawnHazardTimer = this.time.addEvent({
            delay: 1000, // Adjust as needed
            loop: true,
            callback: this.spawnHazard,
            callbackScope: this
        });
    }
    update(){
        //code that moves background
        this.background.tilePositionY += 1;

        //Jump Action
         if (this.cursors.up.isDown  && this.player.body.touching.left)
        {
            this.player.setVelocityX(400);
        }
         // Quick Descent Action
         if (this.cursors.down.isDown && !this.player.body.touching.left) {
            this.player.setVelocityX(-400);
        }
    }
    spawnHazard() {
        //Randomly select hazard type
        const hazardType = Phaser.Math.Between(0, 1);
        
        // Spawn hazard at random position along the bottom of the screen
        const hazardX = Phaser.Math.Between(0, config.width);
        const hazardY = config.height; // Spawn at the bottom of the screen

        let hazard;

        if (hazardType === 0) {
            hazard = this.physics.add.sprite(hazardX, hazardY, "Box");
        } else {
            hazard = this.physics.add.sprite(hazardX, hazardY, "LightPost");
        }

        // Set upward velocity for the hazard
        hazard.setVelocity(20, -500); // Adjust speed as needed

        // Collider between hazard and top barrier (unchanged)
        this.physics.add.collider(hazard, this.topBarrier, () => {
            hazard.destroy(); // Remove hazard when it collides with top barrier
        });
    }
}