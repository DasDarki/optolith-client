import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { List } from "../../../Data/List"
import { fromMaybe, isJust, Maybe, maybeToUndefined } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Purse } from "../../Models/Hero/Purse"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { localizeNumber, localizeWeight, translate, translateP } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { TextFieldLazy } from "../Universal/TextFieldLazy"

export interface PurseAndTotalsProps {
  carryingCapacity: number
  hasNoAddedAP: boolean
  initialStartingWealth: number
  staticData: StaticDataRecord
  purse: Maybe<Record<Purse>>
  totalPrice: Maybe<number>
  totalWeight: Maybe<number>
  setDucates (value: string): void
  setSilverthalers (value: string): void
  setHellers (value: string): void
  setKreutzers (value: string): void
}

const PA = Purse.A

export const PurseAndTotals: React.FC<PurseAndTotalsProps> = props => {
  const {
    carryingCapacity,
    hasNoAddedAP,
    initialStartingWealth,
    staticData,
    purse,
    totalPrice,
    totalWeight,
    setDucates,
    setSilverthalers,
    setHellers,
    setKreutzers,
  } = props

  const formatWeight = pipe (localizeWeight (staticData), localizeNumber (staticData))

  const formatWeightM = pipe (fromMaybe (0), formatWeight)

  const formatPrice = localizeNumber (staticData)

  const formatPriceM = pipe (fromMaybe (0), formatPrice)

  const total_price = translateP (staticData)
                                 ("general.pricevalue")
                                 (List (formatPriceM (totalPrice)))

  const total_weight = translateP (staticData)
                                  ("general.weightvalue")
                                  (List (formatWeightM (totalWeight)))

  const init_wealth = translateP (staticData)
                                 ("general.pricevalue")
                                 (List (formatPrice (initialStartingWealth)))

  const carring_capacity = translateP (staticData)
                                      ("general.pricevalue")
                                      (List (formatWeight (carryingCapacity)))

  return (
    <>
      <div className="purse">
        <h4>{translate (staticData) ("equipment.purse.title")}</h4>
        <div className="fields">
          <TextFieldLazy
            label={translate (staticData) ("equipment.purse.ducats")}
            value={pipe_ (purse, fmap (PA.d), maybeToUndefined)}
            onChange={setDucates}
            />
          <TextFieldLazy
            label={translate (staticData) ("equipment.purse.silverthalers")}
            value={pipe_ (purse, fmap (PA.s), maybeToUndefined)}
            onChange={setSilverthalers}
            />
          <TextFieldLazy
            label={translate (staticData) ("equipment.purse.halers")}
            value={pipe_ (purse, fmap (PA.h), maybeToUndefined)}
            onChange={setHellers}
            />
          <TextFieldLazy
            label={translate (staticData) ("equipment.purse.kreutzers")}
            value={pipe_ (purse, fmap (PA.k), maybeToUndefined)}
            onChange={setKreutzers}
            />
        </div>
      </div>
      <div className="total-points">
        <h4>
          {hasNoAddedAP
            ? translate (staticData) ("equipment.purse.initialstartingwealthandcarryingcapacity")
            : translate (staticData) ("equipment.purse.carryingcapacity")}
        </h4>
        <div className="fields">
          {hasNoAddedAP && isJust (totalPrice)
            ? (
              <div>
                {translateP (staticData)
                            ("general.pricevalue")
                            (List (
                              `${total_price} / ${init_wealth}`
                            ))}
              </div>
            )
            : null}
          <div>
            {translateP (staticData)
                        ("general.weightvalue")
                        (List (
                          `${total_weight} / ${carring_capacity}`
                        ))}
          </div>
        </div>
      </div>
    </>
  )
}
