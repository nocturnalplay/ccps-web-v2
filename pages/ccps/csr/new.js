import csrdata from "@/data/csr/csrDataFormate.json";
import csrcomponent from "@/data/csr/csrComponent.json";
import EntryData from "@/data/csr/csr-category-list.json";
import { useEffect, useState } from "react";
import { DropDown, DateFormate } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import Image from "next/image";
import { useRouter } from "next/router";
import { AlertMessage, Loading } from "@/components/messager";

export default function Newcsr() {
  const Router = useRouter();
  const [csr, setcsr] = useState(csrcomponent);
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
          url: API_Query.getLast("csr", "csr_no"),
          method: "GET",
        });
        if (c.Status) {
          let cr = c.Data.csr_no.split("/");
          setcsr((e) => ({
            ...e,
            id: c.Data.id + 1,
            csr_no: `${parseInt(cr[0]) + 1}/${cr[1]}`,
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

  //get the csr values from the input
  const GetValues = (e) => {
    let name = e.target.name;
    if (
      name === "prop_lost" ||
      name === "prop_hold" ||
      name === "prop_rec" ||
      name === "prop_refund" ||
      name === "prop_pending"
    ) {
      setcsr((a) => ({ ...a, [name]: parseFloat(e.target.value) }));
      if (name === "prop_lost") {
        setcsr((a) => ({
          ...a,
          prop_pending: parseFloat(
            parseInt(e.target.value) - (csr.prop_rec + csr.prop_refund)
          ),
        }));
      } else if (name === "prop_rec") {
        setcsr((a) => ({
          ...a,
          prop_pending: parseFloat(
            csr.prop_lost - (parseInt(e.target.value) + csr.prop_refund)
          ),
        }));
      } else if (name === "prop_refund") {
        setcsr((a) => ({
          ...a,
          prop_pending: parseFloat(
            csr.prop_lost - (csr.prop_rec + parseInt(e.target.value))
          ),
        }));
      }
    } else {
      setcsr((a) => ({ ...a, [name]: e.target.value }));
    }
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
      csrdata.map((a) => {
        if (
          a.table_name === "do" ||
          a.table_name === "dr" ||
          a.table_name === "dis_date"
        ) {
          let val = DateFormate(csr[a.table_name]);
          csr[a.table_name] = val;
        }
      });
      let c = await ApiFetcher({
        url: API_Query.NewEntry("csr"),
        method: "POST",
        body: csr,
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
          Router.push(`/ccps/csr/${csr.id}`);
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
              <span>CSR /</span> new
            </b>
          </div>
          <div className="heading">
            <div className="head-title">register the new CSR record</div>
            <div className="head-action">
              {/* <button name="cancle">cancle</button> */}
              <button name="submit" onClick={SubmitValues}>
                save
              </button>
            </div>
          </div>
          {csrdata.map((a) => {
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
                      value={csr[a.table_name]}
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
                      value={csr[a.table_name]}
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
                      value={csr[a.table_name]}
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
