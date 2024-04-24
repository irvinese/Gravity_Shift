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
        this.player.setScale(.7);
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
            this.scene.start("BuildingRoof");
        }, null, this)

        //sets the gravity to the right
        this.physics.world.gravity.x = 100;
    }
    update(){
        //code that moves background
        this.background.tilePositionY -= 1;


        this.hazzard(this.box, -150);
        this.hazzard(this.lightpost, -200);

        //Jump Action
         if (this.cursors.up.isDown  && this.player.body.touching.right)
        {
            this.player.setVelocityX(-330);
        }
       }
    
    
//hazard movement
    hazzard(hazzard, speed){
        hazzard.body.velocity.x = speed;
        if (hazzard.x <= 0) {
            this.resetHazzardPos(hazzard);
        }
    }
 //Reser hazard position
    resetHazzardPos(hazzard){
        hazzard.x = config.width;
        var randomY = Phaser.Math.Between(0, config.height);
        hazzard.y = randomY;
    }
}