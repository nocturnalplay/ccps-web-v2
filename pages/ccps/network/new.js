import networkdata from "@/data/network/networkDataFormate.json";
import networkcomponent from "@/data/network/networkComponent.json";
import EntryData from "@/data/network/network-category-list.json";
import { useEffect, useState } from "react";
import { DropDown } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import { useRouter } from "next/router";
import { AlertMessage, Loading } from "@/components/messager";
import Image from "next/image";

export default function Newnetwork() {
  const Router = useRouter();
  const [network, setnetwork] = useState(networkcomponent);
  const [status, setStatus] = useState({
    msg: "",
    loading: true,
    error: false,
    success: false,
  });

  //get last entry frim the server
  useEffect(() => {
    setStatus((a) => ({
      ...a,
      loading: true,
      msg: "",
      error: false,
      success: false,
    }));
    (async () => {
      try {
        let c = await ApiFetcher({
          url: API_Query.getLast("network", "id"),
          method: "GET",
        });
        if (c.Status) {
          setnetwork((e) => ({
            ...e,
            id: parseInt(c.Data.id) + 1,
          }));
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
            msg: c.Message,
            error: true,
            success: false,
          }));
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
  }, []);

  //get the network values from the input
  const GetValues = (e) => {
    setnetwork((a) => ({ ...a, [e.target.name]: e.target.value }));
  };
  //submit the final result
  const SubmitValues = async () => {
    try {
      setStatus((a) => ({
        ...a,
        loading: true,
        msg: "",
        error: false,
        success: false,
      }));
      let c = await ApiFetcher({
        url: API_Query.NewEntry("network"),
        method: "POST",
        body: network,
      });
      if (c.Status) {
        setStatus((a) => ({
          ...a,
          loading: false,
          msg: c.Message,
          error: false,
          success: true,
        }));
        setTimeout(() => {
          Router.push(`/ccps/network/${network.id}`);
        }, 500);
      } else {
        setStatus((a) => ({
          ...a,
          loading: false,
          msg: c.Message,
          error: true,
          success: false,
        }));
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
  };
  if (status.success) {
    return (
      <>
        <AlertMessage msg={status.msg} title={"success"} />
      </>
    );
  }
  return (
    <>
      {status.error && <AlertMessage msg={status.msg} title={"error"} />}
      {status.loading ? (
        <Loading />
      ) : (
        <div className="new-entry">
          <div className="breadcrumb">
            <Image
              src="/list/list.png"
              className="icon"
              width={25}
              height={25}
              alt="home"
            />
            <b>
              <span>Network /</span> new
            </b>
          </div>
          <div className="heading">
            <div className="head-title">register the new network record</div>
            <div className="head-action">
              {/* <button>cancle</button> */}
              <button name="submit" onClick={SubmitValues}>
                save
              </button>
            </div>
          </div>
          {networkdata.map((a) => {
            if (a.table_name != "id")
              if (a.type === "textarea") {
                //the value is to entry in textarea here is the place
                return (
                  <div key={a.table_name} className="form-controller">
                    <label htmlFor={a.table_name}>{a.name}</label>
                    <textarea
                      id={a.table_name}
                      name={a.table_name}
                      onChange={GetValues}
                      disabled={a.disable}
                      value={network[a.table_name]}
                    ></textarea>
                  </div>
                );
              } else if (a.type === "option") {
                //the value is to entry in list of option here is the place

                return (
                  <div key={a.table_name} className="form-controller">
                    <label htmlFor={a.table_name}>{a.name}</label>
                    <DropDown
                      id={a.table_name}
                      name={a.table_name}
                      value={network[a.table_name]}
                      data={
                        a.table_name.search("network") > 0
                          ? EntryData["network"]
                          : EntryData[a.table_name]
                      }
                      onChange={GetValues}
                      disabled={a.disable}
                    />
                  </div>
                );
              } else {
                //normal text input
                return (
                  <div key={a.table_name} className="form-controller">
                    <label htmlFor={a.table_name}>{a.name}</label>
                    <input
                      type={a.type}
                      id={a.table_name}
                      name={a.table_name}
                      onChange={GetValues}
                      disabled={a.disable}
                      value={network[a.table_name]}
                    />
                  </div>
                );
              }
          })}
        </div>
      )}
    </>
  );
}
