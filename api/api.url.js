/*
    t  = table
    c1 = column1
    c2 = column2
    v1 = value1
    v2 = value2
    d  = date compare column
    f  = from of the date
    to  = to of the date
*/

export const API_Query = {
  //total table fetching query
  total: (t) => `/${t}`,
  totalCount: (t) => `/${t}?count=1`,

  //one column comparison table fetching query
  column1: (t, c1, v1) => `/${t}/${c1}?value1=${v1}`,
  column1Count: (t, c1, v1) => `/${t}/${c1}?value1=${v1}&count=1`,

  //two column comparison table fetching query
  column2: (t, c1, v1, c2, v2) => `/${t}/${c1}/${c2}?value1=${v1}&value2=${v2}`,
  column2Count: (t, c1, v1, c2, v2) =>
    `/${t}/${c1}/${c2}?value1=${v1}&value2=${v2}&count=1`,

  //year wise data fetching
  year: (t, d, f, to) => `/${t}/year/${d}?from=${f}&to=${to}`,
  yearCount: (t, d, f, to) => `/${t}/year/${d}?from=${f}&to=${to}&count=1`,

  //year wise data fetching and one column comparison
  yearColumn1: (t, c1, v1, d, f, to) =>
    `/${t}/year/${d}/${c1}?value1=${v1}&from=${f}&to=${to}`,

  yearColumn1Count: (t, c1, v1, d, f, to) =>
    `/${t}/year/${d}/${c1}?value1=${v1}&from=${f}&to=${to}&count=1`,

  //year wise data fetching and two column comparison
  yearColumn2: (t, c1, v1, c2, v2, d, f, to) =>
    `/${t}/year/${d}/${c1}/${c2}?value1=${v1}&value2=${v2}&from=${f}&to=${to}`,

  yearColumn2Count: (t, c1, v1, c2, v2, d, f, to) =>
    `/${t}/year/${d}/${c1}/${c2}?value1=${v1}&value2=${v2}&from=${f}&to=${to}&count=1`,
};
