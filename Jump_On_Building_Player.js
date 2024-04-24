class Jump_On_Building_Player extends Phaser.Scene
{
constructor()
{
    super("JumpOnBuildingAnimation")
}


    create ()
    {
        //  Here we create our video Game Object and then we call `loadURL` to load the video in.
        const video = this.add.video(500, 100);

        video.loadURL('Animations/GravityShift_Animation_JumpOnBuilding.mp4', false);

        video.play(true);
    }
}



