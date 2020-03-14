"use strict";
const get = require("./get");

function check(object, keys = "") {
  const prop = get(object, keys);
  // if (prop) throw new Error(`The object does not have the property ${keys}.`);
  return {
    isObjectId: () =>
      /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(prop) || `${keys} is not a ObjectId.`,
    isString: () => typeof prop === "string" || `${keys} is not a string.`,
    isRequired: () => typeof prop !== "undefined" || `${keys} is required.`,
    isDate: () => Date.parse(prop) > 0 || `${keys} is not a Date.`,
    isEmail: () =>
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(prop) || "It is not a valid email.",
    // "La contraseña debe tener almenas una mayúscula, numero y mas de 6 caracteres"
    isPassword: () =>
      /^((?=.*\d)(?=.*[a-záéóúíñ])(?=.*[A-ZÁÉÓÚÍÑ])?(.*[@#$%!&?¡¿!])?.{6,30})$/.test(prop) ||
      "It is not a valid password",
    some: items => items.some(ele => prop === ele) || `Valid values: ${items}`
  };
}

function checkErrors(errorsList = []) {
  let errors = [];
  errorsList.forEach(err => {
    if (typeof err === "string") {
      errors.push(err);
    }
  });
  return errors;
}

module.exports = {
  check,
  checkErrors
};
