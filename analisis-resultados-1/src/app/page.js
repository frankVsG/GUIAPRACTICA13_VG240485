"use client";

import { useState } from "react";
import TablaDatos from "@/components/TablaDatos";

const columnas = [
  { campo: "nombre", titulo: "Nombre" },
  { campo: "salarioBase", titulo: "Salario Base" },
  { campo: "isss", titulo: "ISSS" },
  { campo: "afp", titulo: "AFP" },
  { campo: "renta", titulo: "Renta" },
  { campo: "sueldoNeto", titulo: "Sueldo Neto" },
];

function calcularDeducciones(salario) {
  //ISSS: 3% del salario, con salario máximo cotizable de $1,000.00 (máximo $30.00)
  const baseIsss = Math.min(salario, 1000);
  const isss = baseIsss * 0.03;

  //AFP: 7.25% del salario
  const afp = salario * 0.0725;

  //Renta: Se calcula sobre el salario menos ISSS y AFP
  const taxable = salario - isss - afp;
  let renta = 0;

  if (taxable >= 550.01 && taxable <= 895.24) {
    renta = (taxable - 550.00) * 0.10 + 17.67;
  } else if (taxable >= 895.25 && taxable <= 2038.10) {
    renta = (taxable - 895.24) * 0.20 + 60.00;
  } else if (taxable >= 2038.11) {
    renta = (taxable - 2038.10) * 0.30 + 288.57;
  }

  const sueldoNeto = salario - isss - afp - renta;

  return {
    isss: isss.toFixed(2),
    afp: afp.toFixed(2),
    renta: renta.toFixed(2),
    sueldoNeto: sueldoNeto.toFixed(2),
  };
}

export default function Home() {
  const [formData, setFormData] = useState({ nombre: "", salarioBase: "" });
  const [errores, setErrores] = useState({});
  const [registros, setRegistros] = useState([]);
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setEnviado(false);
  };

  const validar = () => {
    const temp = {};
    if (!formData.nombre.trim()) {
      temp.nombre = "El nombre es obligatorio.";
    }
    const sueldoNum = parseFloat(formData.salarioBase);
    if (!formData.salarioBase || isNaN(sueldoNum) || sueldoNum <= 0) {
      temp.salarioBase = "Ingrese un sueldo válido mayor que cero.";
    }
    setErrores(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validar()) {
      const salario = parseFloat(formData.salarioBase);
      const deducciones = calcularDeducciones(salario);

      const nuevoRegistro = {
        id: crypto.randomUUID(),
        nombre: formData.nombre,
        salarioBase: `$${salario.toFixed(2)}`,
        isss: `$${deducciones.isss}`,
        afp: `$${deducciones.afp}`,
        renta: `$${deducciones.renta}`,
        sueldoNeto: `$${deducciones.sueldoNeto}`,
      };

      setRegistros([...registros, nuevoRegistro]);
      setFormData({ nombre: "", salarioBase: "" });
      setEnviado(true);
    }
  };

  return (
    <main className="container py-5" style={{ maxWidth: 850 }}>
      <h2>Cálculo de Sueldo Neto - Empleados</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre del empleado</label>
          <input
            type="text"
            className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          {errores.nombre && (
            <div className="invalid-feedback">{errores.nombre}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="salarioBase" className="form-label">Salario Base ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className={`form-control ${errores.salarioBase ? "is-invalid" : ""}`}
            id="salarioBase"
            name="salarioBase"
            value={formData.salarioBase}
            onChange={handleChange}
          />
          {errores.salarioBase && (
            <div className="invalid-feedback">{errores.salarioBase}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">Registrar y Calcular</button>
      </form>

      {enviado && (
        <div className="alert alert-success mt-3">
          Empleado calculado y registrado correctamente.
        </div>
      )}

      <TablaDatos titulo="Empleados Registrados" columnas={columnas} filas={registros} />
    </main>
  );
}