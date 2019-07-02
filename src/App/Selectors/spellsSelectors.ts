import { notP } from "../../Data/Bool";
import { ident, thrush } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { set } from "../../Data/Lens";
import { append, consF, countWith, elemF, List, map, notNull, partition } from "../../Data/List";
import { all, any, bindF, ensure, fromMaybe_, Just, liftM2, listToMaybe, mapMaybe, Maybe, maybe, Nothing } from "../../Data/Maybe";
import { elems, lookup, lookupF, OrderedMap } from "../../Data/OrderedMap";
import { member } from "../../Data/OrderedSet";
import { Record } from "../../Data/Record";
import { fst, snd } from "../../Data/Tuple";
import { uncurryN, uncurryN3, uncurryN5, uncurryN6, uncurryN8 } from "../../Data/Tuple/Curry";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActivatableSkillDependent, createInactiveActivatableSkillDependent } from "../Models/ActiveEntries/ActivatableSkillDependent";
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject";
import { HeroModel } from "../Models/Hero/HeroModel";
import { CantripCombined } from "../Models/View/CantripCombined";
import { SpellWithRequirements, SpellWithRequirementsL } from "../Models/View/SpellWithRequirements";
import { Cantrip } from "../Models/Wiki/Cantrip";
import { ExperienceLevel } from "../Models/Wiki/ExperienceLevel";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { Spell, SpellL } from "../Models/Wiki/Spell";
import { selectToDropdownOption } from "../Models/Wiki/sub/SelectOption";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { getModifierByActiveLevel } from "../Utilities/Activatable/activatableModifierUtils";
import { getMagicalTraditionsHeroEntries } from "../Utilities/Activatable/traditionUtils";
import { composeL } from "../Utilities/compose";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { prefixAdv, prefixDis, prefixSA } from "../Utilities/IDUtils";
import { isOwnTradition, isSpellDecreasable, isSpellIncreasable, isUnfamiliarSpell } from "../Utilities/Increasable/spellUtils";
import { lte } from "../Utilities/mathUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { validatePrerequisites } from "../Utilities/Prerequisites/validatePrerequisitesUtils";
import { filterByAvailability } from "../Utilities/RulesUtils";
import { mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils";
import { sortRecordsBy, sortRecordsByName } from "../Utilities/sortBy";
import { misNumberM } from "../Utilities/typeCheckUtils";
import { getStartEl } from "./elSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getCantripsSortOptions, getSpellsCombinedSortOptions, getSpellsSortOptions } from "./sortOptionsSelectors";
import { getAdvantages, getCantrips, getDisadvantages, getHeroProp, getInactiveSpellsFilterText, getLocaleAsProp, getMaybeSpecialAbilities, getPhase, getSpecialAbilities, getSpells, getSpellsFilterText, getWiki, getWikiCantrips, getWikiSpecialAbilities, getWikiSpells } from "./stateSelectors";
import { getEnableActiveItemHints } from "./uisettingsSelectors";

const HA = HeroModel.A
const WA = WikiModel.A
const ELA = ExperienceLevel.A
const ADA = ActivatableDependent.A
const AOA = ActiveObject.A
const ASDA = ActivatableSkillDependent.A
const CA = Cantrip.A
const CCA = CantripCombined.A
const SWRA = SpellWithRequirements.A
const SWRL = SpellWithRequirementsL
const SA = Spell.A
const SL = SpellL
const SAA = SpecialAbility.A

export const getMagicalTraditionsFromHero = createMaybeSelector (
  getSpecialAbilities,
  getMagicalTraditionsHeroEntries
)

const getMaybeMagicalTraditionsFromHero = createMaybeSelector (
  getMaybeSpecialAbilities,
  fmap (getMagicalTraditionsHeroEntries)
)

export const getMagicalTraditionsFromWiki = createMaybeSelector (
  getWikiSpecialAbilities,
  getMagicalTraditionsFromHero,
  uncurryN (
    wiki_special_abilities =>
      mapMaybe (pipe (ActivatableDependent.A.id, lookupF (wiki_special_abilities)))
  )
)

export const getIsSpellsTabAvailable = createMaybeSelector (
  getMaybeMagicalTraditionsFromHero,
  any (notNull)
)

export const getActiveSpells = createMaybeSelector (
  getStartEl,
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (16)),
  mapGetToSlice (getSpecialAbilities) (prefixSA (72)),
  getWiki,
  getHeroProp,
  getMagicalTraditionsFromHero,
  (mstart_el, mexceptional_skill, maproperty_knowledge, wiki, hero, trads) => {
    const isUnfamiliar = isUnfamiliarSpell (trads)

    return fmap ((start_el: Record<ExperienceLevel>) =>
                  thrush (elems (HA.spells (hero)))
                         (mapMaybe (pipe (
                           ensure (ASDA.active),
                           bindF (hero_entry =>
                                   pipe_ (
                                     wiki,
                                     WA.spells,
                                     lookup (ASDA.id (hero_entry)),
                                     fmap (wiki_entry =>
                                       SpellWithRequirements ({
                                         isIncreasable:
                                           isSpellIncreasable (start_el)
                                                              (HA.phase (hero))
                                                              (HA.attributes (hero))
                                                              (mexceptional_skill)
                                                              (maproperty_knowledge)
                                                              (wiki_entry)
                                                              (hero_entry),
                                         isDecreasable:
                                           isSpellDecreasable (wiki)
                                                              (hero)
                                                              (maproperty_knowledge)
                                                              (wiki_entry)
                                                              (hero_entry),
                                         isUnfamiliar: isUnfamiliar (wiki_entry),
                                         stateEntry: hero_entry,
                                         wikiEntry: wiki_entry,
                                       })
                                     )
                                   ))
                         ))))
                (mstart_el)
  }
)

export const getActiveAndInactiveCantrips = createMaybeSelector (
  getMagicalTraditionsFromHero,
  getWikiCantrips,
  getCantrips,
  uncurryN3 (trads =>
             wiki_cantrips => fmap (hero_cantrips => {
                                    const isUnfamiliar = isUnfamiliarSpell (trads)

                                    return pipe_ (
                                      wiki_cantrips,
                                      elems,
                                      map (wiki_entry => CantripCombined ({
                                        wikiEntry: wiki_entry,
                                        active: member (CA.id (wiki_entry))
                                                       (hero_cantrips),
                                        isUnfamiliar: isUnfamiliar (wiki_entry),
                                      })),
                                      partition (CCA.active)
                                    )
                                  }))
)

export const getActiveCantrips = createMaybeSelector (
  getActiveAndInactiveCantrips,
  fmap (fst)
)

export const getInactiveCantrips = createMaybeSelector (
  getActiveAndInactiveCantrips,
  fmap (snd)
)

export const getActiveSpellsCounter = createMaybeSelector (
  getActiveSpells,
  pipe (
    fmap (countWith (pipe (SWRA.wikiEntry, SA.gr, elemF (List (1, 2))))),
    Maybe.sum
  )
)

export const getIsMaximumOfSpellsReached = createMaybeSelector (
  getActiveSpellsCounter,
  getPhase,
  getStartEl,
  uncurryN3 (active =>
             liftM2 (phase =>
                     start_el => {
                       if (phase > 2) {
                         return false
                       }

                       return active >= ELA.maxSpellsLiturgicalChants (start_el)
                     }))
)

const getUnfamiliarSpellsCount = createMaybeSelector (
  getActiveSpells,
  maybe (0) (countWith (SWRA.isUnfamiliar))
)

const isUnfamiliarSpellsActivationDisabled = createMaybeSelector (
  getUnfamiliarSpellsCount,
  getStartEl,
  uncurryN (count => maybe (false) (pipe (ELA.maxUnfamiliarSpells, lte (count))))
)

type Combined = Record<SpellWithRequirements>

export const getInactiveSpells = createMaybeSelector (
  getWiki,
  getMagicalTraditionsFromHero,
  getWikiSpells,
  getHeroProp,
  getMagicalTraditionsFromWiki,
  isUnfamiliarSpellsActivationDisabled,
  getIsMaximumOfSpellsReached,
  getSpells,
  uncurryN8 (
    wiki =>
    trads_hero =>
    wiki_spells =>
    hero =>
    trads_wiki =>
    is_max_unfamiliar =>
      liftM2 (is_max =>
              hero_spells => {
        const isLastTrad = pipe_ (trads_wiki, listToMaybe, fmap (SAA.id), Maybe.elemF)

        const isSpellPrereqsValid =
          (entry: Record<Spell>) =>
            validatePrerequisites (wiki)
                                  (hero)
                                  (SA.prerequisites (entry))
                                  (SA.id (entry))

        const isUnfamiliar = isUnfamiliarSpell (trads_hero)

        if (isLastTrad (prefixSA (679))) {
          if (is_max) {
            return List<Combined> ()
          }

          const f = (k: string) => (wiki_entry: Record<Spell>) => {
            const mhero_entry = lookup (k) (hero_spells)

            if (isSpellPrereqsValid (wiki_entry)
                && SA.gr (wiki_entry) < 3
                && (isOwnTradition (trads_wiki) (wiki_entry) || !is_max_unfamiliar)
                && all (notP (ASDA.active)) (mhero_entry)) {
              return consF (SpellWithRequirements ({
                wikiEntry: wiki_entry,
                stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                                       (mhero_entry),
                isUnfamiliar: isUnfamiliar (wiki_entry),
                isDecreasable: Nothing,
                isIncreasable: Nothing,
              }))
            }

            return ident as ident<List<Record<SpellWithRequirements>>>
          }

          return OrderedMap.foldrWithKey (f)
                                         (List ())
                                         (wiki_spells)
        }

        if (isLastTrad (prefixSA (677)) || isLastTrad (prefixSA (678))) {
          if (is_max) {
            return List<Combined> ()
          }

          const msub_trad =
            pipe_ (
              trads_hero,
              listToMaybe,
              bindF (pipe (ADA.active, listToMaybe)),
              bindF (AOA.sid),
              misNumberM
            )

          const g = (k: string) => (wiki_entry: Record<Spell>) => {
            const mhero_entry = lookup (k) (hero_spells)

            if (isSpellPrereqsValid (wiki_entry)
                && isOwnTradition (trads_wiki) (wiki_entry)
                && Maybe.or (fmapF (msub_trad) (elemF (SA.subtradition (wiki_entry))))
                && all (notP (ASDA.active)) (mhero_entry)) {
              return consF (SpellWithRequirements ({
                wikiEntry: wiki_entry,
                stateEntry: fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                                       (mhero_entry),
                isUnfamiliar: isUnfamiliar (wiki_entry),
                isDecreasable: Nothing,
                isIncreasable: Nothing,
              }))
            }

            return ident as ident<List<Record<SpellWithRequirements>>>
          }

          return OrderedMap.foldrWithKey (g)
                                         (List ())
                                         (wiki_spells)
        }

        const h = (k: string) => (wiki_entry: Record<Spell>) => {
          const mhero_entry = lookup (k) (hero_spells)

          if ((!is_max || SA.gr (wiki_entry) > 2)
              && isSpellPrereqsValid (wiki_entry)
              && (isOwnTradition (trads_wiki) (wiki_entry)
                  || (SA.gr (wiki_entry) < 3 && !is_max_unfamiliar))
              && all (notP (ASDA.active)) (mhero_entry)) {
            return consF (SpellWithRequirements ({
              wikiEntry: wiki_entry,
              stateEntry:
                fromMaybe_ (() => createInactiveActivatableSkillDependent (k))
                           (mhero_entry),
              isUnfamiliar: isUnfamiliar (wiki_entry),
              isDecreasable: Nothing,
              isIncreasable: Nothing,
            }))
          }

          return ident as ident<List<Record<SpellWithRequirements>>>
        }

        return OrderedMap.foldrWithKey (h)
                                       (List ())
                                       (wiki_spells)
      }))
)

export const getAvailableInactiveSpells = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveSpells,
  uncurryN (liftM2 (filterByAvailability (pipe (SWRA.wikiEntry, SA.src))))
)

export const getAvailableInactiveCantrips = createMaybeSelector (
  getRuleBooksEnabled,
  getInactiveCantrips,
  uncurryN (liftM2 (filterByAvailability (pipe (CCA.wikiEntry, CA.src))))
)

type ListCombined = List<Record<SpellWithRequirements> | Record<CantripCombined>>

export const getActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpells,
  getActiveCantrips,
  uncurryN (liftM2<ListCombined, ListCombined, ListCombined> (append))
)

export const getAvailableInactiveSpellsAndCantrips = createMaybeSelector (
  getAvailableInactiveSpells,
  getAvailableInactiveCantrips,
  uncurryN (liftM2<ListCombined, ListCombined, ListCombined> (append))
)

type getNameFromSpellOrCantrip =
  (x: Record<SpellWithRequirements | CantripCombined>) => string

const getNameFromSpellOrCantrip =
  (x: Record<SpellWithRequirements> | Record<CantripCombined>) =>
    SpellWithRequirements.is (x)
      ? pipe_ (x, SWRA.wikiEntry, SA.name)
      : pipe_ (x, CCA.wikiEntry, CA.name)

export const getFilteredActiveSpellsAndCantrips = createMaybeSelector (
  getActiveSpellsAndCantrips,
  getSpellsCombinedSortOptions,
  getSpellsFilterText,
  getLocaleAsProp,
  (mcombineds, sort_options, filter_text) =>
    fmapF (mcombineds)
          (filterAndSortRecordsBy (0)
                                  ([getNameFromSpellOrCantrip as getNameFromSpellOrCantrip])
                                  (sort_options)
                                  (filter_text)) as Maybe<ListCombined>
)

export const getFilteredInactiveSpellsAndCantrips = createMaybeSelector (
  getSpellsCombinedSortOptions,
  getInactiveSpellsFilterText,
  getEnableActiveItemHints,
  getAvailableInactiveSpellsAndCantrips,
  getActiveSpellsAndCantrips,
  uncurryN5 (sort_options =>
             filter_text =>
             areActiveItemHintsEnabled =>
             liftM2 (inactive =>
                     active =>
                       filterAndSortRecordsBy (0)
                                              ([getNameFromSpellOrCantrip as
                                                getNameFromSpellOrCantrip])
                                              (sort_options)
                                              (filter_text)
                                              (areActiveItemHintsEnabled
                                                ? append (active) (inactive)
                                                : inactive) as ListCombined))
)

export const isActivationDisabled = createMaybeSelector (
  getActiveSpellsCounter,
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (58)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (59)),
  getMagicalTraditionsFromHero,
  getStartEl,
  getPhase,
  uncurryN6 (active_spells =>
             mbonus =>
             mmalus =>
             hero_trads =>
               liftM2 (start_el =>
                       phase =>
                         pipe_ (
                           hero_trads,
                           listToMaybe,
                           maybe (true)
                                 (trad => {
                                   const trad_id = ADA.id (trad)

                                   if (trad_id === prefixSA (679)) {
                                     const max_spells =
                                       getModifierByActiveLevel (Just (3))
                                                                (mbonus)
                                                                (mmalus)

                                     if (active_spells >= max_spells) {
                                       return true
                                     }
                                   }

                                   const maxSpellsLiturgicalChants =
                                     ExperienceLevel.A.maxSpellsLiturgicalChants (start_el)

                                   return phase < 3 && active_spells >= maxSpellsLiturgicalChants
                                 })
                         )))
)

export const getCantripsForSheet = createMaybeSelector (
  getCantripsSortOptions,
  getActiveCantrips,
  uncurryN (sort_options => fmap (sortRecordsBy (sort_options)))
)

export const getSpellsForSheet = createMaybeSelector (
  getSpellsSortOptions,
  getMagicalTraditionsFromWiki,
  getActiveSpells,
  uncurryN3 (sort_options =>
              wiki_trads => fmap (pipe (
                                   map (s => isOwnTradition (wiki_trads)
                                                            (SWRA.wikiEntry (s))
                                               ? set (composeL (SWRL.wikiEntry, SL.tradition))
                                                     (List ())
                                                     (s)
                                               : s),
                                   sortRecordsBy (sort_options)
                                 )))
)

export const getAllSpellsForManualGuildMageSelect = createMaybeSelector (
  getLocaleAsProp,
  getWikiSpecialAbilities,
  uncurryN (l10n => pipe (
                      lookup (prefixSA (70)),
                      bindF (SAA.select),
                      fmap (pipe (
                        map (selectToDropdownOption),
                        sortRecordsByName (l10n)
                      ))
                    ))
)
