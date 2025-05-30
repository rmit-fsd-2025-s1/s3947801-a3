export type ShippingRequest = {
  shippingMethod: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  destinationZone: string;
};

export async function calculateShipping(request: ShippingRequest) {
  const response = await fetch("https://shipping-calculator.matthayward.workers.dev/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error("API error");
  return response.json();
}
