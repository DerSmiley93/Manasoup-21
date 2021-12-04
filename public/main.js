let sceneLoader = new SceneLoader([],document.body)

class MainScene extends Scene{
    //add html here
    dom = "";
    //scene code
    main(){
        
    }
}

window.onload = ()=>{
    let scenes = [];
    scenes.push(new MainScene());
    wrapper = document.getElementById("wrapper");
    sceneLoader = new SceneLoader(scenes,wrapper);
    
    sceneLoader.load(0);
}