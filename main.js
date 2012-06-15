goog.require('nhiro.V2');


$(function(){
    // forked from daichi1128's "glow effect expriment" http://jsdo.it/daichi1128/k23o
    // forked from daichi1128's "circle" http://jsdo.it/daichi1128/qEJA
    // forked from daichi1128's "gradually slow" http://jsdo.it/daichi1128/1eA1

    /* Animation Utils */
    window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    var NUM = 7;

    function Circle () {
        this.initialize.apply(this,arguments);
    }

    Circle.prototype = {
        initialize : function(x,y) {
            this.x = x;
            this.y = y;
        },
        size : 40,
        r : 0,
        g : 0,
        b : 0,
        speed: 0
    };

    var width,height;
    var circles;
    var maxSpeed = 4;

    var canvas = document.getElementById("world");
    var ctx = canvas.getContext("2d");

    width = canvas.width;
    height = canvas.height;

    function reset_black(){
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,width,height);
        ctx.globalCompositeOperation = "lighter";
    }
    reset_black();

    function draw_circle(){
        var g = ctx.createRadialGradient(c.x,c.y,c.size,c.x,c.y,c.size*2);

        g.addColorStop(0,"rgba(" + c.r + "," + c.g + "," + c.b + "," + 1 +")");
        g.addColorStop(1.0,"rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size*3, 0, Math.PI*2, false);
        ctx.fill();
    }


    var SPLIT_ANGLE = 0.314;
    var START_DIR = (0, -10);
    var SCALE_CHILD = 0.99;
    function rec_draw(tree, pos, dir){
        // treeがstrだったら、その位置に円を書く
        // treeがarrayだったら、その位置に小さな点を書き、2つの子について再帰
    }

});