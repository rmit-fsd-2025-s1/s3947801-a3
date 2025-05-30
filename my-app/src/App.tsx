import React, { useState } from "react";

const WEIGHT_LIMITS: Record<string, { min: number; max: number }> = {
  Standard: { min: 0.1, max: 20 },
  Express: { min: 0.1, max: 10 },
  Overnight: { min: 0.1, max: 5 },
};

type ResultType = {
  shippingCost: number;
  estimatedDays: number;
  breakdown: { [key: string]: string | number };
};

function App() {
  const [formData, setFormData] = useState({
    shippingMethod: "Standard",
    weight: "",
    length: "",
    width: "",
    height: "",
    destinationZone: "Local",
  });

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultType | null>(null);

  const { min, max } = WEIGHT_LIMITS[formData.shippingMethod];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "shippingMethod") {
      setFormData((prev) => ({
        ...prev,
        weight: "",
        [name]: value,
      }));
    }
    setError(null);
    setResult(null); // clear results if form changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weight = parseFloat(formData.weight);

    if (isNaN(weight) || weight < min || weight > max) {
      setError(
        `Weight for ${formData.shippingMethod} shipping must be between ${min}kg and ${max}kg.`
      );
      setResult(null);
      return;
    }

    const requestBody = {
      shippingMethod: formData.shippingMethod,
      weight: weight,
      dimensions: {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
      },
      destinationZone: formData.destinationZone,
    };

    try {
      const response = await fetch("https://shipping-calculator.matthayward.workers.dev/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setResult(data); 
    } catch (error) {
      setError("Error calculating shipping!");
      setResult(null);
    }
  };

  return (
    <main>
      <header>
        <h1>Shipping Calculator</h1>
      </header>

      <h2>Shipping Calculator Form</h2>
      <form className="shipping-form" onSubmit={handleSubmit}>
        <div className="form-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div className="column" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label htmlFor="shippingMethod">Shipping Method:</label>
            <select
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
            >
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Overnight">Overnight</option>
            </select>

            <label htmlFor="weight">Weight (kg):</label>
            <input
              name="weight"
              type="number"
              min={min}
              max={max}
              step="0.01"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <span style={{ fontSize: '0.8em', color: '#666' }}>
              ({min} - {max} kg)
            </span>
          </div>

          <div className="column">
            <label htmlFor="dimensions">Dimensions (cm):</label>
            <input
              name="length"
              placeholder="Length"
              type="number"
              value={formData.length}
              onChange={handleChange}
              required
            />
            <input
              name="width"
              placeholder="Width"
              type="number"
              value={formData.width}
              onChange={handleChange}
              required
            />
            <input
              name="height"
              placeholder="Height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              required
            />

            <label htmlFor="destinationZone">Destination Zone:</label>
            <select
              name="destinationZone"
              value={formData.destinationZone}
              onChange={handleChange}
            >
              <option value="Local">Local</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{ color: 'red', margin: '16px 0', fontWeight: 600 }}>{error}</div>
        )}

        <div className="button-row">
          <button type="submit" className="calculate-button">
            Calculate
          </button>
        </div>
      </form>

      {/* Show Results */}
      {result && (
        <div className="shipping-result" style={{marginTop: 32, maxWidth: 500, marginLeft: "auto", marginRight: "auto", border: "1px solid #eee", borderRadius: 8, boxShadow: "0 2px 8px #0001", padding: 24, background: "#fafbfc"}}>
          <h3 style={{marginTop: 0}}>Shipping Results</h3>
          <p>
            <strong>Shipping Cost:</strong> ${result.shippingCost.toFixed(2)} <br />
            <strong>Estimated Delivery:</strong> {result.estimatedDays} days
          </p>
          <h4>Breakdown:</h4>
          <table style={{borderCollapse: 'collapse', width: '100%'}}>
            <tbody>
              {Object.entries(result.breakdown).map(([key, value]) => (
                <tr key={key}>
                  <td style={{border: '1px solid #ccc', padding: 4, fontWeight: 500}}>
                    {key}
                  </td>
                  <td style={{border: '1px solid #ccc', padding: 4}}>
                    {typeof value === 'number' ? value.toString() : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer style={{marginTop: 64, textAlign: "center"}}>
        <p>© 2025 SC Official Website. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default App;