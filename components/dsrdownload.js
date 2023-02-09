import DSRdata from "../data/dsrDataFormate.json";
import * as xlsx from "xlsx";
import * as xlsxpopulate from "xlsx-populate/browser/xlsx-populate";
import { DateFormate } from "./Forms";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import Tooltip from "@mui/material/Tooltip";

export default function Dsrdownload(props) {
  const { data, date, className } = props;
  const dsrheader = DSRdata.headername; //dsr data type

  const exportdata = () => {
    //final excel report download
    resultdownload().then((url) => {
      const downloadan = document.createElement("a");
      downloadan.setAttribute("href", url);
      downloadan.setAttribute(
        "download",
        `SALEM CITY DSR-${DateFormate(date)}.xlsx`
      );
      downloadan.click();
      downloadan.remove();
    });
  };

  //=------------------------------------------------------------=
  //addstyle function
  const addstyle = (workbookblob, datainfo, border) => {
    return xlsxpopulate.fromDataAsync(workbookblob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        //column styling
        let col = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        let tit = [
          "A4:I4",
          datainfo[datainfo.length - 2].titleRange,
          datainfo[datainfo.length - 1].titleRange,
        ];

        //sheet.cell("A4").style("border","thin")

        sheet.column("A").width(5).style({
          horizontalAlignment: "center",
          fontSize: 10,
        });

        //title header for the table data
        for (let i = 1; i < 3; i++) {
          tit[i] = tit[i].split(":");
          tit[i] = `A${parseInt(tit[i][0].slice(1)) + 1}:I${
            parseInt(tit[i][0].slice(1)) + 1
          }`;
        }

        console.log("tit:", tit);
        tit.map((a) => {
          sheet.range(a).style({
            bold: true,
            fontSize: 10,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        });

        //border styling
        border.map((a) => {
          let val = a.split(":");
          let numstart = val[0]
            .split("")
            .filter((a, i) => i != 0)
            .join("");
          let numend = val[1]
            .split("")
            .filter((a, i) => i != 0)
            .join("");

          for (let i = parseInt(numstart); i <= parseInt(numend); i++) {
            col.map((a) => {
              sheet.cell(`${a}${i}`).style({
                border: "thin",
                borderColor: "000",
                verticalAlignment: "top",
              });
            });
          }
        });

        col.map((a) => {
          if (a == "A") return;
          if (a == "G")
            return sheet.column(a).width(20).style({
              wrapText: true,
              fontSize: 10,
            });
          sheet.column(a).width(20).style({
            fontSize: 10,
          });
        });
        datainfo.map((a) => {
          sheet.range(a.titleRange).merged(true).style({
            bold: true,
            fontSize: 12,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        });
      });
      return workbook.outputAsync().then((work) => URL.createObjectURL(work));
    });
  };
  //find length of the array size
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; i++) {
      view[i] = s.charCodeAt(i);
    }
    return buf;
  };

  //work blob
  const workbook2blbo = (wrkbook) => {
    const wops = {
      bookType: "xlsx",
      type: "binary",
    };

    const ebout = xlsx.write(wrkbook, wops);

    const blob = new Blob([s2ab(ebout)], {
      type: "application/octet-stream",
    });
    return blob;
  };
  //=------------------------------------------------------------=
  //end result of the workbook style sheet
  const resultdownload = () => {
    //title for the excel sheet
    const title = [{ A: "DSR Dated: " + DateFormate(date) }]
      .concat([{ A: "District: Salem City" }])
      .concat([{ A: "NCRP Complaints" }]);
    let dsrlist = { ncrp: [], cctns: [], direct: [] };

    try {
      data.map((a, i) => {
        if (a.cr_no == undefined) {
          let raw = {
            ack_num: a.ack_num,
            do_dr: `DO:${a.do} ${a.do_time} , DR:${a.dr} ${a.dr_time}`,
            roll_no: `${"CSR No:" + a.csr_no} & ${a.dr}`,
            compl: a.compl,
            suspect: `${a.suspect}`,
            gist: a.gist,
            action: a.action,
          };
          if (a.receive.search(/ncrp/i) >= 0) {
            dsrlist.ncrp.push(raw);
          } else if (a.receive.search(/direct/i) >= 0) {
            dsrlist.direct.push(raw);
          } else if (a.receive.search(/cctns/i) >= 0) {
            dsrlist.cctns.push(raw);
          }
        } else {
          let raw = {
            ack_num: a.ack_num,
            do_dr: `DO:${a.do_from} ${a.do_ftime} , DR:${a.dr} ${a.dr_time}`,
            roll_no: `${"FIR No:" + a.cr_no} & ${a.sol}`,
            compl: a.compl,
            suspect: `${a.accus}`,
            gist: a.gist,
            action: a.action,
          };
          if (a.receive.search(/ncrp/i) >= 0) {
            dsrlist.ncrp.push(raw);
          } else if (a.receive.search(/direct/i) >= 0) {
            dsrlist.direct.push(raw);
          } else if (a.receive.search(/cctns/i) >= 0) {
            dsrlist.cctns.push(raw);
          }
        }
      });
    } catch (e) {
      console.log(e.message);
    }
    let table1 = [
      {
        A: dsrheader[0],
        B: dsrheader[1],
        C: dsrheader[2],
        D: dsrheader[3],
        E: dsrheader[4],
        F: dsrheader[5],
        G: dsrheader[6],
        H: dsrheader[7],
        I: dsrheader[8],
      },
    ];

    if (dsrlist.ncrp.length > 0) {
      dsrlist.ncrp.map((a, i) => {
        table1.push({
          A: i + 1,
          B: a.ack_num,
          C: a.do_dr,
          D: a.roll_no,
          E: a.compl,
          F: a.suspect,
          G: a.gist,
          H: a.action,
          I: "Nil",
        });
      });
    }

    table1 = table1.concat([""]); //table 1 ended

    let table2 = [{ A: "CCTNS Complaints" }].concat([
      {
        A: dsrheader[0],
        B: dsrheader[1],
        C: dsrheader[2],
        D: dsrheader[3],
        E: dsrheader[4],
        F: dsrheader[5],
        G: dsrheader[6],
        H: dsrheader[7],
        I: dsrheader[8],
      },
    ]);
    if (dsrlist.cctns.length > 0) {
      dsrlist.cctns.map((a, i) => {
        table2.push({
          A: i + 1,
          B: a.ack_num,
          C: a.do_dr,
          D: a.roll_no,
          E: a.compl,
          F: a.suspect,
          G: a.gist,
          H: a.action,
          I: "Nil",
        });
      });
    }
    table2 = table2.concat([""]); //table 2 ended

    let table3 = [
      { A: "Direct Complaints/Current Papers/Email from Hqrs" },
    ].concat([
      {
        A: dsrheader[0],
        B: dsrheader[1],
        C: dsrheader[2],
        D: dsrheader[3],
        E: dsrheader[4],
        F: dsrheader[5],
        G: dsrheader[6],
        H: dsrheader[7],
        I: dsrheader[8],
      },
    ]);
    if (dsrlist.direct.length > 0) {
      dsrlist.direct.map((a, i) => {
        table3.push({
          A: i + 1,
          B: a.ack_num,
          C: a.do_dr,
          D: a.roll_no,
          E: a.compl,
          F: a.suspect,
          G: a.gist,
          H: a.action,
          I: "Nil",
        });
      });
    }
    table3 = table3.concat([""]); //table 3 ended

    const finaldata = [...title, ...table1, ...table2, ...table3];

    //create a workbook
    const wb = xlsx.utils.book_new();
    //create work sheet
    const sheet = xlsx.utils.json_to_sheet(finaldata, {
      skipHeader: true,
    });

    xlsx.utils.book_append_sheet(wb, sheet, "dsr report");
    const wrkboook = workbook2blbo(wb);

    let border = [
      `A4:I${dsrlist.ncrp.length + 4}`,
      `A${dsrlist.ncrp.length + 7}:I${
        dsrlist.ncrp.length + 7 + dsrlist.cctns.length
      }`,
      `A${dsrlist.ncrp.length + 7 + dsrlist.cctns.length + 3}:I${
        dsrlist.ncrp.length +
        7 +
        dsrlist.cctns.length +
        3 +
        dsrlist.direct.length
      }`,
    ];

    const datainfo = [
      {
        titleCell: "A1",
        titleRange: "A1:I1",
      },
      {
        titleCell: "A2",
        titleRange: "A2:I2",
      },
      {
        titleCell: "A3",
        titleRange: "A3:I3",
      },
      {
        titleCell: `A${dsrlist.ncrp.length + 6}`,
        titleRange: `A${dsrlist.ncrp.length + 6}:I${dsrlist.ncrp.length + 6}`,
      },
      {
        titleCell: `A${dsrlist.ncrp.length + 6 + dsrlist.cctns.length + 3}`,
        titleRange: `A${dsrlist.ncrp.length + 6 + dsrlist.cctns.length + 3}:I${
          dsrlist.ncrp.length + 6 + dsrlist.cctns.length + 3
        }`,
      },
    ];
    return addstyle(wrkboook, datainfo, border);
  };

  return (
    <>
      <Tooltip title="DSR download">
        <button type="button" className={className} onClick={exportdata}>
          <ArrowCircleDownOutlinedIcon />
          <span>{props.txt}</span>
        </button>
      </Tooltip>
    </>
  );
}
