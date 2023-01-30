import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";

/*
    props.table = table name
    props.setEvent = setevent
*/

export const IndexFetch = async (props) => {
  const da = [];
  //total data of the table
  da.push(
    ApiFetcher({
      url: API_Query.totalCount(props.table),
      method: "GET",
    })
  );
  //getting the stage data from API
  datalist[props.table].value.map((val) =>
    da.push(
      ApiFetcher({
        url: API_Query.column1Count(
          props.table,
          datalist[props.table].name,
          val
        ),
        method: "GET",
      })
    )
  );
  //fetch all the data in the list as fetch like
  let co = await Promise.all(da).then((res) =>
    Promise.all(res.map((a, i) => a.Data[0].count)).then((a) => a)
  );
  //set event data value in setEvent
  co.map((a, i) => {
    props.setEvent((e) => ({
      ...e,
      [i == 0 ? "total" : datalist[props.table].value[i - 1]]: a,
    }));
  });
};

/*
    props.table = table name
    props.datecompare = date column name for comparison
    props.from = from date 
    props.to = to date
    props.setEvent = setevent
*/
export const IndexYearFetch = async (props) => {
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
  datalist[props.table].value.map((val) =>
    da.push(
      ApiFetcher({
        url: API_Query.yearColumn1Count(
          props.table,
          datalist[props.table].name,
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
  let co = await Promise.all(da).then((res) =>
    Promise.all(res.map((a, i) => a.Data[0].count)).then((a) => a)
  );
  //set event data value in setEvent
  co.map((a, i) => {
    props.setEvent((e) => ({
      ...e,
      [i == 0 ? "total" : datalist[props.table].value[i - 1]]: a,
    }));
  });
};

var datalist = {
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
  bank:{
    name:"",
  }
};
