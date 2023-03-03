import ncrpdata from "@/data/ncrp/ncrpDataFormate.json";
import ncrpcomponent from "@/data/ncrp/ncrpComponent.json";
import EntryData from "@/data/ncrp/ncrp-category-list.json";
import { useEffect, useState } from "react";
import { DateFormate, DropDown } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import { useRouter } from "next/router";
import { AlertMessage, Loading } from "@/components/messager";
import Image from "next/image";

export default function Newncrp({ id }) {
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
          url: API_Query.column1("ncrp", "id", id),
          method: "GET",
        });
        if (c.Status) {
          if (c.Data[0]) {
            let dd = c.Data[0];
            Object.keys(dd).map((a) => {
              if (dd[a] == null) {
                ncrp[a] = "";
              } else {
                if (
                  a === "dist" ||
                  a === "ps" ||
                  a === "category" ||
                  a === "sub_category"
                ) {
                  ncrp[a] = String(dd[a]).toUpperCase();
                } else if (
                  a === "incident_date" ||
                  a === "compl_date" ||
                  a === "action_taken" ||
                  a === "csr_date" ||
                  a === "fir_date"
                ) {
                  let d = dd[a].split(" ");
                  d = d[0].split("/");
                  ncrp[a] = `${d[2]}-${d[1]}-${d[0]}`;
                } else {
                  ncrp[a] = dd[a];
                }
              }
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
              msg: `No available data for id ${id}`,
              error: true,
              success: false,
            }));
          }
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
    setStatus((a) => ({
      ...a,
      loading: true,
      msg: "",
      error: false,
      success: false,
    }));
    try {
      ncrpdata.map((a) => {
        if (
          a.table_name === "incident_date" ||
          a.table_name === "compl_date" ||
          a.table_name === "action_taken" ||
          a.table_name === "csr_date" ||
          a.table_name === "fir_date"
        ) {
          let val = DateFormate(ncrp[a.table_name]);
          ncrp[a.table_name] = val;
        }
      });
      let c = await ApiFetcher({
        url: API_Query.UpdateEntry("ncrp"),
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
  } else if (status.error) {
    return (
      <>
        <AlertMessage msg={status.msg} title={"error"} />
      </>
    );
  }
  return (
    <>
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
              <span>NCRP /</span> update
            </b>
          </div>
          <div className="heading">
            <div className="head-title">register the new ncrp record</div>
            <div className="head-action">
              <button name="submit" onClick={SubmitValues}>
                update
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
                      onClick={(e) => e.target.select()}
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
                      onClick={(e) => e.target.select()}
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
                      onClick={(e) => e.target.select()}
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

export async function getServerSideProps(context) {
  return {
    props: { id: context.query.id },
  };
}
