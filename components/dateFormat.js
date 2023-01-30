export function DateFormate(val) {
    if (!val) {
      return "";
    } else {
      let a = val.split("-");
      if (a.length > 1) {
        return `${a[2]}/${a[1]}/${a[0]}`;
      } else {
        return val;
      }
    }
  }