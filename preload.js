class preload extends Phaser.Scene{
    constructor(){
        super("preload")

    }

    preload(){
        const loadingText = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            "Loading...",
            {fontSize: "24px", fill: "#ffffff"}
        ).setOrigin(.5);

        this.load.image("StarCity", "Assets/Backgrounds/GravityShift_CityBackground_Stars.png");
        this.load.image("Box", "Assets/Hazzards/CityHazzard_Box.png");
        this.load.image("LightPost", "Assets/Hazzards/CityHazzard_LightPost.png");
        this.load.spritesheet("Gravibot", "Assets/Player/Gravibot_SpriteSheet.png", {
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