export const generateLikeRegex = (str: any): RegExp | null => {
  if (!(str && typeof str === "string" && str !== "")) {
    return null;
  }

  return new RegExp(str);
};

export const generateFieldsQuery = (obj: any): Object => {
  if (typeof obj !== "object") {
    return {};
  }

  let newObj: { [key: string]: RegExp | null } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (typeof element === "string" && element !== "") {
        newObj[key] = new RegExp(element);
      }
    }
  }
  return newObj;
};
