import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './index.css';

const DashboardOficial = () => {
  useEffect(() => {
    const baseUrl = 'https://localhost:7244/Trep';

    const cargarDatos = async () => {
      try {
        const total = await fetch(`${baseUrl}/total-votos-oficial`).then(r => r.json());
        const validos = await fetch(`${baseUrl}/votos-validos-oficial`).then(r => r.json());
        const nulos = await fetch(`${baseUrl}/votos-nulos-oficial`).then(r => r.json());
        const participacion = await fetch(`${baseUrl}/participacion-electoral-oficial`).then(r => r.json());

        document.getElementById('totalVotosOficial').textContent = total.totalVotos;
        document.getElementById('votosValidosOficial').textContent = validos.votosValidos;
        document.getElementById('votosNulosOficial').textContent = nulos.votosNulos;
        document.getElementById('participacionOficial').textContent = participacion.participacion + '%';
        
        // Gráfico: Votos por Departamento
        const dep = await fetch(`${baseUrl}/votos-por-departamento-oficial`).then(r => r.json());
        const depLabels = dep.map(d => d.Departamento ?? d.departamento);
        const depData = dep.map(d => d.Votos ?? d.votos);
        const canvasDepto = document.getElementById('votosPorDepartamentoOficial');
        if (!canvasDepto) return;
        if (Chart.getChart(canvasDepto)) Chart.getChart(canvasDepto).destroy();
        new Chart(canvasDepto, {
          type: 'bar',
          data: {
            labels: depLabels,
            datasets: [{
              label: 'Votos por Departamento',
              data: depData,
              backgroundColor: 'rgb(34 197 94)',
            }]
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
          }
        });

        // Gráfico: Porcentaje por Partido
        const porc = await fetch(`${baseUrl}/porcentaje-votos-partido-oficial`).then(r => r.json());
        const canvasPorc = document.getElementById('porcentajePartidosOficial');
        if (!canvasPorc) return;
        if (Chart.getChart(canvasPorc)) Chart.getChart(canvasPorc).destroy();
        new Chart(canvasPorc, {
          type: 'doughnut',
          data: {
            labels: porc.map(p => p.partido),
            datasets: [{
                data: porc.map(p => p.porcentaje),
              backgroundColor: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              datalabels: {
                color: '#fff',
                formatter: value => value + '%',
                font: { weight: 'bold', size: 14 }
              }
            }
          },
          plugins: [ChartDataLabels]
        });

        // Gráfico: Total por Partido
        const totalP = await fetch(`${baseUrl}/total-votos-partido-oficial`).then(r => r.json());
        const canvasTotalP = document.getElementById('votosTotalesPartidosOficial');
        if (!canvasTotalP) return;
        if (Chart.getChart(canvasTotalP)) Chart.getChart(canvasTotalP).destroy();
        new Chart(canvasTotalP, {
          type: 'pie',
          data: {
            labels: totalP.map(p => p.partido),
            datasets: [{
              data: totalP.map(p => p.votos ?? 0),
              backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              datalabels: {
                color: '#fff',
                formatter: value => value.toLocaleString(),
                font: { weight: 'bold', size: 14 }
              }
            }
          },
          plugins: [ChartDataLabels]
        });

      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-10">CONTEO OFICIAL - BOLIVIA</h1>

      <div className="grid grid-cols-4 gap-6 mb-10 text-white">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Total de Votos</p>
          <p className="text-3xl font-bold mt-2" id="totalVotosOficial">0</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Participación</p>
          <p className="text-3xl font-bold mt-2" id="participacionOficial">0%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Votos Válidos</p>
          <p className="text-3xl font-bold mt-2" id="votosValidosOficial">0</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Votos Nulos</p>
          <p className="text-3xl font-bold mt-2" id="votosNulosOficial">0</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Resultados por Departamento</h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <canvas id="votosPorDepartamentoOficial"></canvas>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Porcentaje de Votos por Partido</h2>
          <div className="flex justify-center">
            <canvas id="porcentajePartidosOficial" className="w-64 h-64"></canvas>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Total de Votos por Partido</h2>
          <div className="flex justify-center">
            <canvas id="votosTotalesPartidosOficial" className="w-64 h-64"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOficial;
