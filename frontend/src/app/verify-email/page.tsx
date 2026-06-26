import { Suspense } from "react";
import VerifyEmailClient from "./verifyEmailClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Verifying your email...</p>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
