/**
 * @module Data.Either
 *
 * The `Either` type represents values with two possibilities: a value of type
 * `Either a b` is either `Left a` or `Right b`.
 *
 * The `Either` type is sometimes used to represent a value which is either
 * correct or an error by convention, the `Left` constructor is used to hold an
 * error value and the `Right` constructor is used to hold a correct value
 * (mnemonic: "right" also means "correct").
 *
 * @author Lukas Obermann
 */

import { ifElse } from "../App/Utilities/ifElse";
import { pipe } from "../App/Utilities/pipe";
import { ident } from "./Function";
import { fmap, fmapF } from "./Functor";
import { cons, consF, List } from "./List";
import { Just, Maybe, Nothing, Some } from "./Maybe";
import { Pair, Tuple } from "./Tuple";


// PROTOTYPES

interface LeftPrototype {
  readonly isLeft: true
  readonly isRight: false
}

const LeftPrototype =
  Object.freeze<LeftPrototype> ({
    isLeft: true,
    isRight: false,
  })

interface RightPrototype {
  readonly isLeft: false
  readonly isRight: true
}

const RightPrototype: RightPrototype =
  Object.freeze<RightPrototype> ({
    isLeft: false,
    isRight: true,
  })


// CONSTRUCTORS

export type Either<A, B> = Left<A> | Right<B>

export interface Left<A> extends LeftPrototype {
  readonly value: A
}

/**
 * `Left :: a -> Either a b`
 *
 * Creates a new `Left` from the passed value.
 */
export const Left =
  <A>
  (x: A): Left<A> =>
    Object.create (
      LeftPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )

export interface Right<B> extends RightPrototype {
  readonly value: B
  readonly prototype: RightPrototype
}

/**
 * `Right :: b -> Either a b`
 *
 * Creates a new `Right` from the passed value.
 */
export const Right =
  <B>
  (x: B): Right<B> =>
    Object.create (
      RightPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )


// EITHER FUNCTIONS

/**
 * `either :: (a -> c) -> (b -> c) -> Either a b -> c`
 *
 * Case analysis for the `Either` type. If the value is `Left a`, apply the
 * first function to `a` if it is `Right b`, apply the second function to `b`.
 */
export const either =
  <A, B, C>
  (fLeft: (l: A) => C) =>
  (fRight: (r: B) => C) =>
  (x: Either<A, B>): C =>
    isRight (x) ? fRight (x .value) : fLeft (x .value)

/**
 * `lefts :: [Either a b] -> [a]`
 *
 * Extracts from a list of `Either` all the `Left` elements. All the `Left`
 * elements are extracted in order.
 */
export const lefts =
  <A, B> (xs: List<Either<A, B>>): List<A> =>
    List.foldr<Either<A, B>, List<A>> (x => acc => isLeft (x)
                                                   ? cons (acc) (x .value)
                                                   : acc)
                                      (List.empty)
                                      (xs)

/**
 * `rights :: [Either a b] -> [b]`
 *
 * Extracts from a list of `Either` all the `Right` elements. All the `Right`
 * elements are extracted in order.
 */
export const rights =
  <A, B> (xs: List<Either<A, B>>): List<B> =>
    List.foldr<Either<A, B>, List<B>> (x => acc => isRight (x)
                                                   ? cons (acc) (x .value)
                                                   : acc)
                                      (List.empty)
                                      (xs)

/**
 * `isLeft :: Either a b -> Bool`
 *
 * Return `True` if the given value is a `Left`-value, `False` otherwise.
 */
export const isLeft =
  <A, B> (x: Either<A, B>): x is Left<A> =>
    Object.getPrototypeOf (x) === LeftPrototype

/**
* `isRight :: Either a b -> Bool`
*
* Return `True` if the given value is a `Right`-value, `False` otherwise.
*/
export const isRight =
  <A, B> (x: Either<A, B>): x is Right<B> =>
    Object.getPrototypeOf (x) === RightPrototype

/**
 * `fromLeft :: a -> Either a b -> a`
 *
 * Return the contents of a `Left`-value or a default value otherwise.
 *
 * `fromLeft 1 (Left 3) == 3`
 * `fromLeft 1 (Right "foo") == 1`
 */
export const fromLeft =
  <A>
  (def: A) =>
  (x: Either<A, any>): A =>
    isLeft (x) ? x .value : def

/**
 * `fromRight :: b -> Either a b -> b`
 *
 *
 * Return the contents of a `Right`-value or a default value otherwise.
 *
 * `fromRight 1 (Right 3) == 3`
 * `fromRight 1 (Left "foo") == 1`
 */
export const fromRight =
  <B>
  (def: B) =>
  (x: Either<any, B>): B =>
    isRight (x) ? x .value : def

/**
 * `partitionEithers :: [Either a b] -> ([a], [b])`
 *
 * Partitions a list of `Either` into two lists. All the `Left` elements are
 * extracted, in order, to the first component of the output. Similarly the
 * `Right` elements are extracted to the second component of the output.
 */
export const partitionEithers =
  <A, B> (xs: List<Either<A, B>>): Pair<List<A>, List<B>> =>
    List.foldr<Either<A, B>, Pair<List<A>, List<B>>>
      (x => isRight (x)
            ? Tuple.second (consF (x .value))
            : Tuple.first (consF (x .value)))
      (Pair<List<A>, List<B>> (List.empty, List.empty))
      (xs)


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> Either a c -> Either b d`
 */
export const bimap =
  <A, B, C, D>
  (fLeft: (l: A) => B) =>
  (fRight: (r: C) => D) =>
  (x: Either<A, C>): Either<B, D> =>
    isRight (x)
      ? Right (fRight (x .value))
      : Left (fLeft (x .value))

/**
 * `first :: (a -> b) -> Either a c -> Either b c`
 */
export const first =
  <A, B, C>
  (f: (l: A) => B) =>
  (x: Either<A, C>): Either<B, C> =>
    isLeft (x)
      ? Left (f (x .value))
      : x

/**
 * `second :: (b -> c) -> Either a b -> Either a c`
 */
export const second =
  <B, C>
  (f: (r: B) => C) =>
  <A>
  (x: Either<A, B>): Either<A, C> =>
    isRight (x)
      ? Right (f (x .value))
      : x


// APPLICATIVE

/**
 * `pure :: a -> Either e a`
 *
 * Lift a value.
 */
export const pure = Right

/**
 * `(<*>) :: Either e (a -> b) -> Either e a -> Either e b`
 *
 * Sequential application.
 */
export const ap =
  <E, A, B>
  (f: Either<E, (x: A) => B>) => (x: Either<E, A>): Either<E, B> =>
    isRight (f) ? fmap (f .value) (x) : f


// MONAD

/**
 * `(>>=) :: Either e a -> (a -> Either e b) -> Either e b`
 */
export const bind =
  <E, A>
  (x: Either<E, A>) =>
  <B>
  (f: (x: A) => Either<E, B>): Either<E, B> =>
    isRight (x) ? f (x .value) : x

/**
 * `(=<<) :: (a -> Either e b) -> Either e a -> Either e b`
 */
export const bindF =
  <E, A, B>
  (f: (x: A) => Either<E, B>) =>
  (x: Either<E, A>): Either<E, B> =>
    bind (x) (f)

/**
 * `(>>) :: Either e a -> Either e b -> Either e b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  <E, B>
  (x: Either<E, any>) =>
  (y: Either<E, B>): Either<E, B> =>
    bind (x) (_ => y)

/**
 * `(>=>) :: (a -> Either e b) -> (b -> Either e c) -> a -> Either e c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <E, A, B, C>
  (f: (x: A) => Either<E, B>) =>
  (g: (x: B) => Either<E, C>) =>
    pipe (f, bindF (g))

/**
 * `join :: Either e (Either e a) -> Either e a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <E, A> (x: Either<E, Either<E, A>>): Either<E, A> =>
    bind (x) (ident)

/**
 * `mapM :: (a -> Either e b) -> [a] -> Either e [b]`
 *
 * `mapM f xs` takes a function and a list and maps the function over every
 * element in the list. If the function returns a `Left`, it is immediately
 * returned by the function. If `f` did not return any `Left`, the list of
 * unwrapped return values is returned as a `Right`. If `xs` is empty,
 * `Right []` is returned.
 */
export const mapM =
  <E, A, B>
  (f: (x: A) => Either<E, B>) =>
  (xs: List<A>): Either<E, List<B>> =>
    List.fnull (xs)
    ? Right (List.empty)
    : ifElse<Either<E, B>, Left<E>>
      (isLeft)
      <Either<E, List<B>>>
      (ident)
      (y => second (consF (y .value))
                   (mapM (f) (xs .xs)))
      (f (xs .x))

/**
 * `liftM2 :: (a1 -> a2 -> r) -> Either e a1 -> Either e a2 -> Either e r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2 =
  <A1 extends Some, A2 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B) =>
  <E>
  (x1: Either<E, A1>) =>
  (x2: Either<E, A2>): Either<E, B> =>
    bind (x1) (pipe (f, fmapF (x2)))


// FOLDABLE

/**
 * `foldr :: (a0 -> b -> b) -> b -> Either a a0 -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A0, B>
  (f: (x: A0) => (acc: B) => B) =>
  (initial: B) =>
  (x: Either<any, A0>): B =>
    isRight (x) ? f (x .value) (initial) : initial

/**
 * `foldl :: (b -> a0 -> b) -> b -> Either a a0 -> b`
 *
 * Left-associative fold of a structure.
 */
export const foldl =
  <A0, B>
  (f: (acc: B) => (x: A0) => B) =>
  (initial: B) =>
  (x: Either<any, A0>): B =>
    isRight (x) ? f (initial) (x .value) : initial

/**
 * `toList :: Either a a0 -> [a0]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A0> (x: Either<any, A0>): List<A0> =>
    isRight (x) ? List (x .value) : List.empty

/**
 * `null :: Either a a0 -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = isLeft

/**
 * `length :: Either a a0 -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (x: Either<any, any>): number => isRight (x) ? 1 : 0

/**
 * `elem :: Eq a0 => a0 -> Either a a0 -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 */
export const elem =
  <A0> (x: A0) => (y: Either<any, A0>): boolean =>
    isRight (y) && x === y .value

/**
 * `elemF :: Eq a0 => Either a a0 -> a0 -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 *
 * Flipped version of `elem`.
 */
export const elemF = <A> (y: Either<A, A>) => (x: A): boolean => elem (x) (y)

/**
 * `sum :: Num a => Either a a0 -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = fromRight (0)

/**
 * `product :: Num a => Either a a0 -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = fromRight (1)

// Specialized folds

/**
 * `concat :: Either a [a0] -> [a0]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A0>(x: Either<any, List<A0>>): List<A0> =>
    fromRight<List<A0>> (List.empty) (x)

/**
 * `concatMap :: (a0 -> [b]) -> Either a a0 -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A0, B> (f: (x: A0) => List<B>) => (x: Either<any, A0>): List<B> =>
    fromRight<List<B>> (List.empty) (fmap (f) (x))

/**
 * `and :: Either a Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = fromRight (true)

/**
 * `or :: Either a Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = fromRight (false)

/**
 * `any :: (a0 -> Bool) -> Either a a0 -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A0>(f: (x: A0) => boolean) => (x: Either<any, A0>): boolean =>
    fromRight (false) (fmap (f) (x))
/**
 * `all :: (a0 -> Bool) -> Either a a0 -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A0>(f: (x: A0) => boolean) => (x: Either<any, A0>): boolean =>
    fromRight (true) (fmap (f) (x))

// Searches

/**
 * `notElem :: Eq a0 => a0 -> Either a a0 -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A0> (x: A0) => (y: Either<any, A0>): boolean =>
    !elem (x) (y)

interface Find {
  /**
   * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (x: Either<any, A>) => Maybe<A1>

  /**
   * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (x: Either<any, A>) => Maybe<A>
}

/**
 * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A>
  (pred: (x: A) => boolean) =>
  (x: Either<any, A>): Maybe<A> =>
    isRight (x) && pred (x .value) ? Just (x .value) : Nothing


// ORD

/**
 * `(>) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is greater than the first value.
 *
 * If the second value is a `Right` and the first is a `Left`, `(>)` always
 * returns `True`.
 *
 * If the second value is a `Left` and the first is a `Right`, `(>)` always
 * returns `False`.
 */
export const gt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m2) && isLeft (m1)
    || isRight (m1) && isRight (m2) && m2 .value > m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value > m1 .value

/**
 * `(<) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is lower than the first value.
 *
 * If the second value is a `Left` and the first is a `Right`, `(<)` always
 * returns `True`.
 *
 * If the second value is a `Right` and the first is a `Left`, `(<)` always
 * returns `False`.
 */
export const lt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m2) && isRight (m1)
    || isRight (m1) && isRight (m2) && m2 .value < m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value < m1 .value

/**
 * `(>=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is greater than or equals the first
 * value.
 *
 * If the second value is a `Right` and the first is a `Left`, `(>=)` always
 * returns `True`.
 *
 * If the second value is a `Left` and the first is a `Right`, `(>=)` always
 * returns `False`.
 */
export const gte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m2) && isLeft (m1)
    || isRight (m1) && isRight (m2) && m2 .value >= m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value >= m1 .value

/**
 * `(<=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is lower than or equals the second
 * value.
 *
 * If the second value is a `Left` and the first is a `Right`, `(<=)` always
 * returns `True`.
 *
 * If the second value is a `Right` and the first is a `Left`, `(<=)` always
 * returns `False`.
 */
export const lte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m2) && isRight (m1)
    || isRight (m1) && isRight (m2) && m2 .value <= m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value <= m1 .value


// CUSTOM FUNCTIONS

/**
 * `isEither :: a -> Bool`
 *
 * Return `True` if the given value is an `Either`.
 */
export const isEither =
  (x: any): x is Either<any, any> =>
    typeof x === "object" && x !== null && (isLeft (x) || isRight (x))

/**
 * `imapM :: (Int -> a -> Either e b) -> [a] -> Either e [b]`
 *
 * `imapM f xs` takes a function and a list and maps the function over every
 * element in the list. If the function returns a `Left`, it is immediately
 * returned by the function. If `f` did not return any `Left`, the list of
 * unwrapped return values is returned as a `Right`. If `xs` is empty,
 * `Right []` is returned.
 */
export const imapM =
  <E, A, B>
  (f: (index: number) => (x: A) => Either<E, B>) =>
  (xs: List<A>): Either<E, List<B>> =>
    imapMIndex (0) (f) (xs)

const imapMIndex =
  (i: number) =>
  <E, A, B>
  (f: (i: number) => (x: A) => Either<E, B>) =>
  (xs: List<A>): Either<E, List<B>> =>
    List.fnull (xs)
    ? Right (List.empty)
    : ifElse<Either<E, B>, Left<E>>
      (isLeft)
      <Either<E, List<B>>>
      (ident)
      (y => second (consF (y .value))
                   (imapMIndex (i + 1) (f) (xs .xs)))
      (f (i) (xs .x))

/**
 * `invertEither :: Either l r -> Either r l`
 *
 * Converts a `Left` into a `Right` and a `Right` into a `Left`.
 */
export const invertEither =
  <L, R> (x: Either<L, R>): Either<R, L> =>
    isLeft (x) ? Right (x .value) : Left (x .value)


// TYPE HELPERS

export type LeftI<A> = A extends Left<infer I> ? I : never
export type RightI<A> = A extends Right<infer I> ? I : never


// NAMESPACED FUNCTIONS

export const Either = {
  Left,
  Right,

  isLeft,
  isRight,
  either,
  lefts,
  rights,
  fromLeft,
  fromRight,
  partitionEithers,

  bimap,
  first,
  second,

  pure,
  ap,

  bind,
  bindF,
  then,
  kleisli,
  join,
  mapM,
  liftM2,

  foldr,
  foldl,
  toList,
  fnull,
  flength,
  elem,
  elemF,
  sum,
  product,
  concat,
  concatMap,
  and,
  or,
  any,
  all,
  notElem,
  find,

  gt,
  lt,
  gte,
  lte,

  isEither,
  imapM,
  invertEither,
}
