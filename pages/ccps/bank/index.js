import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/pages/_app";

export default function bank() {
  const [data, setData] = useState();
  const me = useContext(UserContext);
  useEffect(() => {
    let path = window.location.pathname;
    path = path.split("/");
    if (path.length > 2) {
      me.sm((a) => path[2]);
    }
    (async () => {
      try {
        let d = await ApiFetcher({
          url: API_Query.totalCount("bank"),
          method: "GET",
        });
        if (d.Status) {
          setData(d.Data[0].count);
        }
      } catch (error) {
        console.log(error.Message);
      }
    })();
  }, []);
  return (
    <div className="bank-container">
      <div className="breadcrumb">
        <Image
          src="/list/list.png"
          className="icon"
          width={25}
          height={25}
          alt="home"
        />
        <b>
          bank / <span>default</span>
        </b>
      </div>
      <div className="bank-body">
        <Link href="/ccps/bank/new">
          <div className="new-bank">
            <div>
              <Image
                src="/list/add.png"
                className="icon"
                width={45}
                height={45}
                alt="home"
              />
            </div>
            <span>new bank</span>
          </div>
        </Link>

        <div className="card">
          <div className="card-body">
            <h1 className="card-title">
              <span>total</span>bank
            </h1>
            <h1 className="card-content">
              <b>{data}</b>
            </h1>
          </div>
          <div className="card-footer">
            <Link href="/ccps/list/bank">
              <h4>view list</h4>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
