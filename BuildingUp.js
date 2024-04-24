class BuildingUp extends Phaser.Scene{
    constructor(){
        super("BuildingUp");
    }

    gravity = 100
    flip = true

    create() {
        //Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "BuildingUp").setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, config.width, config.height, true, true, true, true);

        //Barrier for bottom of background
        this.bottomBarrier = this.physics.add.staticSprite(config.width / 2, config.height, "bottomBarrier");
        this.bottomBarrier.setSize(config.width, 1); // Set the size to cover the entire width of the scene
        this.bottomBarrier.setVisible(false);

        //Player
        this.player = this.physics.add.sprite(50, config.height - 50, "Gravibot");
        this.anims.create({
            key: "Gravibot_anim",
            frames: this.anims.generateFrameNumbers("Gravibot"),
            frameRate: 20,
            repeat: -1
        });

        this.player.play("Gravibot_anim");

        //Collision between player and barrier
        this.physics.add.collider(this.player, this.bottomBarrier);
 
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
    }
    update(){
        if (this.cursors.left.isDown) {
            this.movePlayer(-150); // Move left
        } else if (this.cursors.right.isDown) {
            this.movePlayer(250); // Move right
        }
        // Check if player reaches the end
        if (this.player.x >= config.width) {
            // Stop the player movement
            this.player.setVelocityX(0);

            // Transition to the next scene
            this.scene.start("BuildingRoof");
        }
        this.hazzard(this.box, -150);
        this.hazzard(this.lightpost, -200);
    }
    movePlayer(velocityX) {
        this.player.setVelocityX(velocityX);
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