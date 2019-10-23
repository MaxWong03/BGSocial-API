const parseDescription = (desc) => {
  return JSON.stringify(
    (
      desc
    ) 
      .replace(/\\/g, '')
      .replace(/"/g, "'")
      .replace(/'/g, '')
      .replace(/\n/g, '')
    )
      .replace(/"/g, "'");
};

const parseNum = (int) => {
 return JSON.stringify(parseInt(int));
};

const parseFlo = (float) => {
  return JSON.stringify(parseFloat(float));
}

const parseArray = (arr) => {
  return JSON.stringify(arr.join(", ")).replace(/"/g, "'");
}

const parseDoubleQuote = (quote) => {
  return JSON.stringify(quote).replace(/"/g, "'")
}

module.exports = {
  parseDescription,
  parseNum,
  parseFlo,
  parseArray,
  parseDoubleQuote
}