class CityScene extends Phaser.Scene{
    constructor(){
        super({ key: "playGame" });
    }
    init(config){
        this.config = config;
    }

    gravity = 100
    flip = true

    create() {
        let config = this.config;
        //Background
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "StarCity").setOrigin(0, 0);
        this.physics.world.setBounds(0, 0, config.width, config.height, true, true, true, true);

        //Player
        this.player = this.add.sprite(150, config.height/2, "Gravibot");
        this.anims.create({
            key: "Gravibot_anim",
            frames: this.anims.generateFrameNumbers("Gravibot"),
            frameRate: 20,
            repeat: -1
        });

        this.player.play("Gravibot_anim");

        //Hazzards
        this.box = this.physics.add.sprite(config.width, config.height, "Box");
        this.lightpost = this.physics.add.sprite(config.width, 0, "LightPost");

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
        this.background.tilePositionX += 0.5;

        this.hazzard(this.box, -150);
        this.hazzard(this.lightpost, -200);
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
        hazzard.x = this.config.width;
        var randomY = Phaser.Math.Between(0, this.config.height);
        hazzard.y = randomY;
    }
}
