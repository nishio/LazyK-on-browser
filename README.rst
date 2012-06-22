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




