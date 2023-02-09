import bankdata from "@/data/bank/bankDataFormate.json";
import bankcomponent from "@/data/bank/bankComponent.json";
import EntryData from "@/data/bank/bank-category-list.json";
import { useEffect, useState } from "react";
import { DropDown, DateFormate } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import { BankDisrtct } from "@/components/bankDistrict";
import { useRouter } from "next/router";
import { AlertMessage, Loading } from "@/components/messager";
import Image from "next/image";

export default function Newbank() {
  const Router = useRouter();
  const [bank, setbank] = useState(bankcomponent);
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
          url: API_Query.getLast("bank", "id"),
          method: "GET",
        });
        if (c.Status) {
          setbank((e) => ({
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
  //get the bank values from the input
  const GetValues = (e) => {
    setbank((a) => ({ ...a, [e.target.name]: e.target.value }));
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
      bankdata.map((a) => {
        if (
          a.table_name === "c_date" ||
          a.table_name === "csr_date" ||
          a.table_name === "cr_date" ||
          a.table_name === "freezed_date" ||
          a.table_name === "unfreezed_date"
        ) {
          let val = DateFormate(fir[a.table_name]);
          bank[a.table_name] = val;
        }
      });
      let c = await ApiFetcher({
        url: API_Query.NewEntry("bank"),
        method: "POST",
        body: bank,
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
          Router.push(`/ccps/bank/${bank.id}`);
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
              <span>Bank /</span> new
            </b>
          </div>
          <div className="heading">
            <div className="head-title">register the new bank record</div>
            <div className="head-action">
              {/* <button>cancle</button> */}
              <button name="submit" onClick={SubmitValues}>
                save
              </button>
            </div>
          </div>
          {bankdata.map((a) => {
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
                      value={bank[a.table_name]}
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
                      value={bank[a.table_name]}
                      data={
                        a.table_name.search("bank") > 0
                          ? EntryData["bank"]
                          : a.table_name === "credit_dist"
                          ? BankDisrtct(bank["credit_state"])
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
                      value={bank[a.table_name]}
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
