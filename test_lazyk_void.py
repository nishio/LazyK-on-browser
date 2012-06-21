import lazyk
# Mocking: Mx = xx
# SIIx = (Ix)(Ix) = xx
M = lazyk.parse("S(SKK)(SKK)")

# Compose: Cxyz = x(yz)
# x(yz) = S(Kx)yz
# S(Kx) = S(KS)Kx
C = lazyk.parse("S(KS)K")

# if KV = V, KVx = V = Vx
# (K*M)(K*M) = K(M(K*M)) = K(K*M)(K*M)
# so V = (K*M)(K*M) = (CKM)(CKM)

V = lazyk.to_ast([[C, 'K', M], [C, 'K', M]])

tree = V
buf = []
for i in range(50):
    if tree in buf: break
    buf.append(tree)
    tree = lazyk.step(tree)

print buf
