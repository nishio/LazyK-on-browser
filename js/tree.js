/**
 * Tree Layout
 * by NISHIO Hirokazu, GPLv3
 * see http://dirk.jivas.de/papers/buchheim02improving.pdf
 * see http://code.google.com/p/treelayout/source/browse/trunk/org.abego.treelayout/src/main/java/org/abego/treelayout/TreeLayout.java
 */
goog.provide('nhiro.tree_layout');
nhiro.tree_layout = (function() {
    /** Node :: {{value: *, children: Array.<Node>,
                  parent: Node, child_id: number}} */
    // assertions
    function is_number(x) {
        return typeof(x) == 'number' && !isNaN(x);
    }
    function assert_is_number(x) {
        nhiro.assert(is_number(x));
    }
    function is_tree_node(v) {
        return (v.value != null
                && Array.isArray(v.children));
    }
    function assert_is_tree_node(v) {
        nhiro.assert(is_tree_node(v));
    }
    function assert_is_tree_node_or_null(v) {
        nhiro.assert(v == null || is_tree_node(v));
    }

    // accessors
    function set_prelim(v, value) {
        assert_is_tree_node(v);
        assert_is_number(value);
        v.prelim = value;
    }
    function get_prelim(v) {
        assert_is_tree_node(v);
        var ret = v.prelim;
        assert_is_number(ret);
        return ret;
    }
    function get_parent(v) {
        assert_is_tree_node(v);
        return v.parent;
    }
    function get_modifier(v) {
        assert_is_tree_node(v);
        return v.modifier;
    }
    function set_modifier(v, value) {
        assert_is_tree_node(v);
        assert_is_number(value);
        v.modifier = value;
    }
    function get_thread(v) {
        assert_is_tree_node(v);
        return v.thread;
    }
    function set_thread(v, value) {
        assert_is_tree_node(v);
        assert_is_tree_node(value);
        v.thread = value;
    }
    function get_change(v) {
        assert_is_tree_node(v);
        var ret = v.change;
        if (ret == null) ret = 0.0;
        assert_is_number(ret);
        return ret;
    }
    function set_change(v, value) {
        assert_is_tree_node(v);
        assert_is_number(value);
        v.change = value;
    }
    function get_shift(v) {
        assert_is_tree_node(v);
        var ret = v.shift;
        if (ret == null) ret = 0.0;
        assert_is_number(ret);
        return ret;
    }
    function set_shift(v, value) {
        assert_is_tree_node(v);
        assert_is_number(value);
        v.shift = value;
    }
    function get_children(v) {
        assert_is_tree_node(v);
        return v.children;
    };
    function get_distance(v, w) {
        assert_is_tree_node(v);
        assert_is_tree_node(w);
        //double sizeOfNodes = getNodeSize(v) + getNodeSize(w);
        //double distance = sizeOfNodes / 2
        //    + configuration.getGapBetweenNodes(v, w);
        var distance = 1;
        return distance;
    };
    function get_ancestor(v) {
        assert_is_tree_node(v);
        var ret = v.ancestor;
        if (ret == null) ret = v;
        return ret;
    };
    function get_ancestor2(v, w, default_ancestor) {
        if (is_sibling(get_ancestor(v), w)) {
            return get_ancestor(v);
        }else {
            return default_ancestor;
        }
    }
    function set_ancestor(v, w) {
        assert_is_tree_node(v);
        assert_is_tree_node(w);
        v.ancestor = w;
    };
    function get_first_child(v) {
        assert_is_tree_node(v);
        if (is_leaf(v)) {
            throw 'no children';
        }else {
            var ret = v.children[0];
            assert_is_tree_node(ret);
            return ret;
        }
    }
    function get_last_child(v) {
        assert_is_tree_node(v);
        if (is_leaf(v)) {
            throw 'no children';
        }else {
            var vs = get_children(v);
            var ret = vs[vs.length - 1];
            assert_is_tree_node(ret);
            return ret;
        }
    }
    function get_number(v) {
        assert_is_tree_node(v);
        var ret = v.child_id + 1;
        assert_is_number(ret);
        return ret;
    };


    function is_sibling(v, w) {
        assert_is_tree_node(v);
        assert_is_tree_node(w);
        return (v.parent == w.parent);
    };

    function ancestor(vIMinus, v, default_ancestor) {
        assert_is_tree_node(vIMinus);
        assert_is_tree_node(v);
        var ret = get_ancestor(vIMinus);
        var parent = get_parent(v);
        if (!is_sibling(ret, parent)) {
            ret = default_ancestor;
        }
        assert_is_tree_node(ret);
        return ret;
    };

    function make_tree(arg) {
        /** arg :: Array.<arg> */
        if (!Array.isArray(arg)) {
            return {value: arg, children: []};
        }
        var tree = {value: '*'};
        var children = [];
        var child_id = 0;
        arg.forEach(function(v) {
            var child = make_tree(v);
            child.parent = tree;
            child.child_id = child_id;
            child_id++;
            children.push(child);
        });
        tree.children = children;
        return tree;
    }

    function all_nodes(tree) {
        if (is_leaf(tree)) {
            return [tree];
        }else {
            var result = [tree];
            tree.children.forEach(function(v) {
                result = [].concat(result, all_nodes(v));
            });
            return result;
        }
    }

    function is_leaf(v) {
        assert_is_tree_node(v);
        return (v.children.length == 0);
    }

    function has_child(v) {
        assert_is_tree_node(v);
        return (v.children.length != 0);
    }

    function tree_layout(tree) {
        all_nodes(tree).forEach(function(v) {
            v.modifier = 0;
            v.thread = null;
            v.ancestor = v;
        });
        first_walk(tree);
        second_walk(tree, -get_prelim(tree), 0);
        return tree;
    }

    function is_first_sibling(v) {
        return (v.child_id == 0 // first child
                || v.parent == null); // root of tree
    }

    function get_prev_sibling(v) {
        assert_is_tree_node(v);
        if (v.child_id == 0) throw 'no prev sibling';
        return get_parent(v).children[v.child_id - 1];
    }

    function first_walk(v) {
        if (is_leaf(v)) {
            if (!is_first_sibling(v)) {
                var w = get_prev_sibling(v);
                set_prelim(v, get_prelim(w) + get_distance(v, w));
            }else {
                set_prelim(v, 0);
            }
        }else {
            var children = v.children;
            var default_ancestor = get_first_child(v);
            children.forEach(function(w) {
                first_walk(w);
                default_ancestor = apportion(w, default_ancestor);
            });
            execute_shifts(v);
            var first_child = get_first_child(v);
            var last_child = get_last_child(v);
            var midpoint = (
                get_prelim(first_child) + get_prelim(last_child)) / 2;
            if (is_first_sibling(v)) {
                set_prelim(v, midpoint);
            }else {
                var w = get_prev_sibling(v);
                set_prelim(v, get_prelim(w) + get_distance(v, w));
                v.modifier = get_prelim(v) - midpoint;
            }
        }
    }


    function apportion(v, default_ancestor) {
        assert_is_tree_node(v);
        if (is_first_sibling(v)) {
            return default_ancestor;
        }
        var w = get_prev_sibling(v);
        assert_is_tree_node(w);
        var vOPlus = v;
        var vIPlus = v;
        var vOMinus = get_first_child(get_parent(v));
        var vIMinus = w;
        assert_is_tree_node(vOMinus);

        var sOPlus = get_modifier(vOPlus);
        var sIPlus = get_modifier(vIPlus);
        var sOMinus = get_modifier(vOMinus);
        var sIMinus = get_modifier(vIMinus);

        var nextRightVIMinus = next_right(vIMinus);
        var nextLeftVIPlus = next_left(vIPlus);

        while (nextRightVIMinus != null && nextLeftVIPlus != null) {
            vIMinus = nextRightVIMinus;
            assert_is_tree_node(vIMinus);
            vIPlus = nextLeftVIPlus;
            assert_is_tree_node(vIPlus);

            vOMinus = next_left(vOMinus);
            vOPlus = next_right(vOPlus);
            set_ancestor(vOPlus, v);
            var shift = (
                get_prelim(vIMinus) + sIMinus
                    - (get_prelim(vIPlus) + sIPlus)
                    + get_distance(vIMinus, vIPlus));

            if (shift > 0) {
                move_subtree(
                    ancestor(vIMinus, v, default_ancestor),
                    v, get_parent(v), shift);
                sIPlus = sIPlus + shift;
                sOPlus = sOPlus + shift;
            }
            sIMinus = sIMinus + get_modifier(vIMinus);
            sIPlus = sIPlus + get_modifier(vIPlus);
            sOMinus = sOMinus + get_modifier(vOMinus);
            sOPlus = sOPlus + get_modifier(vOPlus);
            nextRightVIMinus = next_right(vIMinus);
            nextLeftVIPlus = next_left(vIPlus);
        }
        if (nextRightVIMinus != null && next_right(vOPlus) == null) {
            set_thread(vOPlus, nextRightVIMinus);
            set_modifier(vOPlus, get_modifier(vOPlus) + sIMinus - sOPlus);
        }

        if (nextLeftVIPlus != null && next_left(vOMinus) == null) {
            set_thread(vOMinus, nextLeftVIPlus);
            set_modifier(vOMinus, get_modifier(vOMinus) + sIPlus - sOMinus);
            default_ancestor = v;
        }
        return default_ancestor;
    }

    function next_left(v) {
        assert_is_tree_node(v);
        var ret;
        if (has_child(v)) {
            ret = get_first_child(v);
        }else {
            ret = get_thread(v);
        }
        assert_is_tree_node_or_null(ret);
        return ret;
    }

    function next_right(v) {
        assert_is_tree_node(v);
        var ret;
        if (has_child(v)) {
            ret = get_last_child(v);
        }else {
            ret = get_thread(v);
        }
        assert_is_tree_node_or_null(ret);
        return ret;
    }

    function move_subtree(wMinus, wPlus, parent, shift) {
        nhiro.assert(wPlus.parent == parent);
        nhiro.assert(wMinus.parent == parent);
        //var subtrees = get_number(wPlus, parent) - get_number(wMinus, parent);
        var subtrees = get_number(wPlus) - get_number(wMinus);
        set_change(wPlus, get_change(wPlus) - shift / subtrees);
        set_shift(wPlus, get_shift(wPlus) + shift);
        set_change(wMinus, get_change(wMinus) + shift / subtrees);
        set_prelim(wPlus, get_prelim(wPlus) + shift);
        set_modifier(wPlus, get_modifier(wPlus) + shift);
    }

    function execute_shifts(v) {
        var shift = 0;
        var change = 0;
        var children = get_children(v);
        children.reverse().forEach(function(w) {
            set_prelim(w, get_prelim(w) + shift);
            set_modifier(w, get_modifier(w) + shift);
            change += get_change(w);
            assert_is_number(change);
            shift += get_shift(w) + change;
            assert_is_number(shift);
        });
        children.reverse();
    }

    function second_walk(v, m, level) {
        v.x = get_prelim(v) + m;
        v.y = level;
        v.children.forEach(function(w) {
            second_walk(w, m + get_modifier(v), level + 1);
        });
    }

    function node_to_str(tree) {
        return '(' + tree.x + ', ' + tree.y + ')';
    }
    function tree_to_str(tree) {
        if (is_leaf(tree)) {
            return node_to_str(tree);
        }else {
            var children = tree.children.map(tree_to_str).join(', ');
            return node_to_str(tree) + '[' + children + ']';
        }
    }

    // test
    nhiro.assert(
        tree_to_str(tree_layout(make_tree([1, 2, [3, 4, 5]]))) ==
            '(0, 0)[(-1, 1), (0, 1), (1, 1)[(0, 2), (1, 2), (2, 2)]]');
})();
