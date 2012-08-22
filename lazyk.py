"""
Lazy-K implementation
"""
import sys

class Function(object):
    def __repr__(self):
        return "<%s>" % self.__class__.__name__

    def __call__(self, x):
        # mocking bird function for sample
        return [x, x]


class Stream(Function):
    """
    (cons X Y) = (lambda (f) (f X Y))
    """
    def __call__(self, f):
        return [[f, self.get_head()], self.get_tail()]


class Increment(Function):
    def __call__(self, n):
        return n + 1

Increment = Increment()


class Output(Function):
    def __call__(self, x):
        charcode = evaluate([[x, Increment], 0])
        sys.stdout.write(chr(charcode))
        return OutputResult

Output = Output() # singleton


class OutputResult(Function):
    def __call__(self, x):
        return [x, Output];

OutputResult = OutputResult() # singleton

def get_char(s, i):
    while i < len(s):
        # xyz are for test
        if s[i] in "SKIxyz()":
            return s[i], i + 1
        i += 1
    return None, i  # no character left


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
        if not c:  # no character left
            if is_top_level:
                return funcs  # successfully finished
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
    return not isinstance(x, list)


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
    if _is_leaf(tree):
        return tree
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
    >>> reduce_node([Function(), "x"]) # sample mocking bird
    ['x', 'x']
    """
    try:
        (i, x) = tree
        if i == "I":
            return x
    except:
        pass  # not match

    try:
        (k, x), y = tree
        if k == "K":
            return x
    except:
        pass  # not match

    try:
        (((s, x), y), z) = tree
        if s == "S":
            return [[x, z], [y, z]]
    except:
        pass  # not match

    try:
        (f, x) = tree
        if isinstance(f, Function):
            return f(x)
    except:
        pass  # not match

    return None


def step(tree):
    """
    step execution: leftmost reduction
    recursive
    not destructive
    if not reduced, return None

    # I is reduced before K (leftmost reduction)
    >>> step(parse("I(KSI)"))
    [['K', 'S'], 'I']

    # SKK = I
    >>> step(parse("SKKx"))
    [['K', 'x'], ['K', 'x']]
    >>> step(_)
    'x'

    # Txy = yx, T = S(K(SI))K
    >>> step(parse("S(K(SI))Kxy"))
    [[[['K', ['S', 'I']], 'x'], ['K', 'x']], 'y']
    >>> step(_)
    [[['S', 'I'], ['K', 'x']], 'y']
    >>> step(_)
    [['I', 'y'], [['K', 'x'], 'y']]
    >>> step(_)
    ['y', [['K', 'x'], 'y']]
    >>> step(_)
    ['y', 'x']
    """
    if _is_leaf(tree):
        return None
    # Is this node reducible?
    ret = reduce_node(tree)
    if ret:
        return ret
    # No, this node is not reducible
    f, x = tree
    # Is left side reducible?
    ret = step(f)
    if ret:
        return [ret, x]
    # No. Is right side reducible?
    ret = step(x)
    if ret:
        return [f, ret]
    # No. Nothing reducible.
    return None


def evaluate(tree, limit=None):
    """
    continue to call 'step'
    """
    step_count = 0
    while limit == None or step_count < limit:
        ret = tree
        tree = step(tree)
        if tree == None:
            return ret
        step_count += 1


def _test():
    import doctest
    doctest.testmod()

if __name__ == "__main__":
    _test()
