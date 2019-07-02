import { flip, ident } from "../../Data/Function";
import { fmap, fmapF } from "../../Data/Functor";
import { consF, elem, filter, filterMulti, foldr, intercalate, List, map, notElemF } from "../../Data/List";
import { bindF, fromMaybe, Just, liftM2, liftM3, listToMaybe, mapMaybe, Maybe, Nothing } from "../../Data/Maybe";
import { insert, lookup, OrderedMap } from "../../Data/OrderedMap";
import { member, OrderedSet } from "../../Data/OrderedSet";
import { Record } from "../../Data/Record";
import { uncurryN, uncurryN3 } from "../../Data/Tuple/Curry";
import { ActivatableCategory, Categories } from "../Constants/Categories";
import { IdPrefixes } from "../Constants/IdPrefixes";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject";
import { ActiveObjectWithId } from "../Models/ActiveEntries/ActiveObjectWithId";
import { EntryRating } from "../Models/Hero/heroTypeHelpers";
import { ActivatableActivationValidation } from "../Models/View/ActivatableActivationValidationObject";
import { ActivatableCombinedName } from "../Models/View/ActivatableCombinedName";
import { ActivatableNameCost } from "../Models/View/ActivatableNameCost";
import { ActiveActivatable, ActiveActivatableA_ } from "../Models/View/ActiveActivatable";
import { Advantage } from "../Models/Wiki/Advantage";
import { Culture } from "../Models/Wiki/Culture";
import { Disadvantage } from "../Models/Wiki/Disadvantage";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { Profession } from "../Models/Wiki/Profession";
import { Race } from "../Models/Wiki/Race";
import { SpecialAbility } from "../Models/Wiki/SpecialAbility";
import { heroReducer } from "../Reducers/heroReducer";
import { getAllActiveByCategory } from "../Utilities/Activatable/activatableActiveUtils";
import { getModifierByActiveLevel, getModifierByIsActive } from "../Utilities/Activatable/activatableModifierUtils";
import { getBracketedNameFromFullName } from "../Utilities/Activatable/activatableNameUtils";
import { getActiveSelections, getSelectOptionName } from "../Utilities/Activatable/selectionUtils";
import { createMapSelectorP } from "../Utilities/createMapSelector";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { filterAndSortRecordsBy } from "../Utilities/filterAndSortBy";
import { compareLocale } from "../Utilities/I18n";
import { prefixId, prefixSA } from "../Utilities/IDUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { mapCurrentHero, mapGetToMaybeSlice, mapGetToSlice } from "../Utilities/SelectorsUtils";
import { blessedSpecialAbilityGroups, combatSpecialAbilityGroups, generalSpecialAbilityGroups, magicalSpecialAbilityGroups } from "../Utilities/sheetUtils";
import { comparingR, sortStrings } from "../Utilities/sortBy";
import { misStringM } from "../Utilities/typeCheckUtils";
import { getBlessedTraditionFromWikiState } from "./liturgicalChantsSelectors";
import { getCurrentCulture, getCurrentProfession, getCurrentRace } from "./rcpSelectors";
import { getSpecialAbilitiesSortOptions } from "./sortOptionsSelectors";
import { getMagicalTraditionsFromWiki } from "./spellsSelectors";
import { getAdvantages, getAdvantagesFilterText, getCultureAreaKnowledge, getCurrentHeroPresent, getDisadvantages, getDisadvantagesFilterText, getHeroes, getLocaleAsProp, getSpecialAbilities, getSpecialAbilitiesFilterText, getWiki, getWikiSpecialAbilities } from "./stateSelectors";

export const getActive = <T extends ActivatableCategory>(category: T, addLevelToName: boolean) =>
  createMaybeSelector (
    getLocaleAsProp,
    getWiki,
    getCurrentHeroPresent,
    (l10n, wiki, mhero) => fmapF (mhero) (getAllActiveByCategory (category)
                                                                 (addLevelToName)
                                                                 (l10n)
                                                                 (wiki))
  )

export const getActiveMap =
  (addLevelToName: boolean) =>
  <T extends ActivatableCategory>
  (category: T) =>
    createMapSelectorP (getHeroes)
                       (getWiki, getLocaleAsProp)
                       (heroReducer.A.present)
                       ((wiki, l10n) => getAllActiveByCategory (category)
                                                               (addLevelToName)
                                                               (l10n)
                                                               (wiki))

export const getActiveForView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, false)

export const getActiveForEditView = <T extends ActivatableCategory>(category: T) =>
  getActive (category, true)

export const getActiveForViewMap = getActiveMap (false)

export const getActiveForEditViewMap = getActiveMap (true)

type RatingMap = OrderedMap<string, EntryRating>

const insertRating = flip (insert as insert<string, EntryRating>)

export const getAdvantagesRating = createMaybeSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A.commonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A.uncommonAdvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A.commonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A.uncommonAdvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A.suggestedAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A.unsuitableAdvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A.stronglyRecommendedAdvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getDisadvantagesRating = createMaybeSelector (
  getCurrentRace,
  getCurrentCulture,
  getCurrentProfession,
  (mrace, mculture, mprofession) =>
    liftM3 ((r: Record<Race>) => (c: Record<Culture>) => (p: Record<Profession>) =>
             pipe_ (
               OrderedMap.empty as RatingMap,

               flip (foldr (insertRating (EntryRating.Common)))
                    (Race.A.commonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Race.A.uncommonDisadvantages (r)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Culture.A.commonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Culture.A.uncommonDisadvantages (c)),

               flip (foldr (insertRating (EntryRating.Common)))
                    (Profession.A.suggestedDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Uncommon)))
                    (Profession.A.unsuitableDisadvantages (p)),

               flip (foldr (insertRating (EntryRating.Essential)))
                    (Race.A.stronglyRecommendedDisadvantages (r))
             ))
           (mrace)
           (mculture)
           (mprofession)
)

export const getAdvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.ADVANTAGES),
  ident
)

export const getAdvantagesForEditMap = getActiveForEditViewMap (Categories.ADVANTAGES)

export const getAdvantagesForEdit = mapCurrentHero (getAdvantagesForEditMap)

export const getFilteredActiveAdvantages = createMaybeSelector (
  getAdvantagesForEdit,
  getAdvantagesFilterText,
  getLocaleAsProp,
  (madvantages, filterText, l10n) =>
    fmapF (madvantages)
          (filterAndSortRecordsBy (0)
                                  <ActiveActivatable<Advantage>>
                                  ([ActiveActivatableA_.name])
                                  ([comparingR (ActiveActivatableA_.name)
                                               (compareLocale (L10n.A.id (l10n)))])
                                  (filterText))
)

export const getDisadvantagesForSheet = createMaybeSelector (
  getActiveForView (Categories.DISADVANTAGES),
  ident
)

export const getDisadvantagesForEditMap = getActiveForEditViewMap (Categories.DISADVANTAGES)

export const getDisadvantagesForEdit = mapCurrentHero (getDisadvantagesForEditMap)

export const getFilteredActiveDisadvantages = createMaybeSelector (
  getDisadvantagesForEdit,
  getDisadvantagesFilterText,
  getLocaleAsProp,
  (mdisadvantages, filterText, l10n) =>
    fmapF (mdisadvantages)
          (filterAndSortRecordsBy (0)
                                  <ActiveActivatable<Disadvantage>>
                                  ([ActiveActivatableA_.name])
                                  ([comparingR (ActiveActivatableA_.name)
                                               (compareLocale (L10n.A.id (l10n)))])
                                  (filterText))
)

export const getSpecialAbilitiesForSheet = createMaybeSelector (
  getActiveForView (Categories.SPECIAL_ABILITIES),
  ident
)

export const getSpecialAbilitiesForEditMap = getActiveForEditViewMap (Categories.SPECIAL_ABILITIES)

export const getSpecialAbilitiesForEdit = mapCurrentHero (getSpecialAbilitiesForEditMap)

export const getFilteredActiveSpecialAbilities = createMaybeSelector (
  getSpecialAbilitiesForEdit,
  getSpecialAbilitiesSortOptions,
  getSpecialAbilitiesFilterText,
  (mspecial_abilities, sortOptions, filterText) =>
    fmapF (mspecial_abilities)
          (filterAndSortRecordsBy (0)
                                  <ActiveActivatable<SpecialAbility>>
                                  ([ActiveActivatableA_.name])
                                  (sortOptions)
                                  (filterText))
)

export const getGeneralSpecialAbilitiesForSheet = createMaybeSelector (
  getWikiSpecialAbilities,
  getSpecialAbilitiesForSheet,
  getCultureAreaKnowledge,
  (wiki_special_abilities, mspecial_abilities, culture_area_knowledge_text) =>
    liftM2 ((culture_area_knowledge: Record<SpecialAbility>) =>
            (special_abilities: List<Record<ActiveActivatable<SpecialAbility>>>) =>
              pipe_ (
                special_abilities,
                filterMulti<Record<ActiveActivatable<SpecialAbility>>>
                  (List (
                    pipe (
                      ActiveActivatable.A.wikiEntry,
                      SpecialAbility.AL.gr,
                      flip (member) (generalSpecialAbilityGroups)
                    ),
                    pipe (
                      ActiveActivatable.A.wikiEntry,
                      SpecialAbility.AL.id,
                      notElemF (List (prefixSA (27), prefixSA (29)))
                    )
                  )),
                consF (ActiveActivatable ({
                        nameAndCost: ActivatableNameCost ({
                          active: ActiveObjectWithId ({
                            id: SpecialAbility.A.id (culture_area_knowledge),
                            sid: Nothing,
                            sid2: Nothing,
                            tier: Nothing,
                            cost: Nothing,
                            index: Nothing,
                          }),
                          finalCost: 0,
                          naming: ActivatableCombinedName ({
                            name:
                              `${SpecialAbility.A.name (culture_area_knowledge)}`
                              + ` (${fromMaybe ("") (culture_area_knowledge_text)})`,
                            baseName: SpecialAbility.A.name (culture_area_knowledge),
                            addName: culture_area_knowledge_text,
                          }),
                        }),
                        validation: ActivatableActivationValidation ({
                          disabled: true,
                          maxLevel: Nothing,
                          minLevel: Nothing,
                        }),
                        heroEntry: ActivatableDependent.default,
                        wikiEntry: SpecialAbility.default,
                      }) as Record<ActiveActivatable<SpecialAbility>>)))
           (lookup (prefixId (IdPrefixes.SPECIAL_ABILITIES) (22))
                   (wiki_special_abilities))
           (mspecial_abilities)
)

const getSpecialAbilitiesByGroups =
  (grs: OrderedSet<number>) =>
    fmap (filter (pipe (
      ActiveActivatable.A.wikiEntry,
      SpecialAbility.AL.gr,
      flip (member) (grs)
    ))) as ident<Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>>

export const getCombatSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (combatSpecialAbilityGroups)
)

export const getMagicalSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (magicalSpecialAbilityGroups)
)

export const getBlessedSpecialAbilitiesForSheet = createMaybeSelector (
  getSpecialAbilitiesForSheet,
  getSpecialAbilitiesByGroups (blessedSpecialAbilityGroups)
)

export const getFatePointsModifier = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages) ("ADV_14"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_31"),
  uncurryN (getModifierByIsActive (Nothing))
)

export const getMagicalTraditionForSheet = createMaybeSelector (
  getMagicalTraditionsFromWiki,
  pipe (
    map (pipe (SpecialAbility.A.name, getBracketedNameFromFullName)),
    intercalate (", ")
  )
)

export const getBlessedTraditionForSheet = createMaybeSelector (
  getBlessedTraditionFromWikiState,
  fmap (pipe (SpecialAbility.A.name, getBracketedNameFromFullName))
)

const getPropertyOrAspectKnowledgesForSheet =
  uncurryN3 ((l10n: L10nRecord) => liftM2 ((wiki_entry: Record<SpecialAbility>) =>
                                            pipe (
                                              getActiveSelections,
                                              mapMaybe (pipe (
                                                Just,
                                                getSelectOptionName (wiki_entry)
                                              )),
                                              sortStrings (l10n),
                                              intercalate (", ")
                                            )))

export const getPropertyKnowledgesForSheet = createMaybeSelector (
  getLocaleAsProp,
  mapGetToSlice (getWikiSpecialAbilities) ("SA_72"),
  mapGetToSlice (getSpecialAbilities) ("SA_72"),
  getPropertyOrAspectKnowledgesForSheet
)

export const getAspectKnowledgesForSheet = createMaybeSelector (
  getLocaleAsProp,
  mapGetToSlice (getWikiSpecialAbilities) ("SA_87"),
  mapGetToSlice (getSpecialAbilities) ("SA_87"),
  getPropertyOrAspectKnowledgesForSheet
)

export const getInitialStartingWealth = createMaybeSelector (
  mapGetToMaybeSlice (getAdvantages) ("ADV_36"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_2"),
  (rich, poor) => getModifierByActiveLevel (Just (0)) (rich) (poor) * 250 + 750
)

export const isAlbino = createMaybeSelector (
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_45"),
  fmap (pipe (
    getActiveSelections,
    elem<string | number> (1)
  ))
)

export const getGuildMageUnfamiliarSpellId = createMaybeSelector (
  mapGetToSlice (getSpecialAbilities) (prefixSA (70)),
  pipe (
    bindF (pipe (ActivatableDependent.A.active, listToMaybe)),
    fmap (pipe (ActiveObject.A.sid, misStringM))
  )
)
