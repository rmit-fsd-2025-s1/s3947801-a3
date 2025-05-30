import React, { useState } from "react";

const WEIGHT_LIMITS: Record<string, { min: number; max: number }> = {
  Standard: { min: 0.1, max: 20 },
  Express: { min: 0.1, max: 10 },
  Overnight: { min: 0.1, max: 5 },
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");

    const weight = parseFloat(formData.weight);

    if (isNaN(weight) || weight < min || weight > max) {
      setError(
        `Weight for ${formData.shippingMethod} shipping must be between ${min}kg and ${max}kg.`
      );
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

    console.log("Request body:", requestBody);


    try {
      const response = await fetch("https://shipping-calculator.matthayward.workers.dev/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      alert("Shipping cost: " + data.cost);
    } catch (error) {
      alert("Error calculating shipping!");
    }
  };

  return (
    <main>
      <header>
        <h1>Shipping Calculator</h1>
      </header>

      <h2>Shipping Calculator Form</h2>
      <form className="shipping-form" onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="column">
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

        {}
        {error && (
          <div style={{ color: 'red', margin: '16px 0', fontWeight: 600 }}>{error}</div>
        )}

        <div className="button-row">
          <button type="submit" className="calculate-button">
            Calculate
          </button>
        </div>
      </form>

      <footer>
        <p>© 2025 SC Official Website. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default App;
