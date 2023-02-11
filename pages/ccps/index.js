import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserId() {
  const router = useRouter();
  useEffect(() => {
    router.push("/ccps/dashboard");
  }, []);
  return <>user Auth loading....</>;
}
