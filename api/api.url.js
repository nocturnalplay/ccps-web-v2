/*
    t  = table
    c1 = column1
    c2 = column2
    v1 = value1
    v2 = value2
    d  = date compare column
    f  = from of the date
    to  = to of the date
    query = customr query fetching
*/

export const API_Query = {
  //signin
  SignIn: () => `/auth/signin`,
  //otp verification
  OTPverify:()=> `/auth/otpverify`,
  //submit the new entry
  NewEntry: (t) => `/${t}/new`,
  //submit the new entry
  UpdateEntry: (t) => `/${t}/update`,
  //get the last entry in the table
  getLast: (t, out) => `/${t}/getlast?out=${out}`,
  //total table fetching query
  total: (t) => `/${t}`,
  totalCount: (t) => `/${t}?count=1`,
  totalCustom: (t, query) => `/${t}?q=${query}`,

  //one column comparison table fetching query
  column1: (t, c1, v1) => `/${t}/${c1}?value1=${v1}`,
  column1Count: (t, c1, v1) => `/${t}/${c1}?value1=${v1}&count=1`,
  column1Custom: (t, c1, v1, query) => `/${t}/${c1}?value1=${v1}&q=${query}`,

  //two column comparison table fetching query
  column2: (t, c1, v1, c2, v2) => `/${t}/${c1}/${c2}?value1=${v1}&value2=${v2}`,
  column2Count: (t, c1, v1, c2, v2) =>
    `/${t}/${c1}/${c2}?value1=${v1}&value2=${v2}&count=1`,
  column2Custom: (t, c1, v1, c2, v2, query) =>
    `/${t}/${c1}/${c2}?value1=${v1}&value2=${v2}&q=${query}`,

  //year wise data fetching
  year: (t, d, f, to) => `/${t}/year/${d}?from=${f}&to=${to}`,
  yearCount: (t, d, f, to) => `/${t}/year/${d}?from=${f}&to=${to}&count=1`,
  yearCustom: (t, d, f, to, query) =>
    `/${t}/year/${d}?from=${f}&to=${to}&q=${query}`,

  //year wise data fetching and one column comparison
  yearColumn1: (t, c1, v1, d, f, to) =>
    `/${t}/year/${d}/${c1}?value1=${v1}&from=${f}&to=${to}`,
  yearColumn1Count: (t, c1, v1, d, f, to) =>
    `/${t}/year/${d}/${c1}?value1=${v1}&from=${f}&to=${to}&count=1`,
  yearColumn1Custom: (t, c1, v1, d, f, to, query) =>
    `/${t}/year/${d}/${c1}?value1=${v1}&from=${f}&to=${to}&q=${query}`,

  //year wise data fetching and two column comparison
  yearColumn2: (t, c1, v1, c2, v2, d, f, to) =>
    `/${t}/year/${d}/${c1}/${c2}?value1=${v1}&value2=${v2}&from=${f}&to=${to}`,
  yearColumn2Count: (t, c1, v1, c2, v2, d, f, to) =>
    `/${t}/year/${d}/${c1}/${c2}?value1=${v1}&value2=${v2}&from=${f}&to=${to}&count=1`,
  yearColumn2Custom: (t, c1, v1, c2, v2, d, f, to, query) =>
    `/${t}/year/${d}/${c1}/${c2}?value1=${v1}&value2=${v2}&from=${f}&to=${to}&q=${query}`,
};
