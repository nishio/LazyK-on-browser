goog.provide('nhiro.lazyk.parser');
nhiro.lazyk.parser = (function() {
    var VALID_CHARS = ["S", "K", "I", "(", ")"];
    function _equals(x){
        return (function(y){ return x == y });
    }
    function _is_leaf(x){
        return typeof(x) == "string";
    }

    function get_char(s, i){
        var N = s.length;
        while(i < N){
            var c = s[i];
            if(VALID_CHARS.some(_equals(c))){
                return [c, i + 1];
            }
            i++;
        }
        return [null, i]; // no character left
    }

    function str_to_st(s, i, is_top_level){
        if(i == null) i = 0;
        if(is_top_level == null) is_top_level = true;
        var funcs = [];
        while(true){
            var ret = get_char(s, i)
            var c = ret[0];
            i = ret[1];
            if(c == null){ // no character left
                if(is_top_level){
                    return funcs // successfully finished
                }
                throw "SyntaxError: EOF";
            }

            if(c == "("){
                var ret = str_to_st(s, i, false);
                i = ret[1];
                funcs.push(ret[0]);
            }else if(c == ")"){
                if(is_top_level){
                    throw "too many close-palen";
                }
                return [funcs, i];
            }else{
                funcs.push(c);
            }
        }
    }

    function st_to_ast(tree){
        if(_is_leaf(tree)){
            return tree;
        }
        nhiro.assert(Array.isArray(tree));
        tree = tree.map(st_to_ast);
        var head = tree[0];
        var args = tree.slice(1);
        args.forEach(function(arg){
            head = [head, arg];
        });
        return head;
    }

    function parse(s){
        return st_to_ast(str_to_st(s, 0, true));
    }
    return parse;
})();