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

class Pong extends Scene{
    dom = '<div class="pong-wrapper">'+
    '<canvas id="canvas" width="900" height="700"></canvas>'+
    '</div>';
    
    main(){

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