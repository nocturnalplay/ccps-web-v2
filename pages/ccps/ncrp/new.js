import ncrpdata from "@/data/ncrp/ncrpDataFormate.json";
import ncrpcomponent from "@/data/ncrp/ncrpComponent.json";
import EntryData from "@/data/ncrp/ncrp-category-list.json";
import { useEffect, useState } from "react";
import { DateFormate, DropDown } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import { AlertMessage, Loading } from "@/components/messager";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Newncrp() {
  const Router = useRouter();
  const [ncrp, setncrp] = useState(ncrpcomponent);
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
          url: API_Query.getLast("ncrp", "id"),
          method: "GET",
        });
        if (c.Status) {
          setncrp((e) => ({
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

  //get the ncrp values from the input
  const GetValues = (e) => {
    setncrp((a) => ({ ...a, [e.target.name]: e.target.value }));
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
      ncrpdata.map((a) => {
        if (
          a.table_name === "incident_date" ||
          a.table_name === "compl_date" ||
          a.table_name === "action_taken"||
          a.table_name === "csr_date" ||
          a.table_name === "fir_date"
        ) {
          let val = DateFormate(ncrp[a.table_name]);
          ncrp[a.table_name] = val;
        }
      });

      let c = await ApiFetcher({
        url: API_Query.NewEntry("ncrp"),
        method: "POST",
        body: ncrp,
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
          Router.push(`/ccps/ncrp/${ncrp.id}`);
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
              <span>NCRP /</span> new
            </b>
          </div>
          <div className="heading">
            <div className="head-title">register the new NCRP record</div>
            <div className="head-action">
              {/* <button>cancle</button> */}
              <button name="submit" onClick={SubmitValues}>
                save
              </button>
            </div>
          </div>
          {ncrpdata.map((a) => {
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
                      value={ncrp[a.table_name]}
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
                      value={ncrp[a.table_name]}
                      data={EntryData[a.table_name]}
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
                      value={ncrp[a.table_name]}
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
