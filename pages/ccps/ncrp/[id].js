import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";
import { useEffect, useState } from "react";
import { Loading, AlertMessage } from "@/components/messager";
import ncrpdata from "@/data/ncrp/ncrpComponent.json";
import ncrplist from "@/data/ncrp/ncrpDataFormate.json";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Link from "next/link";
import { useRouter } from "next/router";
import { DateFormate } from "@/components/Forms";
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    fontSize: "12",
    marginBottom: 30,
  },
  section: {
    margin: 4,
    marginLeft: 40,
    marginRight: 40,
    padding: 3,
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  head: {},
  body: {
    textAlign: "justify",
    width: "350",
  },
  heading: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 20,
    textTransform: "capitalize",
    margin: 20,
  },
});

export default function Idncrp({ id }) {
  const [ncrp, setncrp] = useState(ncrpdata);
  const router = useRouter();

  const [status, setStatus] = useState({
    msg: "",
    loading: true,
    error: false,
    success: false,
  });

  const [showDate, setShowDate] = useState({
    name: "",
    status: false,
  });

  useEffect(() => {
    try {
      (async () => {
        setStatus((a) => ({
          ...a,
          msg: "",
          loading: true,
          error: false,
          success: false,
        }));
        let d = await ApiFetcher({ url: API_Query.column1("ncrp", "id", id) });
        if (d.Status) {
          setncrp(d.Data[0]);
          setStatus((a) => ({
            ...a,
            msg: "",
            loading: false,
            error: false,
            success: false,
          }));
        } else {
          setStatus((a) => ({
            ...a,
            msg: d.Message,
            loading: false,
            error: true,
            success: false,
          }));
        }
      })();
    } catch (error) {
      setStatus((a) => ({
        ...a,
        msg: error.message,
        loading: false,
        error: true,
        success: false,
      }));
    }
  }, [showDate]);

  const TransferTo = async (data) => {
    try {
      setStatus((a) => ({
        ...a,
        msg: "",
        loading: true,
        error: false,
        success: false,
      }));

      ncrp["fir_date"] = DateFormate(ncrp["fir_date"]);
      ncrp["csr_date"] = DateFormate(ncrp["csr_date"]);

      let co = await ApiFetcher({
        url: API_Query.NCRPTransfer(data),
        method: "POST",
        body: ncrp,
      });
      if (co.Status) {
        setShowDate((a) => ({ ...a, name: "", status: false }));
        setStatus((a) => ({
          ...a,
          msg: "",
          loading: true,
          error: false,
          success: false,
        }));
      } else {
        setStatus((a) => ({
          ...a,
          msg: co.Message,
          loading: false,
          error: true,
          success: false,
        }));
      }
    } catch (error) {
      setStatus((a) => ({
        ...a,
        msg: error.message,
        loading: false,
        error: true,
        success: false,
      }));
    }
  };

  const setDate = (e) => {
    setShowDate((a) => ({ ...a, name: e, status: true }));
  };

  return (
    <>
      {status.error && <AlertMessage msg={status.msg} title={"error"} />}
      {status.loading ? (
        <Loading />
      ) : (
        <>
          {showDate.status ? (
            <div className="transfer-tab">
              <h3>Ack Number : {ncrp.ack_no}</h3>
              <p>Transfer the Ack number to {showDate.name.toUpperCase()} </p>
              <span>
                Enter {showDate.name} Register Date{" "}
                <input
                  type="date"
                  name="date"
                  value={ncrp[`${showDate.name}_date`]}
                  onChange={(e) =>
                    setncrp((a) => ({
                      ...a,
                      [`${showDate.name}_date`]: e.target.value,
                    }))
                  }
                />
              </span>
              <button onClick={() => TransferTo(showDate.name)}>submit</button>
            </div>
          ) : (
            <div className="single-view">
              <div className="single-update-info">
                <header>
                  In case of any alteration in the existing data you can update
                  the data by{" "}
                  <Link href={`/ccps/ncrp/update/${ncrp["id"]}`}>
                    click here
                  </Link>
                </header>
              </div>
              {ncrp.fir_no ? (
                <div className="petition-status-exist">
                  Ack number {ncrp.ack_no} Transfered to FIR {ncrp.fir_no}
                </div>
              ) : ncrp.csr_no ? (
                <div className="petition-status-exist">
                  Ack number {ncrp.ack_no} Transfered to CSR {ncrp.csr_no}
                </div>
              ) : (
                <div className="petition-status">
                  <>
                    <button
                      onClick={() => {
                        setDate("fir");
                      }}
                    >
                      transfer to FIR
                    </button>
                    <button
                      onClick={() => {
                        setDate("csr");
                      }}
                    >
                      transfer to CSR
                    </button>
                  </>
                </div>
              )}
              <PDFViewer className="pdf-view">
                <Document
                  title={`ncrp-${ncrp["ack_no"].split("/").join("-")}.pdf`}
                >
                  <Page size="A4" style={styles.page}>
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <Image
                        src={"/logo.png"}
                        style={{ width: 50, height: 50, marginTop: 10 }}
                      />
                      <Text style={styles.heading}>
                        cyber crime police station, salem city
                      </Text>
                    </View>
                    {ncrplist.map((a, i) => {
                      if (a.table_name != "id")
                        return (
                          <View
                            style={styles.section}
                            key={a.name}
                            wrap={false}
                          >
                            <View style={styles.head}>
                              <Text>{a.name}</Text>
                            </View>
                            <View style={styles.body}>
                              <Text>{ncrp[a.table_name]}</Text>
                            </View>
                          </View>
                        );
                    })}
                  </Page>
                </Document>
              </PDFViewer>
            </div>
          )}
        </>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: { id: context.query.id },
  };
}
