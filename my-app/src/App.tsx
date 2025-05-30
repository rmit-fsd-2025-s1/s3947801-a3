function App() {
  return (
    <main>
      <header>
        <h1>Shipping Calculator</h1>
      </header>
      <h2>Shipping Calculator Form</h2>
      <form>
        <label htmlFor="shippingMethod">Shipping Method:</label>
        <select name="shippingMethod">
          <option value="Standard">Standard</option>
          <option value="Express">Express</option>
          <option value="Overnight">Overnight</option>
        </select>

        <label htmlFor="weight">Weight:</label>
        <input name="weight" />

        <label htmlFor="dimensions">Dimensions</label>
        <input name="length" placeholder="Length" />
        <input name="width" placeholder="Width" />
        <input name="height" placeholder="Height" />

        <label htmlFor="destinationZone">Destination Zone:</label>
        <select name="destinationZone">
          <option value="Local">Local</option>
          <option value="Domestic">Domestic</option>
          <option value="International">International</option>
        </select>

        <button type="submit" className="calculate-button">
          Calculate
        </button>
      </form>

      <footer>
        <p>© 2025 TT Official Website. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default App;
