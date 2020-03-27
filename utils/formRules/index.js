// https://github.com/logaretm/vee-validate/tree/master/src/rules
// https://vuetifyjs.com/en/components/forms#validation-with-submit-clear
// https://github.com/validatorjs/validator.js
// import isLength from "validator/lib/isLength";

import alphaNum from './alphaNum'
import alphaSpaces from './alphaSpaces'
import alphaSpacesNumLodash from './alphaSpacesNumLodash'
import cash from './cash'
import email from './email'
import lapsetext from './lapsetext'
import numeric from './numeric'
import decimal from './decimal'
import pageIntervals from './pageIntervals'
import password from './password'
import passwordEqual from './passwordEqual'
import phoneNumber from './phoneNumber'
import required from './required'
import requiredIf from './requiredIf'
import cuitCuil from './cuitCuil'
import { between, max, min } from './lengthRules'

export default {
  alphaNum,
  alphaSpaces,
  alphaSpacesNumLodash,
  between,
  cash,
  cuitCuil,
  email,
  decimal,
  lapsetext,
  max,
  min,
  numeric,
  pageIntervals,
  password,
  phoneNumber,
  passwordEqual,
  required,
  requiredIf,
}
