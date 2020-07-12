// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as $$Set from "bs-platform/lib/es6/set.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Ley_Function$OptolithClient from "./Ley_Function.bs.js";

function Make(funarg) {
  var TypedSet = $$Set.Make(funarg);
  var foldr = function (f, initial, s) {
    return Curry._3(TypedSet.fold, f, s, initial);
  };
  var foldl = function (f, initial, s) {
    return Curry._3(TypedSet.fold, (function (param, param$1) {
                  return Ley_Function$OptolithClient.flip(f, param, param$1);
                }), s, initial);
  };
  var toList = TypedSet.elements;
  var length = TypedSet.cardinal;
  var elem = function (x) {
    return Curry._1(TypedSet.exists, (function (y) {
                  return Curry._2(funarg.compare, x, y) === 0;
                }));
  };
  var concatMap = function (f, s) {
    return Curry._3(TypedSet.fold, (function (x, acc) {
                  return Curry._2(TypedSet.union, acc, Curry._1(f, x));
                }), s, TypedSet.empty);
  };
  var any = function (pred, s) {
    return !Curry._2(TypedSet.for_all, (function (x) {
                  return !Curry._1(pred, x);
                }), s);
  };
  var all = function (pred) {
    return Curry._1(TypedSet.for_all, Curry.__1(pred));
  };
  var notElem = function (x, s) {
    return !Curry._1(elem(x), s);
  };
  var find = function (pred, s) {
    return Curry._2(TypedSet.find_first_opt, pred, s);
  };
  var Foldable_null = TypedSet.is_empty;
  var Foldable = {
    foldr: foldr,
    foldl: foldl,
    toList: toList,
    $$null: Foldable_null,
    length: length,
    elem: elem,
    concatMap: concatMap,
    any: any,
    all: all,
    notElem: notElem,
    find: find
  };
  var insert = TypedSet.add;
  var $$delete = TypedSet.remove;
  var toggle = function (x, s) {
    if (Curry._1(elem(x), s)) {
      return Curry._2($$delete, x, s);
    } else {
      return Curry._2(insert, x, s);
    }
  };
  return {
          Foldable: Foldable,
          empty: TypedSet.empty,
          singleton: TypedSet.singleton,
          fromList: TypedSet.of_list,
          insert: insert,
          $$delete: $$delete,
          toggle: toggle,
          member: elem,
          notMember: notElem,
          size: length,
          union: TypedSet.union,
          difference: TypedSet.diff,
          filter: TypedSet.filter,
          map: TypedSet.map,
          elems: toList
        };
}

export {
  Make ,
  
}
/* No side effect */