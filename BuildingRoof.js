class BuildingRoof extends Phaser.Scene{
    constructor(){
        super("BuildingRoof");
    }

    gravity = 100
    flip = true

    create() {
        updateGameDimensions(1000,200);
        //Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "BuildingRoof").setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, config.width, config.height, true, true, true, true);

        //Barrier for bottom of background
        this.bottomBarrier = this.physics.add.staticSprite(config.width / 2, config.height, "bottomBarrier");
        this.bottomBarrier.setSize(config.width, 1); // Set the size to cover the entire width of the scene
        this.bottomBarrier.setVisible(false);

        //barrier for the top of the screen
        this.topBarrier = this.physics.add.staticSprite(config.width / 2, 0, "topBarrier");
        this.topBarrier.setSize(config.width, 1); // Set the size to cover the entire width of the scene
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
        this.physics.add.collider(this.player, this.bottomBarrier);
        this.physics.add.collider(this.player, this.topBarrier);
 
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
            this.scene.start("BuildingDown");
        }, null, this)
        // Hazard spawning timer
        this.spawnHazardTimer = this.time.addEvent({
            delay: 1250, // Adjust as needed
            loop: true,
            callback: this.spawnHazard,
            callbackScope: this
        });
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
        if (this.cursors.down.isDown && !this.player.body.touching.down) {
            this.player.setVelocityY(300);
        }
    }
    spawnHazard() {
        // Randomly select hazard type
        const hazardType = Phaser.Math.Between(0, 1);
        
        // Spawn hazard at random position along the right side of the screen
        const hazardX = config.width; // Spawn at the right side of the screen
        const hazardY = Phaser.Math.Between(0, config.height);

        let hazard;

        if (hazardType === 0) {
            hazard = this.physics.add.sprite(hazardX, hazardY, "Box");
        } else {
            hazard = this.physics.add.sprite(hazardX, hazardY, "LightPost");
        }

        // Set leftward velocity for the hazard
        hazard.setVelocity(-650, 0); // Adjust speed as needed

        // Collider between hazard and bottom barrier (unchanged)
        this.physics.add.collider(hazard, this.bottomBarrier, () => {
            hazard.destroy(); // Remove hazard when it collides with bottom barrier
        });
    }
}