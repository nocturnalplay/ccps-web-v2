import { API_Query } from "@/api/api.url";
import { ApiFetcher } from "@/api/fetcher";
import { AlertMessage } from "@/components/messager";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [sign, setSign] = useState({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState({
    msg: "",
    loading: true,
    error: false,
    success: false,
  });

  const change = (props) => {
    let v = props.target;
    setSign((e) => ({ ...e, [v.name]: v.value }));
  };
  const submit = async (e) => {
    if (sign.username && sign.password) {
      try {
        let data = await ApiFetcher({
          url: API_Query.SignIn(),
          body: sign,
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
          setTimeout(() => {
            router.push(`/auth/otpverify?id=${data.Data}`);
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
        msg: "input value not valid",
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
          <h1>sign in</h1>
          <div className="auth-form">
            <label>username</label>
            <input
              type="text"
              name="username"
              onChange={change}
              value={sign.username}
            />
          </div>
          <div className="auth-form">
            <label>password</label>
            <input
              type="password"
              name="password"
              onChange={change}
              value={sign.password}
            />
          </div>
          <input type="button" value="sign in" onClick={submit} />
        </div>
      </div>
    </div>
  );
}
