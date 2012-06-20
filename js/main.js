goog.provide('main.main');
goog.require('nhiro.V2');
goog.require('nhiro.tree_layout');

main.main = (function() {
    // forked from daichi1128's "glow effect expriment" http://jsdo.it/daichi1128/k23o
    // forked from daichi1128's "circle" http://jsdo.it/daichi1128/qEJA
    // forked from daichi1128's "gradually slow" http://jsdo.it/daichi1128/1eA1
    var requestAnimFrame;
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
    var width, height;
    var circles;
    var maxSpeed = 4;
    var canvas;
    var ctx;
    var SPLIT_ANGLE = 3.14 / 2;
    var SCALE_CHILD = 0.99;
    var S_COLOR = {r: 200, g: 100, b: 50};
    var K_COLOR = {r: 100, g: 200, b: 50};
    var V;
    var START_DIR;
    var START_POS;

    function main(){ // return this
        /* Animation Utils */
        requestAnimFrame = (function(){
            return window.requestAnimationFrame   ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        canvas = document.getElementById("world");
        ctx = canvas.getContext("2d");
        width = canvas.width;
        height = canvas.height;
        reset_black();

        V = nhiro.V2.make;
        START_DIR = V(0, -10);
        START_POS = V(400, 300);
        //rec_draw(ast, START_POS, START_DIR, 1);
        rec_draw_tree(
            nhiro.tree_layout.start(
                nhiro.tree_layout.make_tree(ast)));
    }

    function reset_black(){
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,width,height);
        ctx.globalCompositeOperation = "lighter";
    }

    function draw_circle(pos, size, color){
        var g = ctx.createRadialGradient(
            pos.x, pos.y, size,
            pos.x, pos.y, size * 2);

        g.addColorStop(0,"rgba(" + color.r + "," + color.g + "," + color.b + "," + 1 +")");
        g.addColorStop(1.0,"rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size * 3, 0, Math.PI*2, false);
        ctx.fill();
    }



    function test_tree(pos, dir, level){
        if(level == 0) return;
        draw_circle(pos, dir.norm() / 2, S_COLOR);
        var left_dir = dir.rotate(SPLIT_ANGLE);
        test_tree(pos.add(left_dir), left_dir.scale(SCALE_CHILD), level - 1);
        var right_dir = dir.rotate(-SPLIT_ANGLE);
        test_tree(pos.add(right_dir), right_dir.scale(SCALE_CHILD), level - 1);
    }

    function rec_draw(tree, pos, dir, level){
        var split = SPLIT_ANGLE / level;
        if(typeof(tree) == "string"){
            var color = S_COLOR;
            if(tree == "K") color = K_COLOR;
            draw_circle(pos, dir.norm() / 4, color);
        }else{
            // draw small circle
            draw_circle(pos, dir.norm() / 20, S_COLOR);
            // recur children
            var left_dir = dir.rotate(split);
            rec_draw(tree[0], pos.add(left_dir), left_dir.scale(SCALE_CHILD), level + 1);
            var right_dir = dir.rotate(-split);
            rec_draw(tree[1], pos.add(right_dir), right_dir.scale(SCALE_CHILD), level + 1);
        }
    }

    function rec_draw_tree(tree){
        var pos = V(tree.x * 5 + 300, tree.y * 5 + 200);
        if(tree.value == "*"){
            // draw small circle
            draw_circle(pos, 1, S_COLOR);
            // recur children
            rec_draw_tree(tree.children[0]);
            rec_draw_tree(tree.children[1]);
        }else{
            var color = S_COLOR;
            if(tree.value == "K") color = K_COLOR;
            draw_circle(pos, 2, color);
        }
    }

    return main;
})();
