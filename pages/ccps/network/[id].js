import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";
import { useEffect, useState } from "react";
import { Loading, AlertMessage } from "@/components/messager";
import networkdata from "@/data/network/networkComponent.json";
import networklist from "@/data/network/networkDataFormate.json";
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

export default function Idnetwork({ id }) {
  const [network, setnetwork] = useState(networkdata);

  const [status, setStatus] = useState({
    msg: "",
    loading: true,
    error: false,
    success: false,
  });

  useEffect(() => {
    (async () => {
      setStatus((a) => ({
        ...a,
        msg: "",
        loading: true,
        error: false,
        success: false,
      }));
      let d = await ApiFetcher({ url: API_Query.column1("network", "id", id) });
      if (d.Status) {
        setnetwork(d.Data[0]);
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
  }, []);
  return (
    <>
      {status.loading ? (
        <Loading />
      ) : (
        <div className="single-view">
          <div className="single-update-info">
            <header>
              In case of any alteration in the existing data you can update the data
              by <Link href={`/ccps/network/update/${network["id"]}`}>click here</Link>
            </header>
          </div>
          <PDFViewer className="pdf-view">
            <Document title={`network-${network["csr_no"].split("/").join("-")}.pdf`}>
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
                {networklist.map((a, i) => {
                  if (a.table_name != "id")
                    return (
                      <View style={styles.section} key={a.name} wrap={false}>
                        <View style={styles.head}>
                          <Text>{a.name}</Text>
                        </View>
                        <View style={styles.body}>
                          <Text>{network[a.table_name]}</Text>
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
  );
}

export async function getServerSideProps(context) {
  return {
    props: { id: context.query.id },
  };
}
