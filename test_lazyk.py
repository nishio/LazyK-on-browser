import lazyk
sample_code = file("primes.txt").read().replace("I", "(SKK)")
tree = lazyk.parse(sample_code)
while tree:
    print tree
    print
    tree = lazyk.step(tree)
