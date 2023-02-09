import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";
import Table from "@/components/table/Table";
import FirData from "@/data/fir/firDataFormate.json";
import CsrData from "@/data/csr/csrDataFormate.json";
import NcrpData from "@/data/ncrp/ncrpDataFormate.json";
import BankData from "@/data/bank/bankDataFormate.json";
import NetworkData from "@/data/network/networkDataFormate.json";
import PetitionData from "@/data/petition/petitionDataFormate.json";
import { useEffect, useState } from "react";

const tableList = [
  {
    name: "fir",
    list: FirData,
  },
  {
    name: "csr",
    list: CsrData,
  },
  {
    name: "ncrp",
    list: NcrpData,
  },
  {
    name: "bank",
    list: BankData,
  },
  {
    name: "network",
    list: NetworkData,
  },
  {
    name: "petition",
    list: PetitionData,
  },
  {
    name: "social-media",
    list: PetitionData,
  },
];

export default function FirTableView({ query }) {
  const [row, setRow] = useState();
  useEffect(() => {
    (async () => {
      let d = await getData(query);
      setRow(d);
    })();
    return () => {
      console.log("clear the fetch");
    };
  }, []);
  if (tableList.filter((a) => a.name == query.table[0]).length) {
    return (
      <div className="list-table">
        {
          <Table
            col={tableList.filter((a) => a.name == query.table[0])[0].list}
            row={row}
            current={query.table[0]}
          />
        }
      </div>
    );
  } else {
    return <div className="list-table">no record found</div>;
  }
}

/*
props.f = from date
props.t = to date
props.dt = date table
props.v1 = column one values
props.v2 = column two values
*/

async function getData(props) {
  try {
    //length of the table is one it can able to get total of the table and
    //year wise data in the table no comparison going to happen
    if (props.table.length == 1) {
      //if year formate exist
      if (props.f && props.t && props.dt) {
        let d = await ApiFetcher({
          url: API_Query.year(props.table[0], props.dt, props.f, props.t),
          method: "GET",
        });
        if (d.Status) {
          return d.Data;
        }
        return [];
      } else {
        //if no date formate exist this else part will happens
        let d = await ApiFetcher({
          url: API_Query.total(props.table[0]),
          method: "GET",
        });
        if (d.Status) {
          return d.Data;
        }
        return [];
      }
    } else if (props.table.length == 2 && props.v1) {
      //if year formate exist this one column compare happens
      if (props.table[1] == "prop_lost") {
        let val = proplost.filter((a) => a.name == props.v1);
        props.v1 = val.length > 0 ? val[0].value : "";
      }

      if (props.f && props.t && props.dt) {
        let d = await ApiFetcher({
          url: API_Query.yearColumn1(
            props.table[0],
            props.table[1],
            props.v1,
            props.dt,
            props.f,
            props.t
          ),
          method: "GET",
        });
        if (d.Status) {
          return d.Data;
        }
        return [];
      } else {
        //if no date formate exist this else part will happens
        let d = await ApiFetcher({
          url: API_Query.column1(props.table[0], props.table[1], props.v1),
          method: "GET",
        });

        if (d.Status) {
          return d.Data;
        }
        return [];
      }
    } else if (props.table.length == 3 && props.v1 && props.v2) {
      //if year formate exist this one column compare happens
      if (props.f && props.t && props.dt) {
        let d = await ApiFetcher({
          url: API_Query.yearColumn2(
            props.table[0],
            props.table[1],
            props.v1,
            props.table[2],
            props.v2,
            props.dt,
            props.f,
            props.t
          ),
          method: "GET",
        });
        if (d.Status) {
          return d.Data;
        }
        return [];
      } else {
        //if no date formate exist this else part will happens
        let d = await ApiFetcher({
          url: API_Query.column2(
            props.table[0],
            props.table[1],
            props.v1,
            props.table[2],
            props.v2
          ),
          method: "GET",
        });
        if (d.Status) {
          return d.Data;
        }
        return [];
      }
    } else {
      return [];
    }
  } catch (error) {
    console.log(error.Message);
  }
}

export async function getServerSideProps(context) {
  return {
    props: { query: context.query },
  };
}

const proplost = [
  { name: "Above 50l", value: "5000000,500000000000" },
  { name: "5l-50l", value: "500001,5000000" },
  { name: "3l-5l", value: "300001,500000" },
  { name: "1l-3l", value: "100001,300000" },
  { name: "50k-1l", value: "50001,100000" },
  { name: "1-50k", value: "1,50000" },
  { name: "no lost", value: "0,0" },
];
