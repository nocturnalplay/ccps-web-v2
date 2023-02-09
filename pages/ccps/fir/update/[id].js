import firdata from "@/data/fir/firDataFormate.json";
import fircomponent from "@/data/fir/firComponent.json";
import EntryData from "@/data/fir/fir-category-list.json";
import { useEffect, useState } from "react";
import { DateFormate, DropDown } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import Image from "next/image";
import { AlertMessage, Loading } from "@/components/messager";
import { useRouter } from "next/router";

export default function NewFIR({ id }) {
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
          url: API_Query.column1("fir", "id", id),
          method: "GET",
        });
        if (c.Status) {
          if (c.Data[0]) {
            let dd = c.Data[0];
            Object.keys(dd).map((a) => {
              if (dd[a] == null) {
                fir[a] = "";
              } else {
                if (
                  a === "importance" ||
                  a === "category" ||
                  a === "sub_category" ||
                  a === "addl_category" ||
                  a === "receive" ||
                  a === "stage" ||
                  a === "fir_reg"
                ) {
                  fir[a] = String(dd[a]).toUpperCase();
                } else if (
                  a == "do_from" ||
                  a == "do_to" ||
                  a == "dr" ||
                  a == "dis_date"
                ) {
                  fir[a] = String(dd[a]).split("/").reverse().join("-");
                } else {
                  fir[a] = dd[a];
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
        url: API_Query.UpdateEntry("fir"),
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
              <span>FIR /</span> update
            </b>
          </div>
          <div className="heading">
            <div className="head-title">register the new FIR record</div>
            <div className="head-action">
              <button name="submit" onClick={SubmitValues}>
                update
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
                      value={fir[a.table_name]}
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
                      value={fir[a.table_name]}
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
