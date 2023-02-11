import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";
import { AlertMessage } from "@/components/messager";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn({ id }) {
  console.log(id);
  const router = useRouter();
  const [otp, setOtp] = useState({
    otp: "",
    userid: id,
  });
  const [status, setStatus] = useState({
    msg: "",
    loading: true,
    error: false,
    success: false,
  });

  const change = (props) => {
    let v = props.target;
    setOtp((e) => ({ ...e, [v.name]: v.value }));
  };

  const submit = async (e) => {
    if (otp) {
      try {
        let data = await ApiFetcher({
          url: API_Query.OTPverify(),
          body: otp,
          method: "POST",
        });
        if (data.Status) {
          setStatus((a) => ({
            ...a,
            success: true,
            loading: false,
            error: false,
            msg: data.Message,
          }));
          document.cookie = `token=${data.Data.token}`;
          setTimeout(() => {
            router.push(`/ccps/dashboard`);
          }, 1000);
        } else {
          setStatus((a) => ({
            ...a,
            error: true,
            success: false,
            loading: false,
            msg: data.Message,
          }));
        }
      } catch (error) {
        setStatus((a) => ({
          ...a,
          error: true,
          success: false,
          loading: false,
          msg: error.message,
        }));
      }
    } else {
      setStatus((a) => ({
        ...a,
        error: true,
        success: false,
        msg: "input value empty",
      }));
    }
  };

  return (
    <div className="auth-container">
      {/* <h1>cyber crime police station</h1> */}
      {status.error && <AlertMessage msg={status.msg} title="error" />}
      {status.success && <AlertMessage msg={status.msg} title="success" />}
      <div className="auth">
        <div className="form">
          {/* <h1>OTP verification</h1> */}
          <div className="auth-form">
            <label>OTP</label>
            <input type="text" name="otp" onChange={change} value={otp.otp} />
          </div>
          <input type="button" value="verify" onClick={submit} />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: { id: context.query.id },
  };
}
