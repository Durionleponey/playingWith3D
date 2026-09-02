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

let angle = 0


const vs = [
    {x:0.5,y:0.5,z:0.5},
    {x:-0.5,y:0.5,z:0.5},
    {x:-0.5,y:-0.5,z:0.5},
    {x:0.5,y:-0.5,z:0.5},

    {x:0.5,y:0.5,z:-0.5},
    {x:-0.5,y:0.5,z:-0.5},
    {x:-0.5,y:-0.5,z:-0.5},
    {x:0.5,y:-0.5,z:-0.5},

]

const fs = [
    [0,1,2,3],
    [4,5,6,7],
    [0,4],
    [1,5],
    [2,6],
    [3,7]
]

function translate_z({x,y,z},ofsetz){
    return {x:x,y:y,z:z+ofsetz}
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


function frame(){
    //console.log(ofsetz)
    //ofsetz+=0.01

    ofsetz = 2

    if (ofsetz>10){
        ofsetz=0.01

    }
    clear()
    angle += 0.01

    for (let i of vs){
        point(screen(project((translate_z(rotate_xz(i,angle),ofsetz)))))
    }

    for (let f of fs){

        for (let a =0;a<f.length;a++){

            let aa = vs[f[a]]
           let bb = vs[f[(a+1)%f.length]]

            line(screen(project((translate_z(rotate_xz(aa,angle),ofsetz)))),
                screen(project((translate_z(rotate_xz(bb,angle),ofsetz))))
            )


        }
    }

    setTimeout(frame,1000/FPS)
}

setTimeout(frame,1000/FPS)





