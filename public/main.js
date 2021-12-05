let sceneLoader = new SceneLoader([],document.body)
games = [{name:"Pong", img:"imgs/Pong.png",id:0, locked:false},{name:"Snake",id:1,locked: false},{name:"Space Invaders",id:2, locked:false}];
//debugging variable
let sceneIndex = 0;

let controlUp = false;
let controlDown = false;
let controlLeft = false;
let controlRight = false;
let controlSpace = false;

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
    '<div id="games">'+

    '</div>'+
    '</div>';
   
    main(){
        let gameList = document.getElementById("games");

        for(let i = 0; i < games.length; i++){
            if(games[i].locked){
                gameList.innerHTML += '<div class="lvlButon"><p>'+games[i].name +'</p> <img src="'+games[i].img +'" class="lvlImg"></div>'
            }else{
                gameList.innerHTML += '<div onclick="pickLvl('+games[i].id+')" class="lvlButon"><p>'+games[i].name +'</p> <img src="'+games[i].img +'" class="lvlImg"></div>'
            }
                
        }
    }
}

class Ray extends GameObject{

}

//Space invaders
class Invader extends GameObject{
    speed = 1; // Ggf. andere Forbewegungsmethode einbauen!
    ray = null;
    canShoot = false;
    //Hier Kollisionslogik mit Geschossen einbauen
    update(bullets){
        this.ray = new Ray(new Vector2(this.pos.x,this.pos.y),new Vector2(5,1000));
        if(this.canShoot && Math.random() > 0.99){
            bullets.push(new Bullet(new Vector2(this.pos.x + this.size.x / 2,this.pos.y + this.size.y),new Vector2(5,20)));
        }
    }

    draw(ctx){
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    }
    
}
class Bullet extends GameObject{
    speed = 3;


    update(){
    }

    draw(ctx){
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y)
    }
    //Form: Quadrat oder rechteck, klein
    //Flugbahn: Linear
    //Logik: TODO

}
class Cannon extends GameObject{
    speed = 6;
    hasShot = false;
    update(bullets){

        if(controlLeft == true){
            this.pos.x += -this.speed;

        }
        if (controlRight == true) {
            this.pos.x += this.speed;
        }

        if(controlSpace && !this.hasShot){
            bullets.push(new Bullet(new Vector2(this.pos.x + this.size.x / 2,this.pos.y),new Vector2(5,20)));
            console.log(bullets);
            //controlSpace = false;
            this.hasShot = true;
        }

        if (!controlSpace && this.hasShot) {
            this.hasShot = false;
        }
        
        
    }

    draw(ctx){
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    }

    // Hier Kollisionslogik mit Geschossen & Invaders einbauen


}
class SpaceInvaders extends Scene {
    dom = '<div class="spaceInvaders-wrapper">'+
    '<canvas id="canvas" width="900" height="700"></canvas>'+
    '</div>';

    mainLoop = null;
    ctx = null;
    canvas = null;

    playerHP = 3;

    playerBullets = [];
    invaderBullets = [];

    invaders = [];
    goseRight = true;
    invaderSpeed = new Vector2(0.1,10);
    invaderDir = new Vector2(1,0);
    cols = 5;
    rows = 11;

    player = new Cannon(new Vector2(30, 80), new Vector2(15,15));

    main(){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.ctx.fillStyle = "white";

        

        

       

        console.log(this.invaders)

        this.reset();

        this.mainLoop = setInterval(()=>{
            this.update();
            this.draw();
        },16)

    }

    update(){
        this.player.update(this.playerBullets);
        this.playerBullets.forEach(b => b.pos.y -= 10);
        this.invaderBullets.forEach(b => b.pos.y += 10);
        if(this.playerHP == 0){
            this.reset();
        }
        for(let i = 0; i < this.playerBullets.length; i++){
            if(this.playerBullets[i].pos.y + this.playerBullets[i].size.y < 0){
                this.playerBullets.splice(i,1);
            }
        }
        for(let i = 0; i < this.invaderBullets.length; i++){
            if(this.invaderBullets[i].pos.y  > this.canvas.height){
                this.invaderBullets.splice(i,1);
            }
        }
        
        this.handleInvaders();
        
    }

    handleInvaders(){
        this.invaders.forEach(inv => inv.update(this.invaderBullets));

        for(let i = 0; i < this.playerBullets.length; i++){
            for(let j = 0; j < this.invaders.length; j++){
                if(this.playerBullets[i].checkColision(this.invaders[j])){
                    this.invaders.splice(j,1);
                    this.playerBullets.splice(i,1);
                    if(this.invaders.length < this.cols * this.rows / 2){
                        this.invaderSpeed.x += 0.2;
                    }
                    break;
                }
            }
        }

        for(let i = 0; i < this.invaders.length; i++){
            for(let j = 0; j < this.invaders.length; j++){
                if(this.invaders[i] !== this.invaders[j]){
                    if(this.invaders[i].ray.checkColision(this.invaders[j])){
                        this.invaders[i].canShoot = false;
                        break;
                    }else{
                        this.invaders[i].canShoot = true;
                    }
                }
            }
        }

        for(let i = 0; i < this.invaders.length; i++){
            this.invaders[i].pos.x += this.invaderDir.x * this.invaderSpeed.x;
            this.invaders[i].pos.y += this.invaderDir.y * this.invaderSpeed.y;
            
        }

        if(this.invaderDir.y == 1 && this.goseRight){
            this.invaderDir = new Vector2(-1,0);
            this.goseRight = false;
            for(let i = 0; i < this.invaders.length; i++){
                this.invaders[i].pos.x -= this.invaderSpeed.x;
            }
        }else if(this.invaderDir.y == 1 && !this.goseRight){
            this.invaderDir = new Vector2(1,0);
            this.goseRight = true;
            for(let i = 0; i < this.invaders.length; i++){
                this.invaders[i].pos.x += this.invaderSpeed.x;
            }
        }

        for(let i = 0; i < this.invaders.length; i++){
            if(this.invaders[i].pos.x + this.invaders[i].size.x > this.canvas.width){
                this.invaderDir = new Vector2(0,1);
                break;
            }
            if(this.invaders[i].pos.x < 0){
                this.invaderDir = new Vector2(0,1);
                break;
            }
        }
    }

    reset(){
        this.player = new Cannon(new Vector2(30, this.canvas.height - this.player.size.y), new Vector2(30,30));
        let invaderOffset = new Vector2((this.canvas.width - 50) / this.rows,(this.canvas.height -300) / this.cols);
        this.playerHP = 3;
        for(let x = 0; x < this.rows; x++){
            for(let y = 0; y < this.cols; y++){
                this.invaders.push(new Invader(new Vector2(invaderOffset.x * x,invaderOffset.y * y + 25),new Vector2(30,30)))
            }
        }
    }

    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.player.draw(this.ctx);
        
        this.invaders.forEach(invader => {
            invader.draw(this.ctx);
        });

        this.playerBullets.forEach(b => b.draw(this.ctx))
        this.invaderBullets.forEach(b => b.draw(this.ctx))
    }
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
            ball.pos.x += ball.dir.x * 8;
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
            if(this.ball.pos.y < 0){
                this.ball.pos.y = 0;
            }
            if(this.ball.pos.y + this.ball.size.y > this.canvas.height){
                this.ball.pos.y = this.canvas.height - this.ball.size.y;
            }
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
            this.score.x = 0;
            this.score.y = 0;
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
        games[1].locked = false;
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

    arrayMinDistance(vectorPoint, vectorArray){
        var currentMin = 100;
        for (let index = 0; index < vectorArray.length; index++) {
            if (Vector2.distance(vectorPoint, vectorArray[index]) < currentMin) {
                currentMin = Vector2.distance(vectorPoint, vectorArray[index]);
            }
            
        }
        return currentMin;
    }
    update(){
        this.points.innerHTML = "Score:" + this.snake.tailLength;

        this.snake.update(this.gridScale);
        if(this.food.checkColision(this.snake)){
            var nextFood = this.getNewFoodPos();
            if (this.snake.tailLength != 0) {
                while (this.arrayMinDistance(nextFood, this.snake.tail)*this.gridScale <= 1*this.gridScale) {
                    nextFood = this.getNewFoodPos();
                }
            }

            this.food.pos = nextFood;
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
        
        if(this.snake.tailLength == 30){
            this.exit();
        }
    }

    draw(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);
    }

    exit(){
        this.snake.tailLength = 0;
        this.snake.tail = [];
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
    let scenes = [new MainScene(), new LvlScene(),new Pong(),new Snake() , new SpaceInvaders()];


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
    sceneLoader.load(id + 2)
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
        case "ArrowUp":
            controlUp = true;
        break;
        case "ArrowDown":
            controlDown = true;
        break;
        case "ArrowLeft":
            controlLeft = true;
        break;
        case "ArrowRight":
            controlRight = true;
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
        case "ArrowUp":
            controlUp = false;
        break;
        case "ArrowDown":
            controlDown = false;
        break;
        case "ArrowLeft":
            controlLeft = false;
            break;
        case "ArrowRight":
            controlRight = false;
            break;
    }
}