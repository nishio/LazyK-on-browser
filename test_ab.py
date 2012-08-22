# test ap.lazy
code = "K(SII(S(K(S(K(S(K(S(SI(K(S(S(KS)K)(S(S(S(KS)K))(SII)(S(S(KS)K)I)))))))K))(S(K(S(SI(K(S(S(KS)K)(S(S(KS)K)(S(S(S(KS)K))(SII)(S(S(KS)K)I))))))))K)))(SII)))"
import lazyk

input_stream = None
# (f input_stream) = output_stream
tree = [[lazyk.parse(code), input_stream], lazyk.Output]

for i in range(100):
    tree = lazyk.step(tree)
