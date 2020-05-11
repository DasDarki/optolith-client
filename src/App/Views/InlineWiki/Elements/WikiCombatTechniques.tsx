import * as React from "react"
import { fmap } from "../../../../Data/Functor"
import { intercalate, notNull } from "../../../../Data/List"
import { fromJust, isJust, mapMaybe, Maybe, maybe } from "../../../../Data/Maybe"
import { lookupF } from "../../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../../Data/Record"
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique"
import { SpecialAbilityCombatTechniqueGroup, SpecialAbilityCombatTechniques } from "../../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { ndash } from "../../../Utilities/Chars"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { sortStrings } from "../../../Utilities/sortBy"
import { Markdown } from "../../Universal/Markdown"

interface Accessors<A extends RecordIBase<any>> {
  combatTechniques: (r: Record<A>) => Maybe<Record<SpecialAbilityCombatTechniques>>
}

export interface WikiCombatTechniquesProps<A extends RecordIBase<any>> {
  combatTechniques: StrMap<Record<CombatTechnique>>
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

const CTA = CombatTechnique.A
const SACTA = SpecialAbilityCombatTechniques.A

type FC = <A extends RecordIBase<any>> (props: WikiCombatTechniquesProps<A>) => ReturnType<React.FC>

export const WikiCombatTechniques: FC = props => {
  const {
    combatTechniques,
    x,
    acc,
    staticData,
  } = props

  return maybe <JSX.Element | null>
               (null)
               ((cts: Record<SpecialAbilityCombatTechniques>) => {
                 const customText = SACTA.customText (cts)
                 const group = SACTA.group (cts)
                 const explicitIds = SACTA.explicitIds (cts)

                 const str =
                   isJust (customText)
                   ? fromJust (customText)
                   : group === SpecialAbilityCombatTechniqueGroup.All
                   ? translate (staticData) ("inlinewiki.combattechniques.groups.all")
                   : group === SpecialAbilityCombatTechniqueGroup.Melee
                   // eslint-disable-next-line max-len
                   ? translate (staticData) ("inlinewiki.combattechniques.groups.allmeleecombattechniques")
                   : group === SpecialAbilityCombatTechniqueGroup.Ranged
                   // eslint-disable-next-line max-len
                   ? translate (staticData) ("inlinewiki.combattechniques.groups.allrangedcombattechniques")
                   : group === SpecialAbilityCombatTechniqueGroup.WithParry
                   // eslint-disable-next-line max-len
                   ? translate (staticData) ("inlinewiki.combattechniques.groups.allmeleecombattechniqueswithparry")
                   : group === SpecialAbilityCombatTechniqueGroup.OneHanded
                   // eslint-disable-next-line max-len
                   ? translate (staticData) ("inlinewiki.combattechniques.groups.allmeleecombattechniquesforonehandedweapons")
                   : notNull (explicitIds)
                   ? pipe_ (
                       explicitIds,
                       mapMaybe (pipe (lookupF (combatTechniques), fmap (CTA.name))),
                       sortStrings (staticData),
                       intercalate (", ")
                     )
                   : ndash

                 return (
                   <Markdown
                     source={
                       `**${translate (staticData) ("inlinewiki.combattechniques")}:** ${str}`
                     }
                     />
                 )
               })
               (acc.combatTechniques (x))
}
