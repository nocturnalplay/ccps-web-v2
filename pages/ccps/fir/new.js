import firdata from "@/data/fir/firDataFormate.json";
import fircomponent from "@/data/fir/firComponent.json";
import EntryData from "@/data/fir/fir-category-list.json";
import { useEffect, useState } from "react";
import { DropDown, DateFormate } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import Image from "next/image";
import { Loading, AlertMessage } from "@/components/messager";
import { useRouter } from "next/router";

export default function NewFIR() {
  const Router = useRouter();
  const [fir, setFir] = useState(fircomponent);
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
          url: API_Query.getLast("fir", "cr_no"),
          method: "GET",
        });
        if (c.Status) {
          let cr = c.Data.cr_no.split("/");
          setFir((e) => ({
            ...e,
            id: c.Data.id + 1,
            cr_no: `${parseInt(cr[0]) + 1}/${cr[1]}`,
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
    return () => console.log("component cleared");
  }, []);

  //get the fir values from the input
  const GetValues = (e) => {
    let name = e.target.name;
    if (
      name === "prop_lost" ||
      name === "prop_hold" ||
      name === "prop_rec" ||
      name === "prop_refund" ||
      name === "prop_pending"
    ) {
      setFir((a) => ({ ...a, [name]: parseFloat(e.target.value) }));
      if (name === "prop_lost") {
        setFir((a) => ({
          ...a,
          prop_pending: parseFloat(
            parseInt(e.target.value) - (fir.prop_rec + fir.prop_refund)
          ),
        }));
      } else if (name === "prop_rec") {
        setFir((a) => ({
          ...a,
          prop_pending: parseFloat(
            fir.prop_lost - (parseInt(e.target.value) + fir.prop_refund)
          ),
        }));
      } else if (name === "prop_refund") {
        setFir((a) => ({
          ...a,
          prop_pending: parseFloat(
            fir.prop_lost - (fir.prop_rec + parseInt(e.target.value))
          ),
        }));
      }
    } else {
      setFir((a) => ({ ...a, [name]: e.target.value }));
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
      firdata.map((a) => {
        if (
          a.table_name === "do_from" ||
          a.table_name === "do_to" ||
          a.table_name === "dr" ||
          a.table_name === "dis_date"
        ) {
          let val = DateFormate(fir[a.table_name]);
          fir[a.table_name] = val;
        }
      });
      let c = await ApiFetcher({
        url: API_Query.NewEntry("fir"),
        method: "POST",
        body: fir,
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
          Router.push(`/ccps/fir/${fir.id}`);
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
              <span>FIR /</span> new
            </b>
          </div>
          <div className="heading">
            <div className="head-title">register the new FIR record</div>
            <div className="head-action">
              {/* <button name="cancle">cancle</button> */}
              <button name="submit" onClick={SubmitValues}>
                save
              </button>
            </div>
          </div>
          {firdata.map((a) => {
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
                      value={fir[a.table_name]}
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
                      value={fir[a.table_name]}
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
                      value={fir[a.table_name]}
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
