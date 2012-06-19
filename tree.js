/**
 * Tree Layout
 * http://dirk.jivas.de/papers/buchheim02improving.pdf
 */
 (function(){
     /** Node :: {{value: *, children: Array.<Node>, parent: Node, child_id: number}} */

     function make_tree(arg){
         /** arg :: Array.<arg> */
         if(!Array.isArray(arg)){
             return {value: arg, children: []};
         }
         var tree = {value: "*"};
         var children = [];
         var child_id = 0;
         arg.forEach(function(v){
             var child = make_tree(v);
             child.parent = tree;
             child.child_id = child_id;
             child_id++;
             children.push(child);
         })
         tree.children = children;
         return tree;
     }

     function all_nodes(tree){
         if(is_leaf(tree)){
             return [tree];
         }else{
             var result = [tree];
             tree.children.forEach(function(v){
                 result = [].concat(result, all_nodes(v));
             });
             return result;
         }
     }

     function is_leaf(v){
         return (v.children.length == 0);
     }

     function has_child(v){
         return (v.children.length != 0);
     }

     function get_first_child(v){
         if(is_leaf(v)){
             throw "no children";
         }else{
             return v.children[0];
         }
     }

     function get_last_child(v){
         if(is_leaf(v)){
             throw "no children";
         }else{
             var vs = v.children;
             return vs[vs.length - 1];
         }
     }

     var DEBUG_TREE = make_tree([1, 2, 3]);
     //assert(is_leaf(DEBUG_TREE) == false);
     //console.log(all_nodes(DEBUG_TREE).length == 4);
     //console.log(get_first_child(DEBUG_TREE).value == 1);
     //console.log(get_last_child(DEBUG_TREE).value == 3);

     function tree_layout(tree){
         all_nodes(tree).forEach(function(v){
             v.modifier = 0;
             v.thread = 0;
             v.ancestor = v;
         });
         first_walk(tree);
         second_walk(tree, -tree.prelim);
     }
     tree_layout(DEBUG_TREE);
     function is_first_sibling(v){
         return (v.child_id == 0);
     }

     function get_prev_sibling(v){
         if(v.child_id == 0) throw "no prev sibling";
         return v.parent.children[v.child_id - 1];
     }

     function first_walk(v){
         if(is_leaf(v)){
             v.prelim = 0;
         }else{
             var children = v.children;
             var default_ancestor = get_first_child(v);
             children.forEach(function(w){
                 first_walk(w);
                 apportion(w, default_ancestor);
             });
             execute_shifts(v);
             var midpoint = (
                 get_first_child(v).prelim + get_last_child(v).prelim) / 2;
             if(is_first_sibling(v)){
                 v.prelim = midpoint;
             }else{
                 var w = get_prev_sibling(v);
                 v.prelim = w.prelim + distance;
                 v.modifier = v.prelim - midpoint;
             }
         }
     }

     function getPrelim(v){
         var ret = v.prelim;
         //if(ret == null) debugger;
     }

     function apportion(v, default_ancestor){
         if(is_first_sibling(v)){
             return default_ancestor;
         }
         var w = get_prev_sibling(v);
         var vOPlus = v;
         var vIPlus = v;
         var vOMinus = get_first_child(v.parent);
         var vIMinus = w;

         var sOPlus = vOPlus.modifier;
         var sIPlus = vIPlus.modifier;
         var sOMinus = vOMinus.modifier;
         var sIMinus = vIMinus.modifier;

         var nextRightVIMinus = next_right(vIMinus);
         var nextLeftVIPlus = next_left(vIPlus);

         while (nextRightVIMinus != null && nextLeftVIPlus != null) {
             vIMinus = nextRightVIMinus;
             vIPlus = nextLeftVIPlus;
             vOMinus = next_left(vOMinus);
             vOPlus = next_right(vOPlus);
             vOPlus.ancestor = v;
             var shift = (
                 getPrelim(vIMinus) + sIMinus
                     - (getPrelim(vIPlus) + sIPlus)
                     + getDistance(vIMinus, vIPlus));

             if (shift > 0) {
                 moveSubtree(
                     ancestor(vIMinus, v, parentOfV, defaultAncestor),
                     v, parentOfV, shift);
                 sIPlus = sIPlus + shift;
                 sOPlus = sOPlus + shift;
             }
             sIMinus = sIMinus + vIMinus.modifier;
             sIPlus = sIPlus + vIPlus.modifier;
             sOMinus = sOMinus + vOMinus.modifier;
             sOPlus = sOPlus + vOPlus.modifier;
             nextRightVIMinus = next_right(vIMinus);
             nextLeftVIPlus = next_left(vIPlus);
         }
         if (nextRightVIMinus != null && next_right(vOPlus) == null) {
             vOPlus.thread = nextRightVIMinus;
             vOPlus.modifier = vOPlus.modifier + sIMinus - sOPlus;
         }

         if (nextLeftVIPlus != null && next_left(vOMinus) == null) {
             vOMinus.thread = nextLeftVIPlus;
             vOMinus.modifier = vOMinus.modifier + sIPlus - sOMinus;
             defaultAncestor = v;
         }
         return defaultAncestor;
     }

     function next_left(v){
         if(has_child(v)){
             return get_first_child(v);
         }else{
             return v.thread;
         }
     }

     function next_right(v){
         if(has_child(v)){
             return last_child(v);
         }else{
             return v.thread;
         }
     }

     function move_subtree(w_minus, w_plus, parent, shift){
         var subtrees = get_number(wPlus, parent) - get_number(wMinus, parent);
         wPlus.change = wPlus.change - shift / subtrees;
         wPlus.shift = wPlus.shift + shift;
         wMinus.change = wMinus.change + shift / subtrees;
         wPlus.prelim = wPlus.prelim + shift;
         wPlus.modifier = wPlus.modifier + shift;
     }

     function execute_shifts(v){
         var shift = 0;
         var change = 0;
         v.children.reverse().forEach(function(w){
             prelim[w] = prelim[w] + shift;
             modifier[w] = modifier[w] + shift;
             change += change[w];
             shift += shift[w] + change;
         });
     }

     function get_ancestor(v, w, default_ancestor){
         if(is_sibling(ancestor[v], w)){
             return ancestor[v];
         }else{
             return default_ancestor;
         }
     }

     function second_walk(v, m, level){
         x[v] = prelim[v] + m;
         y[v] = level;
         for(w in get_children(v)){
             second_walk(w, m + modifier[v]);
         }
     }
 })();