class SceneLoader{
    
    constructor(sceens,wrapperElement){
        this.sceens = sceens;
        this.wrapper = wrapperElement;
    }

    load(index){
        this.wrapper.innerHTML = "";
        this.wrapper.innerHTML = this.sceens[index].dom;
        this.sceens[index].main();
    }
}

class Scene{
    dom = "";

    main(){

    }
}

class Vector2{
    constructor(x,y){
        this.x = x;
        this.y = y;

    }
}