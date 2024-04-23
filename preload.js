class preload extends Phaser.Scene{
    constructor(){
        super("bootGame")
    }

    preload(){
        this.load.image("StarCity", "assets/Backgrounds/GravityShift_CityBackground_Stars.png");
        this.load.image("Box", "assets/Hazzards/CityHazzard_Box.png");
        this.load.image("LightPsot", "assets/Hazzards/CityHazzard_LightPost.png");
        this.load.spritesheet("Gravibot", "assets/Player/Gravibot_SpriteSheet.png", {
            frameWidth: 100,
            frameHeight: 100
        });
    }
}