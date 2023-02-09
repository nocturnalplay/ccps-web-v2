import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/pages/_app";
import Image from "next/image";
import Link from "next/link";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import { DateFormate } from "@/components/Forms";
import Dsrdownload from "@/components/dsrdownload";

const dateColumn = "dr";

export default function Dsr() {
  const [date, setDate] = useState();
  const [fulldata, setFulldata] = useState([]);
  const [data, setData] = useState();
  const me = useContext(UserContext);
  //API fetching is happening here
  useEffect(() => {
    let path = window.location.pathname;
    path = path.split("/");
    if (path.length > 2) {
      me.sm((a) => path[2]);
    }
    (async () => {
      let dsrdate = window.localStorage.getItem("dsrdate");
      if (dsrdate) {
        setDate(dsrdate);
      }
    })();
  }, []);

  //set the from and to date function
  const changeDate = (e) => {
    setDate(e.target.value);
  };

  //Date wise data fetch will happen
  const getYearData = async () => {
    try {
      if (date) {
        window.localStorage.setItem("dsrdate", date);
        let d = [];
        ["fir", "csr"].map((a) => {
          d.push(
            ApiFetcher({
              url: API_Query.yearCount(
                a,
                "dr",
                DateFormate(date),
                DateFormate(date)
              ),
            })
          );
          d.push(
            ApiFetcher({
              url: API_Query.year(
                a,
                "dr",
                DateFormate(date),
                DateFormate(date)
              ),
            })
          );
        });
        let co = await Promise.all(d).then((res) => res.map((a) => a.Data));
        d = co.map((a, i) => {
          //total 4 values in the array
          //first two fir and another two is csr
          if (i < 2) {
            if (i == 0) {
              return { name: "fir", value: co[i][0].count };
            } else {
              return { name: "fir", value: co[i] };
            }
          } else {
            if (i == 2) {
              return { name: "csr", value: co[i][0].count };
            } else {
              return { name: "csr", value: co[i] };
            }
          }
        });
        co = d.filter((a, i) => {
          if (i == 0 || i == 2) return a;
        });
        setData(co);
        co = d.filter((a, i) => {
          if (i == 1 || i == 3) return a;
        });
        let tem = [];
        co.map((a) => a.value.map((e) => tem.push(e)));
        setFulldata(tem);
      } else {
        console.log("enter the both from and to");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(data);
  console.log(fulldata);
  return (
    <div className="dsr">
      <div className="breadcrumb">
        <Image
          src="/list/note.png"
          className="icon"
          width={20}
          height={20}
          alt="home"
        />
        <b>
          DSR / <span>default</span>
        </b>
      </div>
      <div className="from-to">
        <h2>get daily DSR by Date</h2>
        <div className="date-input">
          <input
            type="date"
            id="from"
            name="from"
            onChange={changeDate}
            value={date}
          />
          <input type="button" value="submit" onClick={getYearData} />
        </div>
      </div>
      <div className="dsr-body">
        {!data ? (
          <div className="dsr-info">
            <b>Please select the date to get exact DSR for both FIR and CSR</b>
            <Image
              src="/list/waiting.png"
              className="icon"
              width={90}
              height={80}
              alt="home"
            />
          </div>
        ) : (
          <>
            <div className="dsr-card">
              {data.map((a) => (
                <div className="card" key={a.name + a.value}>
                  <div className="card-body">
                    <h1 className="card-title">
                      <span>total</span>
                      {a.name}
                    </h1>
                    <h1 className="card-content">
                      <b>{a.value}</b>
                    </h1>
                  </div>
                  <div className="card-footer">
                    <Link
                      href={
                        date
                          ? `/ccps/list/${
                              a.name
                            }?dt=${dateColumn}&f=${DateFormate(
                              date
                            )}&t=${DateFormate(date)}`
                          : `/ccps/list/${a.name}`
                      }
                    >
                      <h4>view list</h4>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="get-dsr">
              <span>
                you can able get the DSR for both FIR and CSR by clicking the
                below button
              </span>
              <Dsrdownload
                className="dsr-download"
                data={fulldata}
                date={date}
                txt={"get DSR"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
