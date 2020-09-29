// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Ley_Int$OptolithClient from "../Data/Ley_Int.bs.js";
import * as Yaml_Zip$OptolithClient from "../Misc/Yaml_Zip.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";

function tL10n(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          name: Json_decode.field("name", Json_decode.string, json),
          areaKnowledge: Json_decode.field("areaKnowledge", Json_decode.string, json),
          areaKnowledgeShort: Json_decode.field("areaKnowledgeShort", Json_decode.string, json),
          commonMundaneProfessions: JsonStrict$OptolithClient.optionalField("commonMundaneProfessions", Json_decode.string, json),
          commonMagicalProfessions: JsonStrict$OptolithClient.optionalField("commonMagicalProfessions", Json_decode.string, json),
          commonBlessedProfessions: JsonStrict$OptolithClient.optionalField("commonBlessedProfessions", Json_decode.string, json),
          commonAdvantages: JsonStrict$OptolithClient.optionalField("commonAdvantages", Json_decode.string, json),
          commonDisadvantages: JsonStrict$OptolithClient.optionalField("commonDisadvantages", Json_decode.string, json),
          uncommonAdvantages: JsonStrict$OptolithClient.optionalField("uncommonAdvantages", Json_decode.string, json),
          uncommonDisadvantages: JsonStrict$OptolithClient.optionalField("uncommonDisadvantages", Json_decode.string, json),
          commonNames: Json_decode.field("commonNames", Json_decode.string, json)
        };
}

function frequencyException(json) {
  var str = Json_decode.field("scope", Json_decode.string, json);
  switch (str) {
    case "Group" :
        return {
                TAG: /* Group */1,
                _0: Json_decode.field("value", Json_decode.$$int, json)
              };
    case "Single" :
        return {
                TAG: /* Single */0,
                _0: Json_decode.field("value", Json_decode.$$int, json)
              };
    default:
      throw {
            RE_EXN_ID: Json_decode.DecodeError,
            _1: "Unknown frequency exception: " + str,
            Error: new Error()
          };
  }
}

function tUniv(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          languages: Json_decode.field("languages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          literacy: JsonStrict$OptolithClient.optionalField("literacy", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          social: Json_decode.field("social", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          commonMundaneProfessionsAll: Json_decode.field("commonMundaneProfessionsAll", Json_decode.bool, json),
          commonMundaneProfessionsExceptions: JsonStrict$OptolithClient.optionalField("commonMundaneProfessionsExceptions", (function (param) {
                  return Json_decode.list(frequencyException, param);
                }), json),
          commonMagicalProfessionsAll: Json_decode.field("commonMagicalProfessionsAll", Json_decode.bool, json),
          commonMagicalProfessionsExceptions: JsonStrict$OptolithClient.optionalField("commonMagicalProfessionsExceptions", (function (param) {
                  return Json_decode.list(frequencyException, param);
                }), json),
          commonBlessedProfessionsAll: Json_decode.field("commonBlessedProfessionsAll", Json_decode.bool, json),
          commonBlessedProfessionsExceptions: JsonStrict$OptolithClient.optionalField("commonBlessedProfessionsExceptions", (function (param) {
                  return Json_decode.list(frequencyException, param);
                }), json),
          commonAdvantages: JsonStrict$OptolithClient.optionalField("commonAdvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          commonDisadvantages: JsonStrict$OptolithClient.optionalField("commonDisadvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          uncommonAdvantages: JsonStrict$OptolithClient.optionalField("uncommonAdvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          uncommonDisadvantages: JsonStrict$OptolithClient.optionalField("uncommonDisadvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          commonSkills: Json_decode.field("commonSkills", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          uncommonSkills: JsonStrict$OptolithClient.optionalField("uncommonSkills", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          culturalPackageCost: Json_decode.field("culturalPackageCost", Json_decode.$$int, json),
          culturalPackageSkills: Json_decode.field("culturalPackageSkills", (function (param) {
                  return Json_decode.list((function (param) {
                                return Json_decode.pair(Json_decode.$$int, Json_decode.$$int, param);
                              }), param);
                }), json)
        };
}

function t(univ, l10n) {
  return [
          univ.id,
          {
            id: univ.id,
            name: l10n.name,
            language: univ.languages,
            script: univ.literacy,
            areaKnowledge: l10n.areaKnowledge,
            areaKnowledgeShort: l10n.areaKnowledgeShort,
            socialStatus: univ.social,
            commonMundaneProfessionsAll: univ.commonMundaneProfessionsAll,
            commonMundaneProfessionsExceptions: univ.commonMundaneProfessionsExceptions,
            commonMundaneProfessionsText: l10n.commonMundaneProfessions,
            commonMagicProfessionsAll: univ.commonMagicalProfessionsAll,
            commonMagicProfessionsExceptions: univ.commonMagicalProfessionsExceptions,
            commonMagicProfessionsText: l10n.commonMagicalProfessions,
            commonBlessedProfessionsAll: univ.commonBlessedProfessionsAll,
            commonBlessedProfessionsExceptions: univ.commonBlessedProfessionsExceptions,
            commonBlessedProfessionsText: l10n.commonBlessedProfessions,
            commonAdvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, univ.commonAdvantages),
            commonAdvantagesText: l10n.commonAdvantages,
            commonDisadvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, univ.commonDisadvantages),
            commonDisadvantagesText: l10n.commonDisadvantages,
            uncommonAdvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, univ.uncommonAdvantages),
            uncommonAdvantagesText: l10n.uncommonAdvantages,
            uncommonDisadvantages: Ley_Option$OptolithClient.fromOption(/* [] */0, univ.uncommonDisadvantages),
            uncommonDisadvantagesText: l10n.uncommonDisadvantages,
            commonSkills: univ.commonSkills,
            uncommonSkills: Ley_Option$OptolithClient.fromOption(/* [] */0, univ.uncommonSkills),
            commonNames: l10n.commonNames,
            culturalPackageCost: univ.culturalPackageCost,
            culturalPackageSkills: Curry._1(Ley_IntMap$OptolithClient.fromList, univ.culturalPackageSkills)
          }
        ];
}

function all(yamlData) {
  return Curry._1(Ley_IntMap$OptolithClient.fromList, Yaml_Zip$OptolithClient.zipBy(Ley_Int$OptolithClient.show, t, (function (x) {
                    return x.id;
                  }), (function (x) {
                    return x.id;
                  }), Json_decode.list(tUniv, yamlData.culturesUniv), Json_decode.list(tL10n, yamlData.culturesL10n)));
}

var Decode = {
  tL10n: tL10n,
  frequencyException: frequencyException,
  tUniv: tUniv,
  t: t,
  all: all
};

export {
  Decode ,
  
}
/* Ley_IntMap-OptolithClient Not a pure module */