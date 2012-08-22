===================
 Lazy K on browser
===================


- primes.txt come from http://homepages.cwi.nl/~tromp/cl/lazy-k.html

TODO
====

- Lazy K impl.
- Lazy K visualization (Beauty K)
- jscc support
- http://jsdo.it/nishio/2Fos/edit


Samples
=======

cons
----

cons x y f = (f x y) = S(SI(Kx))(Ky)

- (f x y) = ((f) (x)) y = (S I Kx f) y
- ((S I Kx) (f)) (y)) = S (S I Kx) (Ky) f

output stream
-------------

out := (lambda (x) (progn (print x) (lambda (y) (y out))))

(S out) → ((cons X Y) out) → (out X Y)
→ (out X) print X and return (lambda (y) (y out))
→ (Y out)

Church number
-------------

0 = (lambda (f x) x)
1 = (lambda (f x) (f x))
2 = (lambda (f x) (f (f x)))

Given n as Church number, (n inc 0) returns ordinal number.

Samples
=======

- test_ab.py: print ABABAB... repeatedly. Good for output stream test.


Reference
=========

- http://homepages.cwi.nl/~tromp/cl/lazy-k.html
- http://esoteric.sange.fi/essie2/download/


