import { HelioPay } from "@heliofi/react";

export default function HelioPoC() {
  return (
    <div>
      <HelioPay
        cluster='mainnet'
        payButtonTitle='Pay'
        paymentRequestId='642d8f596f5ac4fb968e6e64'
        theme={{
          colors: {
            primary: "#F76C1B",
          },
        }}
      />
    </div>
  );
}
