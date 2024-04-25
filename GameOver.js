class GameOver extends Phaser.Scene{
    constructor(){
        super("GameOver");
    }

    create()
    {
        this.playAgain = this.add.sprite(config.width/2,config.height/2,"PlayAgainButton").setOrigin(0.5,0.5);
        //enable for input
        this.playAgain.inputEnabled=true;
        //add an event listener
        this.playAgain.setInteractive().on("pointerdown", () => this.restartGame())
    }
    
    restartGame()
    {
        //restart the game by starting stateMain
        this.scene.start("playGame");
    }
}