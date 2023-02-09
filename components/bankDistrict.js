import BankList from "@/data/bank/bank-category-list.json";

export const BankDisrtct = (state) => {
  let dis = [];
  BankList.credit_dist.filter((a, i) => {
    let d = a.split(",");
    if (state.trim() === d[0].trim()) {
      d = d.splice(1).map((a) => a.trim());
      dis = d;
      return;
    }
  });

  return dis;
};
