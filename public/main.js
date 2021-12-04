let sceneLoader = new SceneLoader([],document.body)
//debuging variable
let sceneIndex = 3;

let controlUp = false;
let controlDown = false;
let controlLeft = false;
let controlRight = false;
let controlSpace = false;
let controlLeft = false;
let controlRight = false;

//UI
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


//Space invaders
class SpaceInvaders extends Scene {
    dom = '<div class="spaceInvaders-wrapper">'+
    '<canvas id="canvas" width="900" height="700"></canvas>'+
    '</div>';

    main(){


    }
}
class Invader extends GameObject{
    //Hier Kollisionslogik mit Geschossen einbauen
    
    
}
class Bullet extends GameObject{

    //Form: Quadrat oder rechteck, klein
    //Flugbahn: Linear
    //Logik: TODO

}
class Cannon extends GameObject{

    // Hier Kollisionslogik mit Geschossen & Invaders einbauen


}


//Pong
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

        if(controlUp && !this.isbot){ // Steuerung des Paddles
            this.pos.y += -this.speed;
        }else if(controlDown && !this.isbot){
            this.pos.y += this.speed;
        }

        if(this.isbot){ //KI-Logik - Funktioniert nur für eine Seite
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
    pad1 = new Paddle(new Vector2(0,0),new Vector2(15,120))
    pad2 = new Paddle(new Vector2(0,0),new Vector2(15,120))
    ball = new Ball(new Vector2(0,0),new Vector2(15,15))
    score = new Vector2(0,0);

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
            this.score.x += 1;
        }
        if(this.ball.pos.x + this.ball.size.x > this.canvas.width){
            this.score.y += 1;
            this.reset();
        }

        if(this.score.y == 10){
            this.exit();   
        }
        
        if(this.score.x == 10){
            this.score.x == 0
            this.score.y == 0;
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
        this.ctx.font = '50px san-serif'
        this.ctx.fillText(String(this.score.y),60,50,600)
        this.ctx.fillText(String(this.score.x),this.canvas.width - 80,50,600)
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
        sceneLoader.load(1);
    }
    

}

//Snake
class Snake extends Scene{
    dom = '<div class="pong-wrapper">'+
    '<canvas id="canvas" width="600" height="600"></canvas> <p id="score" style="width:100px; margin: 10px; font-size:30px">Score:0</p>'+
    '</div>';
    points = null;
    food = new Food(new Vector2(0,0),new Vector2(20,20));
    snake = new SnakeBody(new Vector2(80,80),new Vector2(20,20));

    gridScale = 20;
    mainLoop = null;
    canvas = null;
    ctx = null;
    main(){
        this.points = document.getElementById("score");
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.food.pos = this.getNewFoodPos();
        this.mainLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 100);
    }

    getNewFoodPos(){
        let cols = Math.floor(this.canvas.width / this.gridScale);
        let rows = Math.floor(this.canvas.height / this.gridScale);

        let gridPos = new Vector2(Math.floor(Math.random() * cols),Math.floor(Math.random() * rows));

        return new Vector2(gridPos.x * this.gridScale, gridPos.y * this.gridScale);
    }

    update(){
        this.points.innerHTML = "Score:" + this.snake.tailLength;

        this.snake.update(this.gridScale);
        if(this.food.checkColision(this.snake)){
            this.food.pos = this.getNewFoodPos();
            this.snake.tailLength++;
            this.snake.tail.push(new Vector2(this.snake.pos));
        }
        

        if(this.snake.pos.x >= this.canvas.width){
            this.snake.pos.x = 0;
        }else if(this.snake.pos.x < 0){
            this.snake.pos.x = this.canvas.width - this.gridScale;
        }
        if(this.snake.pos.y >= this.canvas.height){
            this.snake.pos.y = 0;
        }else if(this.snake.pos.y < 0){
            this.snake.pos.y = this.canvas.height - this.gridScale;
        }
        
        if(this.snake.tailLength > 19){
            this.exit();
        }
    }

    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);
    }

    exit(){
        clearInterval(this.mainLoop);
        sceneLoader.load(1);
    }
}

class Food extends GameObject{
    
    draw(ctx){
        ctx.fillStyle = "red"
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    }
}

class SnakeBody extends GameObject{
    dir = new Vector2(1,0);
    tail = [];
    tailLength = 0;

    update(scale){
        
       

        for(let i = 0; i < this.tailLength-1; i++){
            this.tail[i] = this.tail[i+1];
        }
        this.tail[this.tailLength-1] = new Vector2(this.pos.x,this.pos.y);
        
        

        this.pos.x += this.dir.x * scale;
        this.pos.y += this.dir.y * scale;

        for(let i = 0; i < this.tailLength; i++){
            if(Vector2.distance(this.tail[i],this.pos) < 1){
                this.tailLength = 0;
                this.tail = [];
                break;
            }
        }
        

        if(controlLeft && this.dir.x != 1){
            this.dir = new Vector2(-1,0);
        }else if(controlDown && this.dir.y != -1){
            this.dir = new Vector2(0,1);
        }else if(controlRight && this.dir.x != -1){
            this.dir = new Vector2(1,0);
        }else if(controlUp && this.dir.y != 1){
            this.dir = new Vector2(0,-1);
        }
    }

    draw(ctx){
        ctx.fillStyle ="white"
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
        for(let i = 0; i < this.tailLength; i++){
            ctx.fillRect(this.tail[i].x,this.tail[i].y,20,20);
        }
    }
}

window.onload = ()=>{
    //add scenes here
    let scenes = [new MainScene(), new LvlScene(),new Pong(), new Snake()];

    wrapper = document.getElementById("wrapper");
    sceneLoader = new SceneLoader(scenes,wrapper);
    
    sceneLoader.load(sceneIndex);
}
//event handler
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
        case "a":
            controlLeft = true;
        break;
        case "d":
            controlRight = true;
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
        case "a":
            controlLeft = false;
            break;
        case "d":
            controlRight = false;
            break;
        case " ":
            controlSpace = false;
        break;
    }
}