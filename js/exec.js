goog.provide('nhiro.lazyk.executer');
nhiro.lazyk.executer = (function() {
    function _is_pair(xs){
        return Array.isArray(xs);
    }
    function reduce_node(tree){
        if(_is_pair(tree)){
            var i = tree[0];
            var x = tree[1];
            if(i == "I"){
                return x;
            }
        }
        if(_is_pair(tree)){
            var t2 = tree[0];
            var y = tree[1];
            if(_is_pair(t2)){
                var k = t2[0];
                var x = t2[1];
                if(k == "K"){
                    return x;
                }
            }
        }
        if(_is_pair(tree)){
            debugger;
            var t2 = tree[0];
            var z = tree[1];
            if(_is_pair(t2)){
                var t3 = t2[0];
                var y = t2[1];
                if(_is_pair(t3)){
                    var s = t3[0];
                    var x = t3[1];
                    if(s == "S"){
                        return [[x, z], [y, z]];
                    }
                }
            }
        }
    }

    function step(tree){
        if(!_is_pair(tree)){
            return null;
        }
        // Is this node reducible?
        var ret = reduce_node(tree);
        if(ret != null){
            return ret;
        }
        // No, this node is not reducible
        var f = tree[0];
        var x = tree[1];
        // Is left side reducible?
        ret = step(f)
        if(ret != null){
            return [ret, x];
        }
        // No. Is right side reducible?
        ret = step(x)
        if(ret != null){
            return [f, ret];
        }
        // No. Nothing reducible.
        return null;
    }

    return {step: step};
})();