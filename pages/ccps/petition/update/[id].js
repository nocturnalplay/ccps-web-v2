import petitiondata from "@/data/petition/petitionDataFormate.json";
import petitioncomponent from "@/data/petition/petitionComponent.json";
import EntryData from "@/data/petition/petition-category-list.json";
import { useEffect, useState } from "react";
import { DateFormate, DropDown } from "@/components/Forms";
import { ApiFetcher } from "@/api/fetcher";
import { API_Query } from "@/api/api.url";
import { useRouter } from "next/router";
import Image from "next/image";
import { AlertMessage, Loading } from "@/components/messager";

export default function Newpetition({ id }) {
  const Router = useRouter();
  const [petition, setpetition] = useState(petitioncomponent);
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
          url: API_Query.column1("petition", "id", id),
          method: "GET",
        });
        if (c.Status) {
          if (c.Data[0]) {
            let dd = c.Data[0];
            Object.keys(dd).map((a) => {
              console.log(a);
              if (dd[a] == null) {
                petition[a] = "";
              } else {
                if (
                  a === "rec_from" ||
                  a === "enq_officer" ||
                  a === "category"
                ) {
                  petition[a] = String(dd[a]).toUpperCase();
                } else if (
                  a == "rec_date" ||
                  a == "csr_date" ||
                  a == "fir_date" ||
                  a == "dis_date"
                ) {
                  petition[a] = String(dd[a]).split("/").reverse().join("-");
                } else {
                  petition[a] = dd[a];
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

  //get the petition values from the input
  const GetValues = (e) => {
    setpetition((a) => ({ ...a, [e.target.name]: e.target.value }));
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
      petitiondata.map((a) => {
        if (
          a.table_name === "rec_date" ||
          a.table_name === "csr_date" ||
          a.table_name === "fir_date" ||
          a.table_name === "dis_date"
        ) {
          let val = DateFormate(petition[a.table_name]);
          petition[a.table_name] = val;
        }
      });
      let c = await ApiFetcher({
        url: API_Query.UpdateEntry("petition"),
        method: "POST",
        body: petition,
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
          Router.push(`/ccps/petition/${petition.id}`);
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
              <span>petition /</span> update
            </b>
          </div>
          <div className="heading">
            <div className="head-title">update petition record</div>
            <div className="head-action">
              <button name="submit" onClick={SubmitValues}>
                update
              </button>
            </div>
          </div>
          {petitiondata.map((a) => {
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
                      value={petition[a.table_name]}
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
                      value={petition[a.table_name]}
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
                      value={petition[a.table_name]}
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
