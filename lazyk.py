"""
Lazy-K implementation
"""
sample_code = file("primes.txt").read().replace("I", "(SKK)")

def get_char(s, i):
    while i < len(s):
        if s[i] in "SKIxyz()":
            return s[i], i + 1
        i += 1
    return None, i # no character left

def str_to_st(s, i=0, is_top_level=True):
    """
    >>> str_to_st("SKI")
    ['S', 'K', 'I']
    >>> str_to_st("S(KI)")
    ['S', ['K', 'I']]
    >>> str_to_st("S(S(KK))")
    ['S', ['S', ['K', 'K']]]
    >>> str_to_st("(")
    Traceback (most recent call last):
    RuntimeError: SyntaxError: EOF
    >>> str_to_st(")")
    Traceback (most recent call last):
    RuntimeError: too many close-palen
    """
    funcs = []
    while True:
        c, i = get_char(s, i)
        if not c: # no character left
            if is_top_level:
                return funcs # successfully finished
            raise RuntimeError("SyntaxError: EOF")

        if c == "(":
            fs, i = str_to_st(s, i, False)
            funcs.append(fs)

        elif c == ")":
            if is_top_level:
                raise RuntimeError("too many close-palen")
            return (funcs, i)

        else:
            funcs.append(c)


def _is_leaf(x):
    return isinstance(x, str)


def to_ast(tree):
    """
    change syntac tree into 2-length tuple and literal.
    >>> to_ast(str_to_st("SKI"))
    [['S', 'K'], 'I']
    >>> to_ast(str_to_st("S(KI)"))
    ['S', ['K', 'I']]

    >>> str_to_st("SKIS")
    ['S', 'K', 'I', 'S']
    >>> to_ast(str_to_st("SKIS"))
    [[['S', 'K'], 'I'], 'S']
    """
    if _is_leaf(tree): return tree
    assert isinstance(tree, list)
    tree = map(to_ast, tree)
    head = tree[0]
    args = tree[1:]
    for arg in args:
        head = [head, arg]
    return head

def parse(s):
    return to_ast(str_to_st(s))


def reduce_node(tree):
    """
    >>> reduce_node(parse("KSI"))
    'S'
    >>> reduce_node(parse("SISK"))
    [['I', 'K'], ['S', 'K']]
    >>> reduce_node(parse("IS"))
    'S'
    >>> reduce_node(parse("SI")) # None returns
    """
    try:
        (i, x) = tree
        if i == "I":
            return x
    except:
        pass # not match

    try:
        (k, x), y = tree
        if k == "K":
            return x
    except:
        pass # not match

    try:
        (((s, x), y), z) = tree
        if s == "S":
            return [[x, z], [y, z]]
    except:
        pass # not match

    return tree

def _test():
    import doctest
    doctest.testmod()

_test()


