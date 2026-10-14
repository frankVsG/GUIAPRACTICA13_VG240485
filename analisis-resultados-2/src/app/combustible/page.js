"use client";

import { useState } from "react";

const TIPOS_COMBUSTIBLE = [
  { id: "especial", nombre: "Especial", precio: 4.25 },
  { id: "regular", nombre: "Regular", precio: 4.05 },
  { id: "diesel", nombre: "Diésel", precio: 3.96 },
];

export default function CombustiblePage() {
  const [tipo, setTipo] = useState("especial");
  const [galones, setGalones] = useState("");
  const [error, setError] = useState("");

  //buscar el precio del combustible seleccionado
  const combustibleSeleccionado = TIPOS_COMBUSTIBLE.find((c) => c.id === tipo);
  const precioUnitario = combustibleSeleccionado ? combustibleSeleccionado.precio : 0;

  //cálculo automático del total a pagar
  const cantidadGalones = parseFloat(galones);
  const totalPagar = !isNaN(cantidadGalones) && cantidadGalones > 0 
    ? (cantidadGalones * precioUnitario).toFixed(2) 
    : "0.00";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(cantidadGalones) || cantidadGalones < 0.05 || cantidadGalones > 150) {
      setError("Por favor ingrese una cantidad válida entre 0.05 y 150 galones.");
      return;
    }
    setError("");
  };

  return (
    <main className="container py-5" style={{ maxWidth: 720 }}>
      <h2>Cálculo de Venta de Combustible</h2>
      <form onSubmit={handleSubmit} noValidate>
        
        {/*Selección de tipo de combustible*/}
        <div className="mb-3">
          <label htmlFor="tipo" className="form-label">Tipo de Combustible</label>
          <select
            className="form-select"
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {TIPOS_COMBUSTIBLE.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} (${c.precio.toFixed(2)} por galón)
              </option>
            ))}
          </select>
        </div>

        {/*Campo numérico de galones*/}
        <div className="mb-3">
          <label htmlFor="galones" className="form-label">Cantidad de Galones</label>
          <input
            type="number"
            className={`form-control ${error ? "is-invalid" : ""}`}
            id="galones"
            min="0.05"
            max="150"
            step="0.05"
            value={galones}
            onChange={(e) => {
              setGalones(e.target.value);
              setError("");
            }}
          />
          {error && <div className="invalid-feedback">{error}</div>}
          <div className="form-text">Mínimo 0.05 y máximo 150 galones (incrementos de 0.05).</div>
        </div>

        {/*Campo de solo lectura para el monto a pagar*/}
        <div className="mb-3">
          <label htmlFor="total" className="form-label">Monto a Pagar</label>
          <input
            type="text"
            className="form-control fw-bold text-success bg-light"
            id="total"
            value={`$${totalPagar}`}
            readOnly
          />
        </div>

      </form>
    </main>
  );
}