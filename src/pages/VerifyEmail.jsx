import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/endpoints";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractError } from "@/lib/api";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Missing verification token.");
      return;
    }
    authApi
      .verifyEmail(token)
      .then(() => {
        setState("success");
        setMessage("Your email is verified. You can now sign in.");
      })
      .catch((e) => {
        setState("error");
        setMessage(extractError(e));
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-sm w-full text-center space-y-4 animate-fade-in">
        {state === "loading" && <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />}
        {state === "success" && <CheckCircle2 className="h-12 w-12 mx-auto text-success" />}
        {state === "error" && <XCircle className="h-12 w-12 mx-auto text-destructive" />}
        <h1 className="text-2xl font-bold">
          {state === "loading" ? "Verifying email..." : state === "success" ? "Email verified" : "Verification failed"}
        </h1>
        <p className="text-muted-foreground text-sm">{message}</p>
        <Button asChild className="rounded-xl">
          <Link to="/login">Go to sign in</Link>
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
