import { DateFormate } from "@/components/dateFormat";
import { IndexFetch, IndexYearFetch } from "@/components/indexFetch";
import { useEffect, useState } from "react";

export default function Fir() {
  const [date, setDate] = useState({
    from: "",
    to: "",
  });

  const [stagecount, setStagecount] = useState({});

  //API fetching is happening here
  useEffect(() => {
    return async () =>
      //get the total fetching data from the indexFetch function
      await IndexFetch({ table: "ncrp", setEvent: setStagecount });
  }, []);

  //set the from and to date function
  const changeDate = (e) => {
    setDate((a) => ({ ...a, [e.target.name]: e.target.value }));
  };
  //Date wise data fetch will happen
  const getYearData = async () => {
    if (date.from && date.to) {
      /*
    props.table = table name
    props.datecompare = date column name for comparison
    props.from = from date 
    props.to = to date
    props.setEvent = setevent
*/
      await IndexYearFetch({
        table: "ncrp",
        setEvent: setStagecount,
        datecompare: "action_taken",
        from: DateFormate(date.from),
        to: DateFormate(date.to),
      });
    } else {
      console.log("enter the both from and to");
    }
  };

  return (
    <div className="container csr">
      <div className="from-to">
        <input
          type="date"
          id="from"
          name="from"
          onChange={changeDate}
          value={date.from}
        />
        <span>to</span>
        <input
          type="date"
          id="to"
          name="to"
          onChange={changeDate}
          value={date.to}
        />
        <input type="button" value="submit" onClick={getYearData} />
      </div>
      <div className="data-count">
        {Object.keys(stagecount).map((a) => (
          <div key={a} className="data-box">
            <span>{a}</span>
            <span>{stagecount[a]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
