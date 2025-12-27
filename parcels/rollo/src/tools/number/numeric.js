/* Checks if string value contains only digits - allowing for 
  - a single decimal mark ('.' or ',') and 
  - a leading '-'
  - null and ''. 
  */
export const isNumeric = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  if (value === null || value === "") {
    return true;
  }
  const pattern = /^-?\d*[.,]?\d*$/;
  return pattern.test(value);
};
