let shell;
let n = 5;
let jx = 0
let jy = 0
let jn = []
let opts = [1,2,3]
let joining = false
let join = false
let count = 0
let hs =  0
if(JSON.parse(localStorage.getItem('hs')) != null){
    hs = JSON.parse(localStorage.getItem('hs'))
}
const out = document.getElementById('out')
const score = document.getElementById('score')
const HS = document.getElementById('HS')
const PA = document.getElementById('PA')
const moves = document.getElementById('moves')

class Shell{
    constructor(x,y,r){
        this.x = x
        this.y = y
        this.r = r
        this.el = []
    }
    show(){
        noFill()
        strokeWeight(4)
        stroke(255,10,150)
        circle(this.x,this.y,this.r)
        this.el.forEach(e => {
            e.showing()
        });
    }
}

class Node{
    constructor(x,y,r){
        this.x = x
        this.y = y
        this.r = r
        
        this.sp = 8
        this.moving = false
    }
    move(x,y){
        if(this.moving){
            if(abs(this.x - x) < 1 && abs(this.y - y) < 1){
                this.moving = false
                joining = false
                // console.log(f);
            }
            else{
                if(this.x <= x){
                    this.x += abs(this.x - x)/this.sp
                }
                else {
                    this.x -= abs(this.x - x)/this.sp
                }
                if(this.y <= y){
                    this.y += abs(this.y - y)/this.sp
                }
                else {
                    this.y -= abs(this.y - y)/this.sp
                }
            }
        }
    }
}

class Electron extends Node{
    constructor(x,y,r,lvl){
        super(x,y,r)
        this.lvl = lvl
    }
    showing(){
        noStroke()
        fill(this.lvl * 30,10,150)
        circle(this.x,this.y,this.r)
        fill(255)
        textSize(shell.r - (shell.r/1.05))
        textAlign(CENTER)
        text(this.lvl,this.x,this.y + shell.r/50)
    }
}

class Add extends Node{
    constructor(x,y,r){
        super(x,y,r)
        this.value = 0
        this.lvel = 0
        this.indc;
        this.ind = shell.el.indexOf(this)
        this.txt = '+'
    }
    showing(){
        if(this.value != 0 && joining == false){
            this.txt = this.value
            this.lvel = this.value
        }
        noStroke()
        fill(this.lvel * 30,10,150)
        if(this.lvel == 0){
            fill(255,100,0)
        }
        circle(this.x,this.y,this.r)
        fill(255)
        textSize(shell.r - (shell.r/1.05))
        textAlign(CENTER)
        text(this.txt,this.x,this.y + shell.r/50)
        this.add()
    }
    add(){
        this.ind = shell.el.indexOf(this)
        if(!this.moving && this.indc != shell.el.length && this.ind != -1){
            this.indc = shell.el.length
            let m = this.ind - 1
            let n = this.ind + 1
            if(this.ind == 0){
                m = shell.el.length - 1
                n = 1
            }
            else if(this.ind == shell.el.length - 1){
                m = shell.el.length - 2
                n = 0
            }
            if(shell.el.length > 2 && shell.el[m].lvl == shell.el[n].lvl && shell.el[n].lvl != null){
                console.log(this.ind,jn);
                this.value = max(shell.el[m].lvl,this.value) + 1
                if(opts.includes(this.value) == false){
                    opts.splice(opts.length - 2,0,this.value)
                    opts.join()
                }
                jn.push(shell.el[m])
                jn.push(shell.el[n])
                jx = this.x
                jy = this.y
                joining = true
                join = true
                jn.forEach(e => {
                    e.moving = true
                });
            }
            else if(this.value != 0){
                join = false
                console.log(this.value,'AHHHHHHHHHHHHHH');
                shell.el.splice(this.ind,0,new Electron(this.x,this.y,this.r,this.value))
                shell.el.join()
                shell.el.splice(shell.el.indexOf(this),1)
            }
        }
    }
}

function setup(){
    angleMode(DEGREES)
    createCanvas(window.innerWidth - 20,window.innerHeight - 20)
    shell = new Shell(width/2,height/2,max(width,height) / 2.5)
    for(let i = 1; i < n+1; i++){
        shell.el.push(new Electron(shell.x + (shell.r - 1.5*(shell.r - (shell.r/1.125)))/2 * cos(i * floor(360/n)),
        shell.y + (shell.r - 1.5*(shell.r - (shell.r/1.125)))/2 * sin(i * floor(360/n)),shell.r - (shell.r/1.125),floor(random(3))))
    }
    sh = new Electron(shell.x,shell.y,shell.r - (shell.r/1.125),floor(random(3)))
}

function draw(){
    background(20,0,20)
    shell.show()
    let j = 0
    if(!joining){
        if(jn.length > 0){
            jn.forEach(e => {
                shell.el.splice(shell.el.indexOf(e),1)
                n -= 1
                console.log(jn);
            });
            shell.el.forEach(ele => {
                ele.moving = true
            });
            jn = []
        }
        shell.el.forEach((e,i) => {
            j = i + 1
            e.move(floor(shell.x + (shell.r - 1.5*(shell.r - (shell.r/1.125)))/2 * cos(j * (360/n))),floor(shell.y + (shell.r - 1.5*(shell.r - (shell.r/1.125)))/2 * sin(j * (360/n))))
        });
        
    }
    else{
        jn.forEach(e => {
            e.move(jx,jy)
        });
    }
    sh.showing()
    let mrkp = `<div class="spot" style="width:${shell.r - (shell.r/1.025)}px; height:${shell.r - (shell.r/1.025)}px;"></div>`
    moves.innerText = ''
    for(let g = 0; g < 19-n; g++){
        moves.insertAdjacentHTML('beforeend',mrkp)
    }
}

function mouseClicked(){
    if(n <= 18){
        if(join == false){
            let z = [[0,width]]
            let dis = width
            shell.el.forEach((e,i) => {
                if(dist(e.x,e.y,mouseX,mouseY) < dis){
                    dis = dist(e.x,e.y,mouseX,mouseY)
                    z.push([i,dis])
                    if(z.length > 2){
                        z.splice(0,1)
                    }
                    // console.log(z);
                }
                else if(dist(e.x,e.y,mouseX,mouseY) < z[0][1]){
                    z[0] = [i,dist(e.x,e.y,mouseX,mouseY)]
                    // console.log(z,'ELSE IF');
                }
                if(z[0].length == 1){
                    // console.log(z,i,'OHH',width);
                }
            });
            if((z[1][0] == shell.el.length - 1 && z[0][0] == 0) || (z[1][0] == 0 && z[0][0] == shell.el.length - 1)){
                shell.el.splice(0,0,sh)
            }
            else if(z[1][0] > z[0][0]){
                shell.el.splice(z[1][0],0,sh)
            }
            else{
                shell.el.splice(z[0][0],0,sh)
            }
            shell.el.join()
            n += 1
            shell.el.forEach((e) => {
                e.moving = true
                // console.log(floor(shell.x + (shell.r - 1.5*(shell.r - (shell.r/1.125)))/2 * cos(i * floor(360/n))),floor(shell.y + (shell.r - 1.5*(shell.r - (shell.r/1.125)))/2 * sin(i * floor(360/n))));
            });
            if(count == 5){
                sh = new Add(shell.x,shell.y,shell.r - (shell.r/1.125))
                count = 0
            }
            else{
                let optns = []
                opts.forEach(e => {
                    optns.push(new Electron(shell.x,shell.y,shell.r - (shell.r/1.125),e))
                });
                optns.push(new Add(shell.x,shell.y,shell.r - (shell.r/1.125)))
                sh = random(optns)
                if(sh != new Add(shell.x,shell.y,shell.r - (shell.r/1.125))){
                    count += 1
                }
                else{
                    count = 0
                }
            }
        }
    }
    else{
        let max = 0
        for(let i = 0; i < opts.length; i++){
            if(opts[i] > max){
                max = opts[i]
            }
        }
        if(max > hs){
            hs = max
            localStorage.setItem('hs',JSON.stringify(hs))
        }
        score.innerText = `Score : ${max}`
        HS.innerText = `HighScore : ${hs}`
        out.style.display = 'flex'
    }
}

PA.addEventListener('click',()=>{
    location.reload()
})