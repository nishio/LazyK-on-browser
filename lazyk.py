"""
Lazy-K implementation
"""
sample_code = file("primes.txt").read().replace("I", "(SKK)")

def get_char(s, i):
    while i < len(s):
        if s[i] in "SKI()":
            return s[i], i + 1
        i += 1
    return None, i # no character left

def parse(s, i=0, is_top_level=True):
    """
    >>> parse("SKI")
    ['S', 'K', 'I']
    >>> parse("S(KI)")
    ['S', ['K', 'I']]
    >>> parse("S(S(KK))")
    ['S', ['S', ['K', 'K']]]
    >>> parse("(")
    Traceback (most recent call last):
    RuntimeError: SyntaxError: EOF
    >>> parse(")")
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

        if c in "SKI":
            funcs.append(c)
        elif c == "(":
            fs, i = parse(s, i, False)
            funcs.append(fs)

        elif c == ")":
            if is_top_level:
                raise RuntimeError("too many close-palen")
            return (funcs, i)

def to_ast(tree):
    """
    change syntac tree into 2-length tuple and literal.
    >>> to_ast(parse("SKI"))
    [['S', 'K'], 'I']
    >>> to_ast(parse("S(KI)"))
    ['S', ['K', 'I']]

    >>> parse("SKIS")
    ['S', 'K', 'I', 'S']
    >>> to_ast(parse("SKIS"))
    [[['S', 'K'], 'I'], 'S']
    """
    if isinstance(tree, str): return tree
    assert isinstance(tree, list)
    tree = map(to_ast, tree)
    head = tree[0]
    args = tree[1:]
    for arg in args:
        head = [head, arg]
    return head

def step():
    """
    leftmost reduction
    TODO
    """

def _test():
    import doctest
    doctest.testmod()

_test()
print to_ast(parse(sample_code))

