# test id.lazy
code = "I"
import lazyk

tree = [[lazyk.parse(code), lazyk.Input], lazyk.Output]

for i in range(100):
    tree = lazyk.step(tree)
