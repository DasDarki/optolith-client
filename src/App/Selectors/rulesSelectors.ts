import { fmap } from "../../Data/Functor";
import { OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { Pair } from "../../Data/Tuple";
import { uncurryN } from "../../Data/Tuple/Curry";
import { Rules } from "../Models/Hero/Rules";
import { Book } from "../Models/Wiki/Book";
import { isMaybeActive } from "../Utilities/Activatable/isActive";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { prefixSA } from "../Utilities/IDUtils";
import { mapGetToSlice } from "../Utilities/SelectorsUtils";
import { getRules, getSpecialAbilities, getWikiBooks } from "./stateSelectors";

export type EnabledSourceBooks = Pair<OrderedMap<string, Record<Book>>, Record<Rules>>

export const getRuleBooksEnabled = createMaybeSelector (
  getWikiBooks,
  getRules,
  uncurryN (bs => fmap ((r): EnabledSourceBooks => Pair (bs, r)))
)

export const isEnableLanguageSpecializationsDeactivatable = createMaybeSelector (
  mapGetToSlice (getSpecialAbilities) (prefixSA (699)),
  isMaybeActive
)
