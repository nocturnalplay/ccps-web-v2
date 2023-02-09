import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import csrData from "@/data/csr/csr-category-list.json";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import { DateFormate } from "@/components/Forms";
import Link from "next/link";
import { Loading, AlertMessage } from "@/components/messager";

const dateTable = "dr";

export default function TableCSR() {
  const [value, setValue] = React.useState("Receive");
  const [date, setDate] = React.useState({
    from: "",
    to: "",
  });
  const [APIdata, setAPIdate] = React.useState();

  const [status, setStatus] = React.useState({
    msg: "",
    loading: true,
    error: false,
    success: false,
  });

  const handleChange = (event, newValue) => {
    window.sessionStorage.setItem("csrtable", newValue);
    setValue(newValue);
  };

  React.useEffect(() => {
    (async () => {
      try {
        setStatus((a) => ({
          ...a,
          loading: true,
          msg: "",
          error: false,
          success: false,
        }));
        let datalist = [];
        let com = "";
        let csrtable = window.sessionStorage.getItem("csrtable");
        let csrfrom = window.sessionStorage.getItem("csrdatefrom");
        let csrto = window.sessionStorage.getItem("csrdateto");
        if (csrfrom && csrto) {
          date.from = csrfrom;
          date.to = csrto;
        }
        if (csrtable) {
          csrtable = csrlist.filter((a) => a.temp == csrtable);
          csrtable = csrtable.length == 1 && csrtable[0].temp;
          setValue(csrtable);
          console.log(csrtable);
        }
        if (value == "property") {
          //for get the custome propery values
          if (date.from && date.to) {
            //if date is give date wise comparison will happen
            //else normal comparison will happen
            datalist.push(
              ApiFetcher({
                url: API_Query.yearCustom(
                  "csr",
                  dateTable,
                  DateFormate(date.from),
                  DateFormate(date.to),
                  "prop_lost"
                ),
              })
            );
            csrData["stage"].map((e) => {
              datalist.push(
                ApiFetcher({
                  url: API_Query.yearColumn1Custom(
                    "csr",
                    "stage",
                    e,
                    dateTable,
                    DateFormate(date.from),
                    DateFormate(date.to),
                    "prop_lost"
                  ),
                })
              );
            });
          } else {
            datalist.push(
              ApiFetcher({
                url: API_Query.totalCustom("csr", "prop_lost"),
              })
            );
            csrData["stage"].map((e) => {
              datalist.push(
                ApiFetcher({
                  url: API_Query.column1Custom("csr", "stage", e, "prop_lost"),
                })
              );
            });
          }
          await Promise.all(datalist)
            .then((res) => {
              let c = FindPropLost(res);
              let newli = [];
              let propList = {
                nolost: [],
                one_f: [],
                f1_l1: [],
                l1_l3: [],
                l3_l5: [],
                l5_l50: [],
                above_l50: [],
              };
              c.map((e) => {
                propList.nolost.push(e.value.nolost.length);
                propList.one_f.push(e.value.one_f.length);
                propList.f1_l1.push(e.value.f1_l1.length);
                propList.l1_l3.push(e.value.l1_l3.length);
                propList.l3_l5.push(e.value.l3_l5.length);
                propList.l5_l50.push(e.value.l5_l50.length);
                propList.above_l50.push(e.value.above_l50.length);
              });

              newli.push({ name: "Above 50l", value: propList.above_l50 });
              newli.push({ name: "5l-50l", value: propList.l5_l50 });
              newli.push({ name: "3l-5l", value: propList.l3_l5 });
              newli.push({ name: "1l-3l", value: propList.l1_l3 });
              newli.push({ name: "50k-1l", value: propList.f1_l1 });
              newli.push({ name: "1-50k", value: propList.one_f });
              newli.push({ name: "no lost", value: propList.nolost });

              let tt = { name: "total", value: [] };
              newli.map((a) => {
                tt.value = MakeTotal(tt.value, a.value);
              });
              newli.push(tt);
              setAPIdate(newli);
              setStatus((a) => ({
                ...a,
                loading: false,
                msg: "",
                error: false,
                success: false,
              }));
            })
            .catch((error) => {
              setStatus((a) => ({
                ...a,
                loading: false,
                msg: error.message,
                error: true,
                success: false,
              }));
            });
        } else if (value == "Lost Amount") {
          //Lost Amount values will handle here
          if (date.from && date.to) {
            //if date is give date wise comparison will happen
            //else normal comparison will happen
            datalist.push(
              ApiFetcher({
                url: API_Query.yearCustom(
                  "csr",
                  dateTable,
                  DateFormate(date.from),
                  DateFormate(date.to),
                  "prop_lost,prop_hold,prop_refund,prop_rec,prop_pending,stage"
                ),
              })
            );
          } else {
            datalist.push(
              ApiFetcher({
                url: API_Query.totalCustom(
                  "csr",
                  "prop_lost,prop_hold,prop_refund,prop_rec,prop_pending,stage"
                ),
              })
            );
          }
          await Promise.all(datalist)
            .then((res) => {
              res = res.map((a) => ({
                Data: a.Data.filter(
                  (a) => a.stage.toUpperCase() !== "CONVERTED TO FIR"
                ),
              }));

              let c = FindPropLost(res);
              let newli = [];
              let propList = {
                nolost: [],
                one_f: [],
                f1_l1: [],
                l1_l3: [],
                l3_l5: [],
                l5_l50: [],
                above_l50: [],
              };
              Object.keys(c[0].value).map((a) => {
                let prop = [0, 0, 0, 0, 0];
                c[0].value[a].map((e) => {
                  prop[0] += parseInt(e.prop_lost);
                  prop[1] += parseInt(e.prop_hold);
                  prop[2] += parseInt(e.prop_refund);
                  prop[3] += parseInt(e.prop_rec);
                  prop[4] += parseInt(e.prop_pending);
                });

                propList[a].push(prop);
              });
              newli.push({ name: "Above 50l", value: propList.above_l50[0] });
              newli.push({ name: "5l-50l", value: propList.l5_l50[0] });
              newli.push({ name: "3l-5l", value: propList.l3_l5[0] });
              newli.push({ name: "1l-3l", value: propList.l1_l3[0] });
              newli.push({ name: "50k-1l", value: propList.f1_l1[0] });
              newli.push({ name: "1-50k", value: propList.one_f[0] });
              newli.push({ name: "no lost", value: propList.nolost[0] });

              let tt = { name: "total", value: [] };
              newli.map((a) => {
                tt.value = MakeTotal(tt.value, a.value);
              });
              newli.push(tt);
              newli = newli.map((a, i) => {
                return {
                  name: a.name,
                  value: a.value.map((e) => e.toLocaleString("en-IN")),
                };
              });
              setAPIdate(newli);
              setStatus((a) => ({
                ...a,
                loading: false,
                msg: "",
                error: false,
                success: false,
              }));
            })
            .catch((error) =>
              setStatus((a) => ({
                ...a,
                loading: false,
                msg: error.message,
                error: true,
                success: false,
              }))
            );
        } else {
          //almost every thing done in this part
          if (date.from && date.to) {
            //if date is give date wise comparison will happen
            //else normal comparison will happen
            csrlist.map((a) => {
              if (a.temp === value) {
                com = a.v;
                csrData[a.v].map((e) => {
                  datalist.push(
                    ApiFetcher({
                      url: API_Query.yearColumn1Count(
                        "csr",
                        a.v,
                        e,
                        dateTable,
                        DateFormate(date.from),
                        DateFormate(date.to)
                      ),
                    })
                  );
                  csrData["stage"].map((ae) => {
                    datalist.push(
                      ApiFetcher({
                        url: API_Query.yearColumn2Count(
                          "csr",
                          a.v,
                          e,
                          "stage",
                          ae,
                          dateTable,
                          DateFormate(date.from),
                          DateFormate(date.to)
                        ),
                      })
                    );
                  });
                });
              }
            });
          } else {
            csrlist.map((a) => {
              if (a.temp === value) {
                com = a.v;
                csrData[a.v].map((e) => {
                  datalist.push(
                    ApiFetcher({ url: API_Query.column1Count("csr", a.v, e) })
                  );
                  csrData["stage"].map((ae) => {
                    datalist.push(
                      ApiFetcher({
                        url: API_Query.column2Count("csr", a.v, e, "stage", ae),
                      })
                    );
                  });
                });
              }
            });
          }
          await Promise.all(datalist)
            .then((res) => {
              return res.map((a) => {
                if (a.Status) {
                  return a.Data[0].count;
                } else {
                  return 0;
                }
              });
            })
            .then((res) => {
              let li = sliceIntoChunks(res, 4);
              let tt = { name: "total", value: [] };
              let newli = [];
              li = csrData[com].map((a, i) => {
                let flage = 0;
                for (let j = 0; j < li[i].length; j++) {
                  if (li[i][j] > 0) {
                    flage += 1;
                    break;
                  }
                }
                if (flage == 1) {
                  tt.value = MakeTotal(tt.value, li[i]);
                  newli.push({ name: a, value: li[i] });
                }
              });
              newli.push(tt);
              setAPIdate(newli);
              setStatus((a) => ({
                ...a,
                loading: false,
                msg: "",
                error: false,
                success: false,
              }));
            })
            .catch((error) =>
              setStatus((a) => ({
                ...a,
                loading: false,
                msg: error.message,
                error: true,
                success: false,
              }))
            );
        }
      } catch (error) {
        setStatus((a) => ({
          ...a,
          loading: false,
          msg: error.message,
          error: true,
          success: false,
        }));
      }
    })();
  }, [value, date]);

  const Reset = () => {
    if (date.from && date.to) {
      setDate((a) => ({ ...a, from: "", to: "" }));
      window.sessionStorage.setItem("csrdatefrom", "");
      window.sessionStorage.setItem("csrdateto", "");
    }
  };
  const changeDate = (e) => {
    if (e.target.name == "from") {
      window.sessionStorage.setItem("csrdatefrom", e.target.value);
    } else if (e.target.name == "to") {
      window.sessionStorage.setItem("csrdateto", e.target.value);
    }
    setDate((a) => ({ ...a, [e.target.name]: e.target.value }));
  };
  console.log(status);
  return (
    <>
      {status.error && <AlertMessage msg={status.msg} title={"error"} />}
      <Box
        sx={{
          maxWidth: { xs: 600, md: 720, lg: 1000, xl: 1500 },
        }}
        className="table-list"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {csrlist.map((a) => (
            <Tab key={a.v + a.temp} value={a.temp} label={a.temp} />
          ))}
        </Tabs>
      </Box>
      <div className="from-to table-from">
        <h2>get dynamic data by using date</h2>
        <div className="date-input">
          <input
            type="date"
            id="from"
            name="from"
            onChange={changeDate}
            value={date.from}
          />
          <span>to</span>
          <input
            type="date"
            id="to"
            name="to"
            onChange={changeDate}
            value={date.to}
          />
          <input type="button" value="reset" onClick={Reset} />
        </div>
      </div>
      <div className="table-list-info">
        {(date.from &&
          date.to &&
          `Data showing below is between 
            ${DateFormate(date.from)} to
            ${DateFormate(date.to)}`) ||
          "Total CSR data in list view with comparison"}
      </div>
      {status.loading ? (
        <Loading />
      ) : (
        <div className="table-view">
          {APIdata && (
            <table>
              <thead>
                <tr>
                  <th>list</th>
                  {value != "Lost Amount" && <th>total</th>}
                  {/* below selection different types of table header is happening */}
                  {value == "Lost Amount"
                    ? [
                        "lost amount",
                        "hold amount",
                        "refund amount",
                        "recovery amount",
                        "pending amount",
                      ].map((a) => <th key={a}>{a}</th>)
                    : csrData.stage.map((a) => <th key={a}>{a}</th>)}
                </tr>
              </thead>
              <tbody className={value == "Lost Amount" ? "lost-amount" : ""}>
                {APIdata.map((a, i) => {
                  return (
                    <tr key={a.name}>
                      <td>{a.name}</td>
                      {a.value.map((e, j) => {
                        if (APIdata.length == i + 1 || value == "Lost Amount") {
                          return <td key={a.name + e + i + j}>{e}</td>;
                        } else if (j == 0) {
                          //for first totla value this will happens
                          return (
                            <td key={a.name + e + i + j}>
                              <Link
                                href={
                                  date.from && date.to
                                    ? `/ccps/list/csr/${
                                        csrlist.filter(
                                          (a) => a.temp === value
                                        )[0].v
                                      }?v1=${
                                        a.name
                                      }&dt=${dateTable}&f=${DateFormate(
                                        date.from
                                      )}&t=${DateFormate(date.to)}`
                                    : `/ccps/list/csr/${
                                        csrlist.filter(
                                          (a) => a.temp === value
                                        )[0].v
                                      }?v1=${a.name}`
                                }
                              >
                                {e}
                              </Link>
                            </td>
                          );
                        }
                        return (
                          <td key={a.name + e + i + j}>
                            <Link
                              href={
                                date.form && date.to
                                  ? `/ccps/list/csr/${
                                      csrlist.filter((a) => a.temp === value)[0]
                                        .v
                                    }/stage?v1=${a.name}&v2=${
                                      csrData["stage"][j - 1]
                                    }&dt=${dateTable}&f=${DateFormate(
                                      date.from
                                    )}&t=${DateFormate(date.to)}`
                                  : `/ccps/list/csr/${
                                      csrlist.filter((a) => a.temp === value)[0]
                                        .v
                                    }/stage?v1=${a.name}&v2=${
                                      csrData["stage"][j - 1]
                                    }`
                              }
                            >
                              {e}
                            </Link>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot></tfoot>
            </table>
          )}
        </div>
      )}
    </>
  );
}

const csrlist = [
  { v: "receive", temp: "Receive" },
  { v: "importance", temp: "Importance" },
  { v: "category", temp: "Category" },
  { v: "sub_category", temp: "Subcategory" },
  { v: "addl_category", temp: "Addlcategory" },
  { v: "csr_reg", temp: "Officers" },
  { v: "team", temp: "Team" },
  { v: "prop_lost", temp: "property" },
  { v: "prop_lost", temp: "Lost Amount" },
];

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function MakeTotal(fli, lli) {
  let newli = fli.length > 0 ? fli : [];
  lli.forEach((e, i) => {
    if (fli.length > 0) {
      newli[i] += e;
    } else {
      newli.push(e);
    }
  });
  return newli;
}

export const FindPropLost = (res) => {
  try {
    let propList = {
      nolost: [],
      one_f: [],
      f1_l1: [],
      l1_l3: [],
      l3_l5: [],
      l5_l50: [],
      above_l50: [],
    };
    let stageData = [];
    res.map((a, i) => {
      a.Data.map((e) => {
        if (
          parseInt(e.prop_lost) <= 0 ||
          e.prop_lost == null ||
          e.prop_lost == undefined
        ) {
          propList.nolost.push(e);
        } else if (
          parseInt(e.prop_lost) > 0 &&
          parseInt(e.prop_lost) <= 50000
        ) {
          propList.one_f.push(e);
        } else if (
          parseInt(e.prop_lost) > 50000 &&
          parseInt(e.prop_lost) <= 100000
        ) {
          propList.f1_l1.push(e);
        } else if (
          parseInt(e.prop_lost) > 100000 &&
          parseInt(e.prop_lost) <= 300000
        ) {
          propList.l1_l3.push(e);
        } else if (
          parseInt(e.prop_lost) > 300000 &&
          parseInt(e.prop_lost) <= 500000
        ) {
          propList.l3_l5.push(e);
        } else if (
          parseInt(e.prop_lost) > 500000 &&
          parseInt(e.prop_lost) <= 5000000
        ) {
          propList.l5_l50.push(e);
        } else if (parseInt(e.prop_lost) > 5000000) {
          propList.above_l50.push(e);
        }
      });
      if (i == 0) {
        stageData.push({ name: "total", value: propList });
      } else {
        stageData.push({ name: csrData["stage"][i - 1], value: propList });
      }
      propList = {
        nolost: [],
        one_f: [],
        f1_l1: [],
        l1_l3: [],
        l3_l5: [],
        l5_l50: [],
        above_l50: [],
      };
    });

    return stageData;
  } catch (error) {
    console.log(error);
  }
};
