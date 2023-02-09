import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";

/*
    props.table = table name
    props.setEvent = setevent
*/

export const IndexFetch = async (props) => {
  try {
    const da = [];
    //total data of the table
    da.push(
      ApiFetcher({
        url: API_Query.totalCount(props.table),
        method: "GET",
      })
    );
    //getting the stage data from API
    Datalist[props.table].value.map((val) =>
      da.push(
        ApiFetcher({
          url: API_Query.column1Count(
            props.table,
            Datalist[props.table].name,
            val
          ),
          method: "GET",
        })
      )
    );
    //fetch all the data in the list as fetch like
    return await Promise.all(da)
      .then((res) =>
        Promise.all(res.map((a, i) => a.Data[0].count)).then((a) => a)
      )
      .then((res) => ({ data: res, error: "" }))
      .catch((error) => ({ data: "", error: error.message }));

    // //set event data value in setEvent
    // co.map((a, i) => {
    //   props.setEvent((e) => ({
    //     ...e,
    //     [i == 0 ? "total" : datalist[props.table].value[i - 1]]: a,
    //   }));
    // });
  } catch (error) {
    return { data: "", error: error.message };
  }
};

/*
    props.table = table name
    props.datecompare = date column name for comparison
    props.from = from date 
    props.to = to date
    props.setEvent = setevent
*/
export const IndexYearFetch = async (props) => {
  try {
    const da = [];
    //total data of the table
    da.push(
      ApiFetcher({
        url: API_Query.yearCount(
          props.table,
          props.datecompare,
          props.from,
          props.to
        ),
        method: "GET",
      })
    );
    //getting the stage data from API
    Datalist[props.table].value.map((val) =>
      da.push(
        ApiFetcher({
          url: API_Query.yearColumn1Count(
            props.table,
            Datalist[props.table].name,
            val,
            props.datecompare,
            props.from,
            props.to
          ),
          method: "GET",
        })
      )
    );
    //fetch all the data in the list as fetch like
    return await Promise.all(da)
      .then((res) =>
        Promise.all(res.map((a, i) => a.Data[0].count)).then((a) => a)
      )
      .then((res) => ({ data: res, error: "" }))
      .catch((error) => ({ data: "", error: error.message }));
    //set event data value in setEvent
    // co.map((a, i) => {
    //   props.setEvent((e) => ({
    //     ...e,
    //     [i == 0 ? "total" : datalist[props.table].value[i - 1]]: a,
    //   }));
    // });
  } catch (error) {
    return { data: "", error: error.message };
  }
};

export var Datalist = {
  fir: { name: "stage", value: ["ui", "ntf", "pt", "disposed"] },
  csr: { name: "stage", value: ["converted to fir", "disposed", "pending"] },
  ncrp: {
    name: "action_type",
    value: [
      "csr",
      "csr-fir",
      "fir",
      "withdrawal",
      "pending",
      "disposed",
      "rejected",
    ],
  },
  bank: {
    name: "",
  },
};
