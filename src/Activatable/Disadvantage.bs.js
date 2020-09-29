// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Json_decode from "@glennsl/bs-json/src/Json_decode.bs.js";
import * as Erratum$OptolithClient from "../Sources/Erratum.bs.js";
import * as Ley_Int$OptolithClient from "../Data/Ley_Int.bs.js";
import * as Yaml_Zip$OptolithClient from "../Misc/Yaml_Zip.bs.js";
import * as Advantage$OptolithClient from "./Advantage.bs.js";
import * as SourceRef$OptolithClient from "../Sources/SourceRef.bs.js";
import * as JsonStrict$OptolithClient from "../Misc/JsonStrict.bs.js";
import * as Ley_IntMap$OptolithClient from "../Data/Ley_IntMap.bs.js";
import * as Ley_Option$OptolithClient from "../Data/Ley_Option.bs.js";
import * as Prerequisite$OptolithClient from "../Prerequisites/Prerequisite.bs.js";
import * as SelectOption$OptolithClient from "./SelectOption.bs.js";

function tL10n(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          name: Json_decode.field("name", Json_decode.string, json),
          nameInWiki: JsonStrict$OptolithClient.optionalField("nameInWiki", Json_decode.string, json),
          rules: Json_decode.field("rules", Json_decode.string, json),
          selectOptions: JsonStrict$OptolithClient.optionalField("selectOptions", (function (param) {
                  return Json_decode.list(SelectOption$OptolithClient.Decode.tL10n, param);
                }), json),
          input: JsonStrict$OptolithClient.optionalField("input", Json_decode.string, json),
          range: JsonStrict$OptolithClient.optionalField("range", Json_decode.string, json),
          actions: JsonStrict$OptolithClient.optionalField("actions", Json_decode.string, json),
          prerequisites: JsonStrict$OptolithClient.optionalField("prerequisites", Json_decode.string, json),
          prerequisitesIndex: JsonStrict$OptolithClient.optionalField("prerequisitesIndex", Prerequisite$OptolithClient.Decode.tIndexWithLevelL10n, json),
          prerequisitesStart: JsonStrict$OptolithClient.optionalField("prerequisitesStart", Json_decode.string, json),
          prerequisitesEnd: JsonStrict$OptolithClient.optionalField("prerequisitesEnd", Json_decode.string, json),
          apValue: JsonStrict$OptolithClient.optionalField("apValue", Json_decode.string, json),
          apValueAppend: JsonStrict$OptolithClient.optionalField("apValueAppend", Json_decode.string, json),
          src: Json_decode.field("src", SourceRef$OptolithClient.Decode.list, json),
          errata: Json_decode.field("errata", Erratum$OptolithClient.Decode.list, json)
        };
}

var cost = Advantage$OptolithClient.Decode.cost;

function tUniv(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          cost: JsonStrict$OptolithClient.optionalField("cost", cost, json),
          noMaxAPInfluence: JsonStrict$OptolithClient.optionalField("noMaxAPInfluence", Json_decode.bool, json),
          isExclusiveToArcaneSpellworks: JsonStrict$OptolithClient.optionalField("isExclusiveToArcaneSpellworks", Json_decode.bool, json),
          levels: JsonStrict$OptolithClient.optionalField("levels", Json_decode.$$int, json),
          max: JsonStrict$OptolithClient.optionalField("max", Json_decode.$$int, json),
          selectOptionCategories: JsonStrict$OptolithClient.optionalField("selectOptionCategories", (function (param) {
                  return Json_decode.list(SelectOption$OptolithClient.Decode.categoryWithGroups, param);
                }), json),
          selectOptions: JsonStrict$OptolithClient.optionalField("selectOptions", (function (param) {
                  return Json_decode.list(SelectOption$OptolithClient.Decode.tUniv, param);
                }), json),
          prerequisites: Prerequisite$OptolithClient.Decode.tWithLevelDisAdv(json),
          prerequisitesIndex: JsonStrict$OptolithClient.optionalField("prerequisitesIndex", Prerequisite$OptolithClient.Decode.tIndexWithLevelUniv, json),
          gr: Json_decode.field("gr", Json_decode.$$int, json)
        };
}

function t(blessings, cantrips, combatTechniques, liturgicalChants, skills, spells, univ, l10n) {
  return [
          univ.id,
          {
            id: univ.id,
            name: l10n.name,
            nameInWiki: l10n.nameInWiki,
            noMaxAPInfluence: Ley_Option$OptolithClient.fromOption(false, univ.noMaxAPInfluence),
            isExclusiveToArcaneSpellworks: Ley_Option$OptolithClient.fromOption(false, univ.isExclusiveToArcaneSpellworks),
            levels: univ.levels,
            max: univ.max,
            rules: l10n.rules,
            selectOptions: SelectOption$OptolithClient.Decode.mergeSelectOptions(l10n.selectOptions, univ.selectOptions, SelectOption$OptolithClient.Decode.resolveCategories(blessings, cantrips, combatTechniques, liturgicalChants, skills, spells, univ.selectOptionCategories)),
            input: l10n.input,
            range: l10n.range,
            actions: l10n.actions,
            prerequisites: univ.prerequisites,
            prerequisitesText: l10n.prerequisites,
            prerequisitesTextIndex: Prerequisite$OptolithClient.Decode.tIndexWithLevel(univ.prerequisitesIndex, l10n.prerequisitesIndex),
            prerequisitesTextStart: l10n.prerequisitesStart,
            prerequisitesTextEnd: l10n.prerequisitesEnd,
            apValue: univ.cost,
            apValueText: l10n.apValue,
            apValueTextAppend: l10n.apValueAppend,
            gr: univ.gr,
            src: l10n.src,
            errata: l10n.errata
          }
        ];
}

function all(blessings, cantrips, combatTechniques, liturgicalChants, skills, spells, yamlData) {
  return Curry._1(Ley_IntMap$OptolithClient.fromList, Yaml_Zip$OptolithClient.zipBy(Ley_Int$OptolithClient.show, (function (param, param$1) {
                    return t(blessings, cantrips, combatTechniques, liturgicalChants, skills, spells, param, param$1);
                  }), (function (x) {
                    return x.id;
                  }), (function (x) {
                    return x.id;
                  }), Json_decode.list(tUniv, yamlData.disadvantagesUniv), Json_decode.list(tL10n, yamlData.disadvantagesL10n)));
}

var Decode = {
  tL10n: tL10n,
  cost: cost,
  tUniv: tUniv,
  t: t,
  all: all
};

export {
  Decode ,
  
}
/* Advantage-OptolithClient Not a pure module */