// https://github.com/logaretm/vee-validate/tree/master/src/rules
// https://vuetifyjs.com/en/components/forms#validation-with-submit-clear
// https://github.com/validatorjs/validator.js
// import isLength from "validator/lib/isLength";

import alphaNum from './alphaNum'
import alphaSpaces from './alphaSpaces'
import alphaSpacesNumLodash from './alphaSpacesNumLodash'
import cash from './cash'
import cuitCuil from './cuitCuil'
import decimal from './decimal'
import email from './email'
import lapsetext from './lapsetext'
import numeric from './numeric'
import objectId from './objectId'
import pageIntervals from './pageIntervals'
import passwordEqual from './passwordEqual'
import password from './password'
import phoneNumber from './phoneNumber'
import required from './required'
import requiredIf from './requiredIf'
import { between, max, min } from './lengthRules'

export default {
  alphaNum,
  alphaSpaces,
  alphaSpacesNumLodash,
  between,
  cash,
  cuitCuil,
  decimal,
  email,
  lapsetext,
  max,
  min,
  numeric,
  objectId,
  pageIntervals,
  password,
  passwordEqual,
  phoneNumber,
  required,
  requiredIf,
}
