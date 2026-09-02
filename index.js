const BACKGROUND = "#101010"
const FOREGROUND = "#50FF50"
const PIXELSIZE = 15

console.log(game)
game.width = 800
game.height = 800
const ctx = game.getContext("2d")
console.log(ctx)

function clear(){
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0,0,game.width,game.height)
}

function point({x,y}) {
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x-(PIXELSIZE/2),y-(PIXELSIZE/2),PIXELSIZE,PIXELSIZE)

}


function screen(p){

    // -1..1 --> 0..2-> 0..1 -> 0..W

    return {
    x:(p.x + 1)/2*game.width,
    y:(1-(p.y + 1)/2)*game.height
    }

}


//(x,y,z)
//x' = x/z
//y' = y/z

function project({x,y,z}){

    return{

        x:x/z,
        y:y/z
    }

}

const FPS=60

let ofsetz = 1;

let ofsetx =1;

let angle = 0

const vs = [
    // corps (boîte) 0-7
    {x:-0.35,y:0.10,z:0.15},
    {x: 0.25,y:0.10,z:0.15},
    {x: 0.25,y:-0.15,z:0.15},
    {x:-0.35,y:-0.15,z:0.15},
    {x:-0.35,y:0.10,z:-0.15},
    {x: 0.25,y:0.10,z:-0.15},
    {x: 0.25,y:-0.15,z:-0.15},
    {x:-0.35,y:-0.15,z:-0.15},

    // tête (boîte) 8-15
    {x:0.28,y:0.42,z:0.12},
    {x:0.55,y:0.42,z:0.12},
    {x:0.55,y:0.18,z:0.12},
    {x:0.28,y:0.18,z:0.12},
    {x:0.28,y:0.42,z:-0.12},
    {x:0.55,y:0.42,z:-0.12},
    {x:0.55,y:0.18,z:-0.12},
    {x:0.28,y:0.18,z:-0.12},

    // oreilles 16-17
    {x:0.36,y:0.62,z:0.09},
    {x:0.36,y:0.62,z:-0.09},

    // pattes (bas) 18-21
    {x:0.18,y:-0.50,z:0.11},
    {x:0.18,y:-0.50,z:-0.11},
    {x:-0.28,y:-0.50,z:0.11},
    {x:-0.28,y:-0.50,z:-0.11},

    // queue 22-25
    {x:-0.40,y:0.12,z:0},
    {x:-0.55,y:0.28,z:0},
    {x:-0.60,y:0.48,z:0},
    {x:-0.48,y:0.60,z:0},
]

const fs = [
    // corps
    [0,1,2,3],[4,5,6,7],
    [0,4],[1,5],[2,6],[3,7],
    // tête
    [8,9,10,11],[12,13,14,15],
    [8,12],[9,13],[10,14],[11,15],
    // cou
    [1,11],[5,15],
    // oreilles
    [8,16],[16,11],[12,17],[17,15],
    // pattes
    [2,18],[6,19],[3,20],[7,21],
    // queue
    [22,23],[23,24],[24,25],
]

function translate_z({x,y,z},ofsetz){
    return {x:x,y:y,z:z+ofsetz}
}

function translate_x({x,y,z},ofsetx){
    return {x:x+ofsetx,y:y,z:z}
}

function rotate_xz({x, y, z}, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
        x: x * c - z * s,
        y,
        z: x * s + z * c,

    };

}

function line(p1,p2){
    ctx.lineWidth = 5
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath()
    ctx.moveTo(p1.x,p1.y)
    ctx.lineTo(p2.x,p2.y)
    ctx.stroke();



}

document.addEventListener("keydown", logKey);

function logKey(e) {

    if (e.code === "ArrowUp"){

        ofsetz-=0.01
    }

    if (e.code === "ArrowDown"){

        ofsetz+=0.01


    }

    if (e.code === "ArrowRight"){

        ofsetx-=0.01
    }

    if (e.code === "ArrowLeft"){

        ofsetx+=0.01


    }

}


function frame(){
    //console.log(ofsetz)
    //ofsetz+=0.01

    if (ofsetz>10){
        ofsetz=0.01

    }
    clear()
    angle += 0.01

    for (let i of vs){
        point(screen(project(translate_x(translate_z(rotate_xz(i,angle),ofsetz),ofsetx))))
    }

    for (let f of fs){

        for (let a =0;a<f.length;a++){

            let aa = vs[f[a]]
           let bb = vs[f[(a+1)%f.length]]

            line(screen(project(translate_x(translate_z(rotate_xz(aa,angle),ofsetz),ofsetx))),
                screen(project(translate_x(translate_z(rotate_xz(bb,angle),ofsetz),ofsetx))))



        }
    }

    setTimeout(frame,1000/FPS)
}

setTimeout(frame,1000/FPS)





