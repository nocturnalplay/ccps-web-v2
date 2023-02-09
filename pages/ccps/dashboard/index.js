import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const dashboardList = ["fir", "csr", "ncrp"];

export default function Dashboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        let da = [];
        dashboardList.map((a) => {
          da.push(
            ApiFetcher({
              url: API_Query.totalCount(a),
              method: "GET",
            })
          );
        });
        let co = await Promise.all(da).then((res) =>
          Promise.all(res.map((a, i) => a.Data[0].count)).then((a) => a)
        );
        da = [];
        co.map((a, i) => {
          da.push({ name: dashboardList[i], value: a });
        });
        setData(da);
      } catch (error) {
        console.log(error.Message);
      }
    })();
  }, []);
  console.log(data);
  return (
    <div className="dasboard-container">
      <div className="breadcrumb">
        <Image
          src="/dashboard/home.png"
          className="icon"
          width={25}
          height={25}
          alt="home"
        />
        <b>
          dashboard / <span>default</span>
        </b>
      </div>
      <div className="dashboard-content">
        {data.map((a) => (
          <div className="card" key={a.name}>
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
              <Link href={`/ccps/${a.name}`}>
                <h4>view list</h4>
              </Link>
            </div>
          </div>
        ))}
        {/* <div className="card">
          <div className="card-body">
            <h1 className="card-title">
              <span>total</span>fir
            </h1>
            <h1 className="card-content">
              <b>12045</b>
            </h1>
          </div>
          <div className="card-footer">
            <h4>view list</h4>
          </div>
        </div> */}
      </div>
    </div>
  );
}
