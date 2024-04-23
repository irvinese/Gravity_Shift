class preload extends Phaser.Scene{
    constructor(){
        super("bootGame")
    }

    preload(){
        const loadingText = this.add.text(
            config.width / 2,
            config.height / 2,
            "Loading..."
            {fontSize: "24px", fill: "#ffffff"}
        ).setOrigin(.5);

        this.load.image("StarCity", "assets/Backgrounds/GravityShift_CityBackground_Stars.png");
        this.load.image("Box", "assets/Hazzards/CityHazzard_Box.png");
        this.load.image("LightPsot", "assets/Hazzards/CityHazzard_LightPost.png");
        this.load.spritesheet("Gravibot", "assets/Player/Gravibot_SpriteSheet.png", {
            frameWidth: 100,
            frameHeight: 100
        });
        //loading events
        this.load.on("progress", (value) => {
            // Update loading progress
            loadingText.setText(`Loading... ${Math.round(value * 100)}%`);
        });

        this.load.on("complete", () => {
            // Load next scene
            this.scene.start("playGame");
        });

        this.load.on("fileloaderror", (key, file) => {
            console.error(`Error loading file '${key}' at URL '${file.url}'`);
        });
    }
}