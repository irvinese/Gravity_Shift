//This sccript is for playing animations, and loading in the next scene when complete

function startAnimation()
{
    if(backgroundNumber == 0)
    {
        var videoFile0 = 'Animations/GravityShift_Animation_JumpOnBuilding.mp4';
        var video0 = game.add.video('video', videoFile0);
        video0.play(true);

        video0.onComplete.add(function()
         {
            //load BuildingUp scene
         }, this);
    }
    if(backgroundNumber == 1)
    {
        var videoFile1 = 'Animations/GravityShift_Animation_JumpOnRoof.mp4';
        var video1 = game.add.video('video', videoFile1);
        video1.play(true);

        video1.onComplete.add(function()
         {
            //load roof
         }, this);
    }
    if(backgroundNumber == 2)
    {
        var videoFile2 = 'Animations/GravityShift_Animation_JumpOffRoof.mp4';
        var video2 = game.add.video('video', videoFile2);
        video2.play(true);

        video2.onComplete.add(function()
         {
            //load buidlingDown scene
         }, this);
    }
    if(backgroundNumber == 3)
    {
        var videoFile3 = 'Animations/GravityShift_Animation_JumpOffBuilding.mp4';
        var video3 = game.add.video('video', videoFile3);
        video3.play(true);

        video3.onComplete.add(function()
         {
            //load City scene
         }, this);
    }
}