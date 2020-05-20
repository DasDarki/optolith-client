// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as Js_int from "bs-platform/lib/es6/js_int.js";
import * as Ley_Ix$OptolithClient from "../../../Data/Ley_Ix.bs.js";
import * as Ley_Int$OptolithClient from "../../../Data/Ley_Int.bs.js";
import * as Ley_List$OptolithClient from "../../../Data/Ley_List.bs.js";
import * as ClassNames$OptolithClient from "../../Utilities/ClassNames.bs.js";
import * as Ley_Option$OptolithClient from "../../../Data/Ley_Option.bs.js";

function TextField$Label(Props) {
  var name = Props.name;
  var labelText = Props.labelText;
  return Ley_Option$OptolithClient.option(null, (function (str) {
                return React.createElement("label", {
                            htmlFor: name
                          }, str);
              }), Ley_Option$OptolithClient.ensure(Ley_List$OptolithClient.Extra.notNullStr, labelText));
}

var Label = {
  make: TextField$Label
};

function isValueInvalid(value) {
  return (function (param) {
      return Ley_List$OptolithClient.Extra.firstJust((function (param) {
                    if (Curry._1(param[0], value)) {
                      return param[1];
                    }
                    
                  }), param);
    });
}

function TextField$Invalid(Props) {
  var invalidMsg = Props.invalidMsg;
  return Ley_Option$OptolithClient.option(null, (function (msg) {
                return React.createElement("p", {
                            className: "error"
                          }, msg);
              }), invalidMsg);
}

var Invalid = {
  isValueInvalid: isValueInvalid,
  make: TextField$Invalid
};

var partial_arg = /-?[0-9]*/g;

function isRoughlyValid(param) {
  return partial_arg.test(param);
}

function isValid(min, max, invalidChecks, convertedValue) {
  var invalidMsg = isValueInvalid(convertedValue)(invalidChecks);
  return Ley_Option$OptolithClient.option(/* tuple */[
              false,
              invalidMsg
            ], (function ($$int) {
                return /* tuple */[
                        Ley_Ix$OptolithClient.inRange(/* tuple */[
                              Ley_Option$OptolithClient.fromOption(Js_int.min, min),
                              Ley_Option$OptolithClient.fromOption(Js_int.max, max)
                            ], $$int) && Ley_Option$OptolithClient.isNone(invalidMsg),
                        invalidMsg
                      ];
              }), convertedValue);
}

function TextField$Integer(Props) {
  var name = Props.name;
  var labelOpt = Props.label;
  var value = Props.value;
  var onChange = Props.onChange;
  var placeholderOpt = Props.placeholder;
  var min = Props.min;
  var max = Props.max;
  var invalidChecksOpt = Props.invalidChecks;
  var isLazyOpt = Props.isLazy;
  var disabledOpt = Props.disabled;
  var label = labelOpt !== undefined ? labelOpt : "";
  var placeholder = placeholderOpt !== undefined ? placeholderOpt : "";
  var invalidChecks = invalidChecksOpt !== undefined ? invalidChecksOpt : /* [] */0;
  var isLazy = isLazyOpt !== undefined ? isLazyOpt : false;
  var disabled = disabledOpt !== undefined ? disabledOpt : false;
  var match = React.useState((function () {
          return value;
        }));
  var match$1 = React.useState((function () {
          return Ley_Int$OptolithClient.show(value);
        }));
  var setInternalValue = match$1[1];
  var internalValue = match$1[0];
  var match$2 = React.useState((function () {
          return isValid(min, max, invalidChecks, Ley_Option$OptolithClient.Monad.$$return(value));
        }));
  var setValid = match$2[1];
  var match$3 = match$2[0];
  var valid = match$3[0];
  if (match[0] !== value) {
    Curry._1(setInternalValue, (function (param) {
            return Ley_Int$OptolithClient.show(value);
          }));
    Curry._1(match[1], (function (param) {
            return value;
          }));
    Curry._1(setValid, (function (param) {
            return isValid(min, max, invalidChecks, value);
          }));
  }
  var handleChange = React.useCallback((function ($$event) {
          var target = $$event.target;
          var newValue = target.value;
          if (!Curry._1(isRoughlyValid, newValue)) {
            return ;
          }
          Curry._1(setInternalValue, (function (param) {
                  return newValue;
                }));
          var convertedValue = Ley_Int$OptolithClient.readOption(newValue);
          var match = isValid(min, max, invalidChecks, convertedValue);
          var invalidMsg = match[1];
          var isNewValueValid = match[0];
          Curry._1(setValid, (function (param) {
                  return /* tuple */[
                          isNewValueValid,
                          invalidMsg
                        ];
                }));
          if (!isLazy && isNewValueValid && Ley_Option$OptolithClient.isSome(convertedValue)) {
            return Curry._1(onChange, Ley_Option$OptolithClient.fromSome(convertedValue));
          }
          
        }), /* tuple */[
        onChange,
        min,
        max
      ]);
  var handleBlur = React.useCallback((function (param) {
          var internalInt = Ley_Int$OptolithClient.readOption(internalValue);
          if (Ley_Option$OptolithClient.isSome(internalInt)) {
            var internalSafe = Ley_Option$OptolithClient.fromSome(internalInt);
            if (isLazy && valid) {
              Curry._1(onChange, internalSafe);
            } else if (Ley_Option$OptolithClient.isSome(min) && internalSafe < Ley_Option$OptolithClient.fromSome(min)) {
              Curry._1(setInternalValue, (function (param) {
                      return Ley_Int$OptolithClient.show(Ley_Option$OptolithClient.fromSome(min));
                    }));
            } else if (Ley_Option$OptolithClient.isSome(max) && internalSafe > Ley_Option$OptolithClient.fromSome(max)) {
              Curry._1(setInternalValue, (function (param) {
                      return Ley_Int$OptolithClient.show(Ley_Option$OptolithClient.fromSome(max));
                    }));
            } else {
              Curry._1(setInternalValue, (function (param) {
                      return Ley_Int$OptolithClient.show(value);
                    }));
            }
          } else {
            Curry._1(setInternalValue, (function (param) {
                    return Ley_Int$OptolithClient.show(value);
                  }));
          }
          return Curry._1(setValid, (function (param) {
                        return /* tuple */[
                                true,
                                undefined
                              ];
                      }));
        }), /* tuple */[
        value,
        internalValue
      ]);
  return React.createElement("div", {
              className: ClassNames$OptolithClient.fold(/* :: */[
                    "textfield",
                    /* :: */[
                      ClassNames$OptolithClient.cond("disabled", disabled),
                      /* :: */[
                        ClassNames$OptolithClient.cond("invalid", valid),
                        /* [] */0
                      ]
                    ]
                  ])
            }, React.createElement(TextField$Label, {
                  name: name,
                  labelText: label
                }), React.createElement("input", {
                  name: name,
                  placeholder: placeholder,
                  type: "number",
                  value: internalValue,
                  onBlur: handleBlur,
                  onChange: handleChange
                }), React.createElement(TextField$Invalid, {
                  invalidMsg: match$3[1]
                }));
}

var Integer = {
  isRoughlyValid: isRoughlyValid,
  isValid: isValid,
  make: TextField$Integer
};

function isValid$1(required, value) {
  if (required) {
    return Ley_List$OptolithClient.Extra.notNullStr(value);
  } else {
    return true;
  }
}

function TextField$String(Props) {
  var name = Props.name;
  var labelOpt = Props.label;
  var value = Props.value;
  var onChange = Props.onChange;
  var placeholderOpt = Props.placeholder;
  var isLazyOpt = Props.isLazy;
  var requiredOpt = Props.required;
  var disabledOpt = Props.disabled;
  var label = labelOpt !== undefined ? labelOpt : "";
  var placeholder = placeholderOpt !== undefined ? placeholderOpt : "";
  var isLazy = isLazyOpt !== undefined ? isLazyOpt : false;
  var required = requiredOpt !== undefined ? requiredOpt : false;
  var disabled = disabledOpt !== undefined ? disabledOpt : false;
  var match = React.useState((function () {
          return value;
        }));
  var match$1 = React.useState((function () {
          return value;
        }));
  var setInternalValue = match$1[1];
  var internalValue = match$1[0];
  var match$2 = React.useState((function () {
          return isValid$1(required, value);
        }));
  var setValid = match$2[1];
  var valid = match$2[0];
  if (match[0] !== value) {
    Curry._1(setInternalValue, (function (param) {
            return value;
          }));
    Curry._1(match[1], (function (param) {
            return value;
          }));
    Curry._1(setValid, (function (param) {
            return isValid$1(required, value);
          }));
  }
  var handleChange = React.useCallback((function ($$event) {
          var target = $$event.target;
          var newValue = target.value;
          Curry._1(setInternalValue, (function (param) {
                  return newValue;
                }));
          var isNewValueValid = isValid$1(required, newValue);
          Curry._1(setValid, (function (param) {
                  return isNewValueValid;
                }));
          if (!isLazy && isNewValueValid) {
            return Curry._1(onChange, newValue);
          }
          
        }), /* tuple */[
        onChange,
        required
      ]);
  var handleBlur = React.useCallback((function (param) {
          if (isLazy && valid) {
            return Curry._1(onChange, internalValue);
          } else {
            Curry._1(setInternalValue, (function (param) {
                    return value;
                  }));
            return Curry._1(setValid, (function (param) {
                          return true;
                        }));
          }
        }), [value]);
  return React.createElement("div", {
              className: ClassNames$OptolithClient.fold(/* :: */[
                    "textfield",
                    /* :: */[
                      ClassNames$OptolithClient.cond("disabled", disabled),
                      /* :: */[
                        ClassNames$OptolithClient.cond("invalid", valid),
                        /* [] */0
                      ]
                    ]
                  ])
            }, React.createElement(TextField$Label, {
                  name: name,
                  labelText: label
                }), React.createElement("input", {
                  className: valid ? "" : "invalid",
                  name: name,
                  placeholder: placeholder,
                  type: "text",
                  value: internalValue,
                  onBlur: handleBlur,
                  onChange: handleChange
                }));
}

var $$String = {
  isValid: isValid$1,
  make: TextField$String
};

export {
  Label ,
  Invalid ,
  Integer ,
  $$String ,
  
}
/* react Not a pure module */
