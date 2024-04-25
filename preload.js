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

        this.load.image("StarCity", "assets/Backgrounds/GravityShift_CityBackground_Stars.png");
        this.load.image("BuildingUp", "Assets/Backgrounds/GravityShift_BuildingUp_Stars.png");
        this.load.image("BuildingRoof", "Assets/Backgrounds/GravityShift_BuildingRoof_Stars.png");
        this.load.image("BuildingDown", "Assets/Backgrounds/GravityShift_BuildingDown.png");
        this.load.image("Box", "Assets/Hazzards/CityHazzard_Box.png");
        this.load.image("LightPost", "Assets/Hazzards/CityHazzard_LightPost.png");
        this.load.image("Drone", "Assets/Hazzards/FlyingHazzard_Drone_Position1 (1).png");
        this.load.image("Antenna", "Assets/Hazzards/RoofHazzard_AntennaThing.png");
        this.load.image("Evil", "Assets/Hazzards/SideBuildingHazzard_EvilGraviBot.png");
        this.load.image("Suctioncup_Man", "Assets/Hazzards/SideBuildingHazzard_SuctionCupMan.png")
        this.load.spritesheet("Gravibot", "Assets/Player/Gravibot_SpriteSheet_RemoveBackground.png", {
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