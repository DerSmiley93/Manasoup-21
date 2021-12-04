let sceneLoader = new SceneLoader([],document.body)
//debuging variable
let sceneIndex = 2;

let controlUp = false;
let controlDown = false;
let controlSpace = false;


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

class Invader extends GameObject{
    //Hier Kollisionslogik mit Geschossen einbauen

    draw(ctx){
        ctx.fillRect(2,2,2,2);
    }
}

class Bullet extends GameObject{

    //Form: Quadrat oder rechteck, klein
    //Flugbahn: Linear
    //Logik: TODO

}

class Cannon extends GameObject{

    // Hier Kollisionslogik mit Geschossen & Invaders einbauen


}

class Paddle extends GameObject{
    center;
    isbot = false;
    speed = 5;
    update(ball){
        this.center = new Vector2(this.pos.x + this.size.x / 2,this.pos.y + this.size.y / 2);
        if(this.checkColision(ball)){
            ball.dir.x = -ball.dir.x
            ball.dir.y = (ball.pos.y - this.center.y) / 50
        }

        if(controlUp && !this.isbot){
            this.pos.y += -this.speed;
        }else if(controlDown && !this.isbot){
            this.pos.y += this.speed;
        }

        if(this.isbot){
           if(ball.dir.x > 0 && ball.pos.x > 300){
               if(ball.pos.y > this.pos.y + this.size.y / 2){
                   this.pos.y += this.speed / 1.5;
               }else if(ball.pos.y < this.pos.y + this.size.y / 2)
               {
                   this.pos.y += -this.speed / 1.5;
               }
           }
        }
    }

    draw(ctx){
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    }
}

class Ball extends GameObject{
    vle = 7;
    dir = new Vector2(0,0);
    update(){
        this.pos.x += this.dir.normalize().x * this.vle;
        this.pos.y += this.dir.normalize().y * this.vle;
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
    pad1 = new Paddle(new Vector2(0,0),new Vector2(15,120),new Vector2(0,0))
    pad2 = new Paddle(new Vector2(0,0),new Vector2(15,120),new Vector2(0,0))
    ball = new Ball(new Vector2(0,0),new Vector2(15,15))

    main(){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "white"
        
        
        this.pad2.isbot = true;
        
        this.reset()

        this.mainLoop = setInterval(()=>{
            this.update();
            this.draw();
        },16)
        
    }

    update(){
        this.pad1.update(this.ball);
        this.pad2.update(this.ball)
        this.ball.update();

        if(this.ball.pos.y + this.ball.size.y >= this.canvas.height || this.ball.pos.y <= 0){
            this.ball.dir.y = -this.ball.dir.y
        }

        if(this.ball.pos.x < 0){
            this.reset();
        }
        if(this.ball.pos.x + this.ball.size.x > this.canvas.width){
            this.reset();
        }

        if(this.pad1.pos.y < 0){
            this.pad1.pos.y = 0;
        }else if(this.pad1.pos.y > this.canvas.height - this.pad1.size.y){
            this.pad1.pos.y = this.canvas.height - this.pad1.size.y
        }

        if(this.pad2.pos.y < 0){
            this.pad2.pos.y = 0;
        }else if(this.pad2.pos.y > this.canvas.height - this.pad2.size.y){
            this.pad2.pos.y = this.canvas.height - this.pad2.size.y
        }
    }

    draw(){
        this.ctx.clearRect(0,0, this.canvas.width,this.canvas.height);
        this.pad1.draw(this.ctx);
        this.pad2.draw(this.ctx);
        this.ball.draw(this.ctx);
    }

    reset(){
        this.ball.pos = new Vector2(this.canvas.width / 2 - this.ball.size.x / 2,this.canvas.height / 2 - this.ball.size.y / 2);
        this.pad1.pos = new Vector2(10,(this.canvas.height / 2) - this.pad1.size.y / 2);
        this.pad2.pos = new Vector2(this.canvas.width - this.pad2.size.x - 10,(this.canvas.height / 2) - this.pad1.size.y / 2);

        let x = 0;
        if(Math.random() > 0.5){
            x = 1;
        }else{
            x = -1
        }

        this.ball.dir = new Vector2(x,Math.random() * 2 - 1);
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
        case " ":
            controlSpace = true;
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
        case " ":
            controlSpace = false;
        break;
    }
}