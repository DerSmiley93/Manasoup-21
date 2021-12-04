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

    normalize(){
        let vectorLength = Math.sqrt((this.x * this.x)+(this.y * this.y));
        let x_ = this.x / vectorLength;
        let y_ = this.y / vectorLength;
        return new Vector2(x_,y_);
    }

    static distance(a,b){
        
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y))
        
    }
}


class GameObject{
    constructor(pos,size){
        this.pos = pos;
        this.size = size;
    }
    checkColision(other){
        if(other.pos.x + other.size.x > this.pos.x && other.pos.y + other.size.y > this.pos.y && other.pos.y < this.pos.y + this.size.y && other.pos.x < this.pos.x + this.size.x){
            return true;
        }else{
            return false;
        }
    }
}