var canvas;
var ctx;
var animID = 0;

function Coords(x, y) {
    this.x = x;
    this.y = y;
}

function Sandbox() {
    canvas = $('canvas#sandbox')[0];
    ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 500, 800);
    this.objects = [
        new ball(10, 'white', new coords(10, 50)),
        new ball(11, 'blue', new coords(15, 20)), 
        new ball(30, 'gray', new coords(50, 70)),
        new square(30, 30, "purple", new coords(50, 60))
    ];
    animID = window.requestAnimationFrame(this.gameLoop);
    sys.WriteLine("Sandbox, loaded.");
}

/*
function Object() {

}
*/
 
Object.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.colour;
    switch(this.constructor.name) {
        case "ball":
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
        break;
        case "square":
            ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
        break;
    }
};

Ball.prototype = new Object();
Ball.prototype.constructor = Ball;
function Ball(radius, colour, pos) {
    this.radius = radius;
    this.colour = colour;
    this.pos = pos;
}

Square.prototype = new Object();
Square.prototype.constructor = Square;
function Square(width, height, colour, pos) {
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.pos = pos;
}

Sandbox.prototype.gameLoop = function(time) {
    for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].draw();
    }
    animID = window.requestAnimationFrame(this.gameLoop);
};