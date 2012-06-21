goog.provide('main.main');
goog.require('nhiro.V2');
goog.require('nhiro.tree_layout');
goog.require('nhiro.lazyk.parser');

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
    var canvas_width, canvas_height;
    var circles;
    var maxSpeed = 4;
    var canvas;
    var context;
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
        context = canvas.getContext("2d");
        context.strokeStyle = "#a0a0a0";
        canvas_width = canvas.width;
        canvas_height = canvas.height;
        reset_black();

        V = nhiro.V2.make;
        START_DIR = V(0, -10);
        START_POS = V(400, 300);

        var dom_code = $('#code');
        var code = dom_code.val();
        setInterval(function(){
            var _code = dom_code.val();
            if(_code != code){
                code = _code;
                repaint();
            }
        }, 10);

        function adjust_viewport(tree){
            // viewport transform
            var width = tree.bounds.max_x - tree.bounds.min_x + MARGIN;
            var height = tree.bounds.max_y + MARGIN;
            viewport.scale = Math.min(canvas_width / width, canvas_height / height);
            viewport.offset_x = -tree.bounds.min_x + MARGIN / 2
        }

        function repaint(){
            try{
                var ast = nhiro.lazyk.parser(code);
                var tree = nhiro.tree_layout.start(
                    nhiro.tree_layout.make_tree(ast));
                adjust_viewport(tree);
                reset_black();
                rec_draw_tree(tree);
            }catch (e){
                // TODO: show syntax error
            }
        }

        var dom_next = $('#next');
        var i = 0;
        dom_next.click(function(){
            var ast = Voids[i];
            i++;
            var tree = nhiro.tree_layout.start(
                nhiro.tree_layout.make_tree(ast));
            adjust_viewport(tree);
            reset_black();
            rec_draw_tree(tree);
        });
    }

    function reset_black(){
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "black";
        context.fillRect(0,0,canvas_width,canvas_height);
        context.globalCompositeOperation = "lighter";
    }

    function draw_circle(pos, size, color){
        var g = context.createRadialGradient(
            pos.x, pos.y, size,
            pos.x, pos.y, size * 2);

        g.addColorStop(0,"rgba(" + color.r + "," + color.g + "," + color.b + "," + 1 +")");
        g.addColorStop(1.0,"rgba(0,0,0,0)");
        context.fillStyle = g;
        context.beginPath();
        context.arc(pos.x, pos.y, size * 3, 0, Math.PI*2, false);
        context.fill();
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

    var MARGIN = 2;
    function viewport(p){
        return V((p.x + viewport.offset_x) * viewport.scale,
                 (p.y + MARGIN / 2) * viewport.scale);
    }
    function draw_line_to_children(p){
        var from = viewport(p);
        context.beginPath();
        p.children.forEach(function(q){
            var to = viewport(q);
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
        });
        context.stroke();
    }
    function rec_draw_tree(tree){
        var pos = viewport(tree);
        if(tree.value == "*"){
            // draw small circle
            draw_line_to_children(tree);
            // recur children
            rec_draw_tree(tree.children[0]);
            rec_draw_tree(tree.children[1]);
        }else{
            var color = S_COLOR;
            if(tree.value == "K") color = K_COLOR;
            draw_circle(pos, viewport.scale * 0.4, color);
        }
    }

    return main;
})();
