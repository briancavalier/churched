// @flow

// Church encoding fun

// Bool
// Returns one of its inputs
export type Bool<A> = (A, A) => A

// T returns the first argument
export const T = <A> (t: A, _: A): A => t
// F returns the second argument
export const F = <A> (_: A, f: A): A => f

// Maybe
// Contains zero or one A
export interface Maybe<A> {
  <B> (B, A => B): B
}

// Nothing has no A, so returns the B
export const Nothing = <A, B> (b: B, f: A => B): B => b

// Just has an A, so applies the function to it
export const Just = <A> (a: A): Maybe<A> => <B>(b, f) => f(a)

// Turn Maybe A into Maybe B
export const mapMaybe = <A, B> (f: A => B, m: Maybe<A>): Maybe<B> =>
  (c, bc) => m(c, a => bc(f(a)))

// Either
// Contains either an A or a B
// Accepts a pair of functions and applies one
export interface Either <A, B> {
  <C> (A => C, B => C): C
}

// Contains an A, applies the first function
export const Left = <A, B> (a: A): Either<A, B> =>
  (ac, bc) => ac(a)

// Contains a B, applies the second function
export const Right = <A, B> (b: B): Either<A, B> =>
  (ac, bc) => bc(b)

// Turn Either A B into Either A C
export const bimapEither = <A, B, C, D> (f: A => C, g: B => D, e: Either<A, B>): Either<A, C> =>
  (cd, de) => e(a => cd(f(a)), b => de(g(b)))

// Product (pair)
// Accepts a function that takes both elements of the pair
export interface Pair<A, B> {
  <C> ((A, B) => C): C
}

// Create a Pair containing an A and a B
// Note: sadly, Flow has a single namespace for
// types and functions, so this cannot be named Pair
export const P = <A, B> (a: A, b: B): Pair<A, B> =>
  (f) => f(a, b)

// Map both elements of a Pair
export const bimapPair = <A, B, C, D> (ac: A => C, bd: B => D, p: Pair<A, B>): Pair<C, D> =>
  (f) => p((a, b) => f(ac(a), bd(b)))

// Get the first element of a Pair
export const fst = <A, B> (p: Pair<A, B>): A =>
  p((a, _) => a)

// Get the second element of a Pair
export const snd = <A, B> (p: Pair<A, B>): B =>
  p((_, b) => b)

// List
// Represented as a right fold
export interface List <A> {
  <B> ((B, A) => B, B): B
}

// Nil has no As, folding returns B
export const Nil = <A, B> (f: (B, A) => B, b: B) => b

// Cons has 1 or more As
export const Cons = <A> (a: A, tail: List<A>): List<A> =>
  (f, b) => f(tail(f, b), a)

// Turn List A into List B
export const mapList = <A, B> (f: A => B, l: List<A>): List<B> =>
  (g, c) => l((c, a) => g(c, f(a)), c)
