/**
 * @module Data.Show
 *
 * Conversion of values to readable `String`s.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe";
import { isIO } from "../System/IO";
import { isEither, isRight } from "./Either";
import { consF, fnull, isList, List } from "./List";
import { isJust, isMaybe } from "./Maybe";
import { GT, isOrdering, LT } from "./Ord";
import { isOrderedMap } from "./OrderedMap";
import { isOrderedSet } from "./OrderedSet";
import { isRecord } from "./Record";
import { isTuple } from "./Tuple";

const intercalate =
  (separator: string) => (xs: List<number | string>): string =>
  fnull (xs)
    ? ""
    : fnull (xs .xs)
    ? xs .x .toString ()
    : xs .x .toString () + separator + intercalate (separator) (xs .xs)

const map =
  <A, B> (f: (x: A) => B) => (xs: List<A>): List<B> =>
  fnull (xs) ? List () : consF (f (xs .x)) (map (f) (xs .xs))

const trimStart = (str: string) => str .replace (/^\s+/, "")

/**
 * `show :: a -> String`
 *
 * Convert a value to a readable `String`.
 */
// tslint:disable-next-line: cyclomatic-complexity
export const show = (x: any): string => {
  if (isMaybe (x)) {
    if (isJust (x)) {
      return `Just (${show (x.value)})`
    }

    return `Nothing`
  }

  if (isEither (x)) {
    if (isRight (x)) {
      return `Right (${show (x .value)})`
    }

    return `Left (${show (x .value)})`
  }

  if (isList (x)) {
    return `[${intercalate (", ") (map (show) (x))}]`
  }

  if (isTuple (x)) {
    const arr: any = []

    for (let i = 0; i < x .length; i++) {
      const e = x .values [i]
      arr .push (e)
    }

    return `(${arr .map (show) .join (", ")})`
  }

  if (isOrderedSet (x)) {
    return `Set (${[...x] .map (show) .join (", ")})`
  }

  if (isOrderedMap (x)) {
    return `Map (${
      [...x] .map (([k, v]) => `${show (k)} = ${show (v)}`) .join (", ")
    })`
  }

  if (isRecord (x)) {
    return `{ ${
      [...x .keys .value]
        .sort ()
        .map (key =>
          `${key} = ${
            show (
              x .values [key] === null || x .values [key] === undefined
              ? x .defaultValues [key]
              : x .values [key])
          }`
        )
        .join (", ")
    } }`
  }

  if (isIO (x)) {
    return `IO`
  }

  if (isOrdering (x)) {
    return x === GT ? "GT" : x === LT ? "LT" : "EQ";
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof x === "bigint") {
    return x .toString ()
  }

  if (typeof x === "boolean") {
    return x ? `True` : `False`
  }

  if (typeof x === "number") {
    return 1 / x === -Infinity ? "-0" : x .toString (10)
  }

  if (typeof x === "string") {
    return JSON.stringify (x)
  }

  if (typeof x === "symbol") {
    if (x.description !== "") {
      return `Symbol "${x.description}"`
    }
    else {
      return `Symbol`
    }
  }

  if (x === undefined) {
    return `undefined`
  }

  if (x === null) {
    return `null`
  }

  if (x instanceof Date) {
    return `Date (${x .toISOString ()})`
  }

  return String (x)
}

// tslint:disable-next-line: cyclomatic-complexity
const showPDepth = (depth: number) => (x: any): string => {
  const dws = " " .repeat (depth * 2) // depth whitespace

  if (isMaybe (x)) {
    if (isJust (x)) {
      const str = trimNextDepth (depth) (x.value)

      if (/\n/ .test (str)) {
        return `${dws}Just (\n${dws}  ${str}${dws}\n)`
      }

      return `${dws}Just ${wrapParens (str)}`
    }

    return `${dws}Nothing`
  }

  if (isEither (x)) {
    const str = trimNextDepth (depth) (x.value)

    if (isRight (x)) {
      if (/\n/ .test (str)) {
        return `${dws}Right (\n${dws}  ${str}${dws}\n)`
      }

      return `${dws}Right ${wrapParens (str)}`
    }

    if (/\n/ .test (str)) {
      return `${dws}Left (\n${dws}  ${str}${dws}\n)`
    }

    return `${dws}Left ${wrapParens (str)}`
  }

  if (isList (x)) {
    if (fnull (x)) {
      return `${dws}[]`
    }

    return `${dws}[ ${[...x] .map (trimNextDepth (depth)) .join (`\n${dws}, `)} ]`
  }

  if (isTuple (x)) {
    const arr: any = []

    for (let i = 0; i < x .length; i++) {
      const e = x .values [i]
      arr .push (e)
    }

    return `${dws}( ${arr .map (trimNextDepth (depth)) .join (`\n${dws}, `)}\n${dws})`
  }

  if (isOrderedSet (x)) {
    return `${dws}Set (${[...x] .map (trimNextDepth (depth + 2)) .join (`\n${dws}    , `)})`
  }

  if (isOrderedMap (x)) {
    return `${dws}Map (${
      [...x] .map (([k, v]) => `${show (k)} = ${show (v)}`) .join (`\n${dws}    , `)
    })`
  }

  if (isRecord (x)) {
    return `${dws}{ ${
      [...x .keys .value]
        .sort ()
        .map (key =>
          `${key} = ${
            trimNextDepth (depth)
                          (x .values [key] === null || x .values [key] === undefined
                          ? x .defaultValues [key]
                          : x .values [key])
                          .replace (/\n/g, `\n   ${" " .repeat (key .length)}`)
          }`
        )
        .join (`\n${dws}, `)
    } }`
  }

  if (isIO (x)) {
    return `${dws}IO`
  }

  if (isOrdering (x)) {
    return x === GT ? `${dws}GT` : x === LT ? `${dws}LT` : `${dws}EQ`;
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof x === "bigint") {
    return `${dws}${x .toString ()}`
  }

  if (typeof x === "boolean") {
    return x ? `${dws}True` : `${dws}False`
  }

  if (typeof x === "number") {
    return 1 / x === -Infinity ? `${dws}-0` : `${dws}${x .toString (10)}`
  }

  if (typeof x === "string") {
    return `${dws}${JSON.stringify (x)}`
  }

  if (typeof x === "symbol") {
    if (x.description !== "") {
      return `${dws}Symbol "${x.description}"`
    }
    else {
      return `${dws}Symbol`
    }
  }

  if (x === undefined) {
    return `${dws}undefined`
  }

  if (x === null) {
    return `${dws}null`
  }

  if (x instanceof Date) {
    return `${dws}Date (${x .toISOString ()})`
  }

  return `${dws}${JSON.stringify (x)}`
}

const trimNextDepth =
  (current_depth: number) =>
    pipe (showPDepth (current_depth + 1), trimStart)

const parensNeeded =
  (x: string) => /\n\[\(/ .test (x) || /^\w.* / .test (x)

const wrapParens = (x: string) => parensNeeded (x) ? `(${x})` : x

/**
 * `showP :: a -> String`
 *
 * Convert a value to a readable prettyfied `String`.
 */
export const showP = showPDepth (0)
