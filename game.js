const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

let frames = 0;
const DEGREE = Math.PI/180;

const sprite = new Image();
sprite.src = "img/sprite.png";

const bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: cvs.height - 226,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }

}


// GAME STATE
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}
// CONTROL THE GAME
cvs.addEventListener("click", function (evt) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            state.current = state.getReady;
            break;
    }
});

const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,

    dx: 2,

    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    // chuyển động chính
    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
}

const bird = {
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    frame: 0,

    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,

    draw: function () {
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x,this.y); // chuyển động chính
        ctx.rotate(this.rotation); // chuyển động chính
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w / 2, - this.h / 2, this.w, this.h);
        ctx.restore();
    },
    flap: function () {
        // if (state.current == state.getReady) {
        //     ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        // }
        this.speed = - this.jump;
    },
    update: function(){

        this.period = state.current == state.getReady ? 10 : 5;

        this.frame += frames%this.period == 0 ? 1 : 0;

        this.frame = this.frame%this.animation.length;


        if(state.current == state.getReady){
            this.y = 150; 
            this.rotation = 0 * DEGREE; // chuyển động chính
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    
                }
            }
            // Nếu tốc độ lớn hơn độ nhảy thì thua 
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame=1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }

    }

}

const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width / 2 - 173 / 2,
    y: 80,

    draw: function () {
        if (state.current == state.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }

    }
}
// GAME OVER MESSAGE
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width / 2 - 225 / 2,
    y: 90,

    draw: function () {
        if (state.current == state.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}


function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    //


}

// UPDATE
function update() {
    bird.update();
    fg.update(); // chuyển động chính

}

// LOOP
function loop() {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();
