let sceneLoader = new SceneLoader([],document.body)
//debuging variable
let sceneIndex = 2;

let controlUp = false;
let controlDown = false;
<<<<<<< HEAD
let controlSpace = false;
=======
>>>>>>> 1727d8d6a24f3e029754ed9561a7e856f4fa439a

class MainScene extends Scene{
    //add html here
    dom = '<div class="mainMenue-wrapper">'+
    '<h1 class="title">Es War Einmal...</h1>'+
    '<button onclick="play()" class="mainMenue-button">Play</button>'+
    '</div>';

    //scene code
    main(){
        
    }
}

class LvlScene extends Scene{
    dom = '<div class="lvlMenue-wrapper">'+
    '<div class="lvlMenue-header">'+
    '<p class="material-icons" onclick="goBack()">exit_to_app</p>'+
    '</div>'+
    '</div>';

    main(){

    }
}
class SpaceInvaders extends Scene {
    dom = '<div class="spaceInvaders-wrapper">'+
    '<canvas id="canvas" width="900" height="700"></canvas>'+
    '</div>';

    main(){


    }
}

class Paddle extends GameObject{

    update(ball){
        if(this.checkColision(ball)){

        }
    }

    draw(ctx){
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    }
}

class Ball extends GameObject{
    vel = new Vector2(0,0)

    update(){
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    draw(ctx){
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    }
}

class Pong extends Scene{
    dom = '<div class="pong-wrapper">'+
    '<canvas id="canvas" width="900" height="700"></canvas>'+
    '</div>';

    mainLoop = null
    ctx = null;
    canvas = null;
    pad1 = new Paddle(new Vector2(0,0),new Vector2(20,120),new Vector2(0,0))
    pad2 = new Paddle(new Vector2(0,0),new Vector2(20,120),new Vector2(0,0))
    ball = new Ball(new Vector2(0,0),new Vector2(10,10))

    main(){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "white"
        
        this.pad1.pos = new Vector2(10,(this.canvas.height / 2) - this.pad1.size.y / 2)
        this.pad2.pos = new Vector2(this.canvas.width - this.pad2.size.x - 10,(this.canvas.height / 2) - this.pad1.size.y / 2)
        this.resetBall()

        this.mainLoop = setInterval(()=>{
            this.update();
            this.draw();
        },16)
        
    }

    update(){
        this.pad1.update(this.ball);
        this.pad2.update(this.ball)
        this.ball.update();
    }

    draw(){
        this.ctx.clearRect(0,0, this.canvas.width,this.canvas.height);
        this.pad1.draw(this.ctx);
        this.pad2.draw(this.ctx);
        this.ball.draw(this.ctx);
    }

    resetBall(){
        this.ball.pos = new Vector2(this.canvas.width / 2 - this.ball.size.x / 2,this.canvas.height / 2 - this.ball.size.y / 2)
    }

    exit(){
        clearInterval(this.mainLoop);
    }
    

}

window.onload = ()=>{
    //add scenes here
    let scenes = [new MainScene(), new LvlScene(),new Pong()];

    wrapper = document.getElementById("wrapper");
    sceneLoader = new SceneLoader(scenes,wrapper);
    
    sceneLoader.load(sceneIndex);
}

function play(){
    sceneLoader.load(1);
}

function goBack(){
    sceneLoader.load(0);
}

function pickLvl(id){
    screen.load(id + 2)
}


document.onkeydown  = e =>{
    switch(e.key){
        case "w":
            controlUp = true;
        break;
        case "s":
            controlDown = true;
        break;
    }
}

document.onkeyup  = e =>{
    switch(e.key){
        case "w":
            controlUp = false;
            
        break;
        case "s":
            controlDown = false;
            break;
    }
}