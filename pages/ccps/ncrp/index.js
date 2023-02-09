import { DateFormate } from "@/components/Forms";
import { Datalist, IndexFetch, IndexYearFetch } from "@/components/indexFetch";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/pages/_app";
import Image from "next/image";
import Link from "next/link";

//date column name to compare
const dateColumn = "action_taken";

export default function ncrp() {
  const [date, setDate] = useState({
    from: "",
    to: "",
  });
  const me = useContext(UserContext);
  const [stagecount, setStagecount] = useState({});

  const [status, setStatus] = useState({
    msg: "",
    loading: true,
    error: false,
    success: false,
  });

  //API fetching is happening here
  useEffect(() => {
    setStatus((a) => ({
      ...a,
      loading: true,
      msg: "",
      error: false,
      success: false,
    }));

    let path = window.location.pathname;
    path = path.split("/");
    if (path.length > 2) {
      me.sm((a) => path[2]);
    }
    (async () => {
      //get the total fetching data from the indexFetch function
      let data = await IndexFetch({ table: "ncrp", setEvent: setStagecount });
      if (data.data.length > 0) {
        data.data.map((a, i) => {
          setStagecount((e) => ({
            ...e,
            [i == 0 ? "total" : Datalist["ncrp"].value[i - 1]]: a,
          }));
        });
        setStatus((a) => ({
          ...a,
          loading: false,
          msg: "",
          error: false,
          success: false,
        }));
      } else {
        setStatus((a) => ({
          ...a,
          loading: false,
          msg: data.error,
          error: true,
          success: false,
        }));
      }
    })();
  }, []);

  //set the from and to date function
  const changeDate = (e) => {
    setDate((a) => ({ ...a, [e.target.name]: e.target.value }));
  };
  //Date wise data fetch will happen
  const getYearData = async () => {
    if (date.from && date.to) {
      /*
    props.table = table name
    props.datecompare = date column name for comparison
    props.from = from date 
    props.to = to date
    props.setEvent = setevent
*/
      let data = await IndexYearFetch({
        table: "ncrp",
        setEvent: setStagecount,
        datecompare: "action_taken",
        from: DateFormate(date.from),
        to: DateFormate(date.to),
      });
      if (data.data.length) {
        data.data.map((a, i) => {
          setStagecount((e) => ({
            ...e,
            [i == 0 ? "total" : Datalist["ncrp"].value[i - 1]]: a,
          }));
        });
        setStatus((a) => ({
          ...a,
          loading: false,
          msg: "",
          error: false,
          success: false,
        }));
      } else {
        setStatus((a) => ({
          ...a,
          loading: false,
          msg: data.error,
          error: true,
          success: false,
        }));
      }
    } else {
      alert("enter the both from and to");
    }
  };
  console.log(date);
  return (
    <div className="ncrp-container">
      <div className="breadcrumb">
        <Image
          src="/list/list.png"
          className="icon"
          width={25}
          height={25}
          alt="home"
        />
        <b>
          ncrp / <span>default</span>
        </b>
      </div>
      <div className="from-to">
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
          <input type="button" value="submit" onClick={getYearData} />
        </div>
      </div>
      <div className="c-body">
        <div className="part-1">
          <div className="multi-list">
            If you want to access the multiple comparison in ncrp data list
            <Link href="/ccps/ncrp/table">
              <span>click here</span>
            </Link>
          </div>
          <Link href="/ccps/ncrp/new">
            <div className="new-entry">
              <div>
                <Image
                  src="/list/add.png"
                  className="icon"
                  width={45}
                  height={45}
                  alt="home"
                />
              </div>
              <span>NEW NCRP</span>
            </div>
          </Link>
          {/* only total table bar will show in this phase*/}
          {Object.keys(stagecount).map((a, i) => {
            if (i == 0)
              return (
                <div className="card">
                  <div className="card-body">
                    <h1 className="card-title">
                      <span>total</span>
                      ncrp
                    </h1>
                    <h1 className="card-content">
                      <b>{stagecount[a]}</b>
                    </h1>
                  </div>
                  <div className="card-footer">
                    <Link
                      href={
                        date.from && date.to
                          ? `/ccps/list/ncrp?dt=${dateColumn}&f=${DateFormate(
                              date.from
                            )}&t=${DateFormate(date.to)}`
                          : "/ccps/list/ncrp"
                      }
                    >
                      <h4>view list</h4>
                    </Link>
                  </div>
                </div>
              );
          })}
        </div>
        <div className="part-2">
          {/* all other compared different stages will display in the area*/}
          {Object.keys(stagecount).map((a, i) => {
            if (i != 0)
              return (
                <div className="card">
                  <div className="card-body">
                    <h1 className="card-title">
                      {/* <span>total</span> */}
                      {a}
                    </h1>
                    <h1 className="card-content">
                      <b>{stagecount[a]}</b>
                    </h1>
                  </div>
                  <div className="card-footer">
                    <Link
                      href={
                        date.from && date.to
                          ? `/ccps/list/ncrp/action_type?dt=${dateColumn}&v1=${a}&f=${DateFormate(
                              date.from
                            )}&t=${DateFormate(date.to)}`
                          : `/ccps/list/ncrp/action_type?v1=${a}`
                      }
                    >
                      <h4>view list</h4>
                    </Link>
                  </div>
                </div>
              );
          })}
        </div>
        {/* <div className="multi-list">
        </div> */}
      </div>
    </div>
  );
}
