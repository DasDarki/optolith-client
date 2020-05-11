import { join } from "path"
import { handleE } from "../../Control/Exception"
import { Either, eitherToMaybe, Right } from "../../Data/Either"
import { ident } from "../../Data/Function"
import { fmap } from "../../Data/Functor"
import { all, fromArray, List } from "../../Data/List"
import { bindF, ensure, mapM, Maybe } from "../../Data/Maybe"
import { fromList, lookup, mapMaybe, OrderedMap, toObjectWith } from "../../Data/OrderedMap"
import { Record, StringKeyObject } from "../../Data/Record"
import { parseJSON } from "../../Data/String/JSON"
import { Pair, Tuple } from "../../Data/Tuple"
import { deleteFile, existsFile, readFile, writeFile } from "../../System/IO"
import { AppState, AppStateRecord } from "../Models/AppState"
import { APCache, Cache, PresavedCache } from "../Models/Cache"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { HeroesState } from "../Models/HeroesState"
import { AdventurePointsCategories } from "../Models/View/AdventurePointsCategories"
import { heroReducer } from "../Reducers/heroReducer"
import { getAPObjectMap, getAPSpentMap, getAPSpentOnAdvantagesMap, getAPSpentOnAttributesMap, getAPSpentOnBlessedAdvantagesMap, getAPSpentOnBlessedDisadvantagesMap, getAPSpentOnBlessingsMap, getAPSpentOnCantripsMap, getAPSpentOnCombatTechniquesMap, getAPSpentOnDisadvantagesMap, getAPSpentOnEnergiesMap, getAPSpentOnLiturgicalChantsMap, getAPSpentOnMagicalAdvantagesMap, getAPSpentOnMagicalDisadvantagesMap, getAPSpentOnSkillsMap, getAPSpentOnSpecialAbilitiesMap, getAPSpentOnSpellsMap, getAvailableAPMap } from "../Selectors/adventurePointsSelectors"
import { current_version, user_data_path } from "../Selectors/envSelectors"
import { getHeroes } from "../Selectors/stateSelectors"
import { pipe, pipe_ } from "./pipe"
import { isObject } from "./typeCheckUtils"

const file_path = join (user_data_path, "cache.json")

/**
 * Key in cache file to store adventure points.
 */
export const AP_KEY = "ap"

const ap_cache_keys: List<keyof APCache> =
  List (
    "spent",
    "spentOnAttributes",
    "spentOnSkills",
    "spentOnCombatTechniques",
    "spentOnSpells",
    "spentOnLiturgicalChants",
    "spentOnCantrips",
    "spentOnBlessings",
    "spentOnEnergies"
  )

const ap_optional_cache_keys: List<keyof APCache> =
  List (
    "available",
    "spentOnAdvantages",
    "spentOnMagicalAdvantages",
    "spentOnBlessedAdvantages",
    "spentOnDisadvantages",
    "spentOnMagicalDisadvantages",
    "spentOnBlessedDisadvantages",
    "spentOnSpecialAbilities"
  )

export const readCache =
  async () =>
    pipe_ (
      file_path,
      readFile,
      handleE,
      fmap (pipe (
        eitherToMaybe,
        bindF (parseJSON),
        bindF (ensure (isObject)),
        bindF (x => Maybe ((x as any) [AP_KEY])),
        bindF (ensure (isObject)),
        bindF (pipe (
          Object.entries,
          fromArray,
          mapM (pipe (
            ensure ((e): e is [string, APCache] =>
                     all ((k: keyof APCache) => typeof e [1] [k] === "number")
                         (ap_cache_keys)
                     && all ((k: keyof APCache) => typeof e [1] [k] === "number"
                                                   || e [1] [k] === undefined)
                            (ap_optional_cache_keys)),
            fmap (Tuple.fromArray)
          ))
        )),
        fmap (fromList)
      ))
    )

export const writeCache =
  pipe (
    (m: PresavedCache["ap"]): Cache => ({
      appVersion: current_version,
      ap: m,
    }),
    JSON.stringify,
    writeFile (file_path),
    handleE
  )

export const deleteCache: () => Promise<Either<Error, void>> =
  async () => await existsFile (file_path)
              ? pipe_ (file_path, deleteFile, handleE)
              : Right<void> (undefined)

const fromNumOrPair =
  (x: number | [number, number]) => typeof x === "number" ? Pair (x, x) : Pair (...x)

const unsafeFromNumOrPair =
  (x: number | [number, number] | undefined) => fmap (fromNumOrPair) (Maybe (x))

export const insertCacheAt =
  (key_str: string) =>
  (cache: APCache) => {
    getAPSpentMap .setCacheAt (key_str)
                              (cache.spent)
    getAvailableAPMap .setCacheAt (key_str)
                                  (Maybe (cache.available))
    getAPSpentOnAttributesMap .setCacheAt (key_str)
                                          (cache.spentOnAttributes)
    getAPSpentOnSkillsMap .setCacheAt (key_str)
                                      (cache.spentOnSkills)
    getAPSpentOnCombatTechniquesMap .setCacheAt (key_str)
                                                (cache.spentOnCombatTechniques)
    getAPSpentOnSpellsMap .setCacheAt (key_str)
                                      (cache.spentOnSpells)
    getAPSpentOnLiturgicalChantsMap .setCacheAt (key_str)
                                                (cache.spentOnLiturgicalChants)
    getAPSpentOnCantripsMap .setCacheAt (key_str)
                                        (cache.spentOnCantrips)
    getAPSpentOnBlessingsMap .setCacheAt (key_str)
                                         (cache.spentOnBlessings)
    getAPSpentOnEnergiesMap .setCacheAt (key_str)
                                        (cache.spentOnEnergies)
    getAPSpentOnAdvantagesMap .setCacheAt (key_str)
                                          (unsafeFromNumOrPair (cache.spentOnAdvantages))
    getAPSpentOnBlessedAdvantagesMap .setCacheAt (key_str)
                                                 (unsafeFromNumOrPair (
                                                   cache.spentOnBlessedAdvantages
                                                 ))
    getAPSpentOnMagicalAdvantagesMap .setCacheAt (key_str)
                                                 (unsafeFromNumOrPair (
                                                   cache.spentOnMagicalAdvantages
                                                 ))
    getAPSpentOnDisadvantagesMap .setCacheAt (key_str)
                                             (unsafeFromNumOrPair (cache.spentOnDisadvantages))
    getAPSpentOnBlessedDisadvantagesMap .setCacheAt (key_str)
                                                    (unsafeFromNumOrPair (
                                                      cache.spentOnBlessedDisadvantages
                                                    ))
    getAPSpentOnMagicalDisadvantagesMap .setCacheAt (key_str)
                                                    (unsafeFromNumOrPair (
                                                      cache.spentOnMagicalDisadvantages
                                                    ))
    getAPSpentOnSpecialAbilitiesMap .setCacheAt (key_str)
                                                (Maybe (cache.spentOnSpecialAbilities))
  }

export const insertCacheMap =
  (map: StrMap<APCache>) => {
    OrderedMap.mapWithKey<string, APCache, void> (insertCacheAt) (map)
  }

export const insertHeroesCache =
  (hs: HeroesState["heroes"]) => {
    getAPSpentMap .setBaseMap (hs)
    getAvailableAPMap .setBaseMap (hs)
    getAPSpentOnAttributesMap .setBaseMap (hs)
    getAPSpentOnSkillsMap .setBaseMap (hs)
    getAPSpentOnCombatTechniquesMap .setBaseMap (hs)
    getAPSpentOnSpellsMap .setBaseMap (hs)
    getAPSpentOnLiturgicalChantsMap .setBaseMap (hs)
    getAPSpentOnCantripsMap .setBaseMap (hs)
    getAPSpentOnBlessingsMap .setBaseMap (hs)
    getAPSpentOnEnergiesMap .setBaseMap (hs)
    getAPSpentOnAdvantagesMap .setBaseMap (hs)
    getAPSpentOnBlessedAdvantagesMap .setBaseMap (hs)
    getAPSpentOnMagicalAdvantagesMap .setBaseMap (hs)
    getAPSpentOnDisadvantagesMap .setBaseMap (hs)
    getAPSpentOnBlessedDisadvantagesMap .setBaseMap (hs)
    getAPSpentOnMagicalDisadvantagesMap .setBaseMap (hs)
    getAPSpentOnSpecialAbilitiesMap .setBaseMap (hs)
  }

export const forceCacheIsAvailable =
  (id: string) =>
  (state: AppStateRecord) =>
  (props: { hero: HeroModelRecord }) => {
    getAPSpentMap (id) (state, props)
    getAvailableAPMap (id) (state, props)
    getAPSpentOnAttributesMap (id) (state)
    getAPSpentOnSkillsMap (id) (state)
    getAPSpentOnCombatTechniquesMap (id) (state)
    getAPSpentOnSpellsMap (id) (state)
    getAPSpentOnLiturgicalChantsMap (id) (state)
    getAPSpentOnCantripsMap (id) (state)
    getAPSpentOnBlessingsMap (id) (state)
    getAPSpentOnEnergiesMap (id) (state)
    getAPSpentOnAdvantagesMap (id) (state, props)
    getAPSpentOnBlessedAdvantagesMap (id) (state, props)
    getAPSpentOnMagicalAdvantagesMap (id) (state, props)
    getAPSpentOnDisadvantagesMap (id) (state, props)
    getAPSpentOnBlessedDisadvantagesMap (id) (state, props)
    getAPSpentOnMagicalDisadvantagesMap (id) (state, props)
    getAPSpentOnSpecialAbilitiesMap (id) (state, props)
  }

export const insertAppStateCache =
  (s: AppStateRecord) => {
    getAPSpentMap .setState (s)
    getAvailableAPMap .setState (s)
    getAPSpentOnAttributesMap .setState (s)
    getAPSpentOnSkillsMap .setState (s)
    getAPSpentOnCombatTechniquesMap .setState (s)
    getAPSpentOnSpellsMap .setState (s)
    getAPSpentOnLiturgicalChantsMap .setState (s)
    getAPSpentOnCantripsMap .setState (s)
    getAPSpentOnBlessingsMap .setState (s)
    getAPSpentOnEnergiesMap .setState (s)
    getAPSpentOnAdvantagesMap .setState (s)
    getAPSpentOnBlessedAdvantagesMap .setState (s)
    getAPSpentOnMagicalAdvantagesMap .setState (s)
    getAPSpentOnDisadvantagesMap .setState (s)
    getAPSpentOnBlessedDisadvantagesMap .setState (s)
    getAPSpentOnMagicalDisadvantagesMap .setState (s)
    getAPSpentOnSpecialAbilitiesMap .setState (s)
  }

const toAPCache =
  (s: Record<AdventurePointsCategories>): APCache => ({
    spent: AdventurePointsCategories.A.spent (s),
    available: AdventurePointsCategories.A.available (s),
    spentOnAttributes: AdventurePointsCategories.A.spentOnAttributes (s),
    spentOnSkills: AdventurePointsCategories.A.spentOnSkills (s),
    spentOnCombatTechniques: AdventurePointsCategories.A.spentOnCombatTechniques (s),
    spentOnSpells: AdventurePointsCategories.A.spentOnSpells (s),
    spentOnLiturgicalChants: AdventurePointsCategories.A.spentOnLiturgicalChants (s),
    spentOnCantrips: AdventurePointsCategories.A.spentOnCantrips (s),
    spentOnBlessings: AdventurePointsCategories.A.spentOnBlessings (s),
    spentOnEnergies: AdventurePointsCategories.A.spentOnEnergies (s),
    spentOnAdvantages: AdventurePointsCategories.A.spentOnAdvantages (s),
    spentOnBlessedAdvantages: AdventurePointsCategories.A.spentOnBlessedAdvantages (s),
    spentOnMagicalAdvantages: AdventurePointsCategories.A.spentOnMagicalAdvantages (s),
    spentOnDisadvantages: AdventurePointsCategories.A.spentOnDisadvantages (s),
    spentOnBlessedDisadvantages: AdventurePointsCategories.A.spentOnBlessedDisadvantages (s),
    spentOnMagicalDisadvantages: AdventurePointsCategories.A.spentOnMagicalDisadvantages (s),
    spentOnSpecialAbilities: AdventurePointsCategories.A.spentOnSpecialAbilities (s),
  })

const deriveNewAPCache = (state: AppStateRecord): StringKeyObject<APCache> =>
  pipe_ (
    state,
    getHeroes,
    mapMaybe (pipe (
      heroReducer.A.present,
      (hero): Maybe<Maybe<Record<AdventurePointsCategories>>> =>
        getAPObjectMap (HeroModel.A.id (hero)) (state, { hero }),
      Maybe.join,
      fmap (toAPCache)
    )),
    toObjectWith (ident)
  )

export const prepareAPCache =
  (all_saved: boolean) =>
  (state: AppStateRecord): StringKeyObject<APCache> =>
    all_saved
    ? deriveNewAPCache (state)
    : {
      ...deriveNewAPCache (state),
      ...pipe_ (
        state,
        AppState.A.cache,
        x => x.ap
      ),
    }


export const prepareAPCacheForHero = (state: AppStateRecord, hero_id: string): Maybe<APCache> =>
  pipe_ (
    state,
    getHeroes,
    lookup (hero_id),
    bindF (pipe (
      heroReducer.A.present,
      hero => getAPObjectMap (HeroModel.A.id (hero)) (state, { hero })
    )),
    Maybe.join,
    fmap (toAPCache),
  )
