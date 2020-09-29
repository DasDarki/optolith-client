// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Skills$OptolithClient from "./Skills.bs.js";
import * as Ley_Int$OptolithClient from "../Data/Ley_Int.bs.js";
import * as Ley_List$OptolithClient from "../Data/Ley_List.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Dependencies$OptolithClient from "../Prerequisites/Dependencies.bs.js";
import * as Ley_Function$OptolithClient from "../Data/Ley_Function.bs.js";
import * as ActivatableSkills$OptolithClient from "./ActivatableSkills.bs.js";
import * as Activatable_SelectOptions$OptolithClient from "../Activatable/Activatable_SelectOptions.bs.js";

function getMaxSrFromPropertyKnowledge(propertyKnowledge, staticEntry) {
  var partial_arg = staticEntry.property;
  var hasRestriction = Ley_Option$OptolithClient.option(true, (function (param) {
          return Ley_List$OptolithClient.Foldable.notElem(partial_arg, param);
        }), Ley_Option$OptolithClient.Monad.$less$amp$great(propertyKnowledge, (function (param) {
              return Activatable_SelectOptions$OptolithClient.mapActiveOptions1((function (param) {
                            if (param.TAG) {
                              return ;
                            }
                            var match = param._0;
                            if (match[0] !== 0) {
                              return ;
                            } else {
                              return match[1];
                            }
                          }), param);
            })));
  if (hasRestriction) {
    return 14;
  }
  
}

function getMax(startEl, phase, heroAttrs, exceptionalSkill, propertyKnowledge, staticEntry) {
  return Skills$OptolithClient.getExceptionalSkillBonus(exceptionalSkill, [
              /* Spell */3,
              staticEntry.id
            ]) + Ley_List$OptolithClient.Foldable.minimum(Ley_Option$OptolithClient.catOptions({
                  hd: Skills$OptolithClient.getMaxSrByCheckAttrs(heroAttrs, staticEntry.check),
                  tl: {
                    hd: Skills$OptolithClient.getMaxSrFromEl(startEl, phase),
                    tl: {
                      hd: getMaxSrFromPropertyKnowledge(propertyKnowledge, staticEntry),
                      tl: /* [] */0
                    }
                  }
                })) | 0;
}

function isIncreasable(startEl, phase, heroAttrs, exceptionalSkill, propertyKnowledge, staticEntry, heroEntry) {
  return ActivatableSkills$OptolithClient.valueToInt(heroEntry.value) < getMax(startEl, phase, heroAttrs, exceptionalSkill, propertyKnowledge, staticEntry);
}

function isOnMinimum(spell) {
  var value = spell.value;
  if (value) {
    return value._0 >= 10;
  } else {
    return false;
  }
}

function addToCounter(spell) {
  return Curry._3(Ley_IntMap$OptolithClient.insertWith, (function (prim, prim$1) {
                return prim + prim$1 | 0;
              }), spell.property, 1);
}

function countApplicable(staticSpells, heroSpells) {
  return Curry._3(Ley_IntMap$OptolithClient.foldrWithKey, (function (spellId, spell) {
                if (isOnMinimum(spell)) {
                  return Ley_Option$OptolithClient.option(Ley_Function$OptolithClient.id, addToCounter, Curry._2(Ley_IntMap$OptolithClient.lookup, spellId, staticSpells));
                } else {
                  return Ley_Function$OptolithClient.id;
                }
              }), Ley_IntMap$OptolithClient.empty, heroSpells);
}

var counterToAvailable = Curry._2(Ley_IntMap$OptolithClient.foldrWithKey, (function (propertyId, count) {
        if (count >= 3) {
          return function (param) {
            return Ley_List$OptolithClient.cons(propertyId, param);
          };
        } else {
          return Ley_Function$OptolithClient.id;
        }
      }), /* [] */0);

function getAvailableProperties(staticSpells, heroSpells) {
  return Curry._1(counterToAvailable, countApplicable(staticSpells, heroSpells));
}

function getMinSr(counter, activePropertyKnowledges, staticEntry, heroEntry) {
  var hasActivePropertyKnowledge = Ley_List$OptolithClient.Foldable.any((function (sid) {
          if (sid.TAG) {
            return false;
          }
          var match = sid._0;
          if (match[0] !== 0) {
            return false;
          } else {
            return match[1] === staticEntry.property;
          }
        }), activePropertyKnowledges);
  if (hasActivePropertyKnowledge) {
    return Ley_Option$OptolithClient.Monad.$great$great$eq(Curry._2(Ley_IntMap$OptolithClient.lookup, staticEntry.property, counter), (function (count) {
                  if (ActivatableSkills$OptolithClient.valueToInt(heroEntry.value) >= 10 && count <= 3) {
                    return 10;
                  }
                  
                }));
  }
  
}

function getMinSrByDeps(heroSpells, heroEntry) {
  return Ley_Option$OptolithClient.Monad.$great$great$eq(Ley_Option$OptolithClient.ensure(Ley_List$OptolithClient.Extra.notNull, Dependencies$OptolithClient.Flatten.flattenActivatableSkillDependencies((function (id) {
                        return ActivatableSkills$OptolithClient.getValueDef(Curry._2(Ley_IntMap$OptolithClient.lookup, id, heroSpells));
                      }), heroEntry.id, heroEntry.dependencies)), (function (param) {
                return Ley_List$OptolithClient.Foldable.foldr((function (d, acc) {
                              return Ley_Option$OptolithClient.option(d, (function (prev) {
                                            return Ley_Int$OptolithClient.max(prev, d);
                                          }), acc);
                            }), undefined, param);
              }));
}

function getMin(propertyKnowledge, staticSpells, heroSpells) {
  var counter = countApplicable(staticSpells, heroSpells);
  var activePropertyKnowledges = Activatable_SelectOptions$OptolithClient.getActiveOptions1(propertyKnowledge);
  return function (staticEntry, heroEntry) {
    return Ley_Option$OptolithClient.Monad.$less$amp$great(Ley_Option$OptolithClient.ensure(Ley_List$OptolithClient.Extra.notNull, Ley_Option$OptolithClient.catOptions({
                        hd: getMinSrByDeps(heroSpells, heroEntry),
                        tl: {
                          hd: getMinSr(counter, activePropertyKnowledges, staticEntry, heroEntry),
                          tl: /* [] */0
                        }
                      })), Ley_List$OptolithClient.Foldable.maximum);
  };
}

function isDecreasable(propertyKnowledge, staticSpells, heroSpells) {
  var getMinCached = getMin(propertyKnowledge, staticSpells, heroSpells);
  return function (staticEntry, heroEntry) {
    return ActivatableSkills$OptolithClient.valueToInt(heroEntry.value) > Ley_Option$OptolithClient.fromOption(0, Curry._2(getMinCached, staticEntry, heroEntry));
  };
}

var PropertyKnowledge = {
  getAvailableProperties: getAvailableProperties
};

export {
  getMax ,
  isIncreasable ,
  getMin ,
  isDecreasable ,
  PropertyKnowledge ,
  
}
/* counterToAvailable Not a pure module */