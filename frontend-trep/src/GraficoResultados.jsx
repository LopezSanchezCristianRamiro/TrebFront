import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './index.css';

const GraficoResultados = () => {
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const total = await fetch('https://localhost:7244/Trep/total-votos').then(r => r.json());
        const validos = await fetch('https://localhost:7244/Trep/votos-validos').then(r => r.json());
        const nulos = await fetch('https://localhost:7244/Trep/votos-nulos').then(r => r.json());
        const participacion = await fetch('https://localhost:7244/Trep/participacion-electoral').then(r => r.json());

        document.getElementById('totalVotos').textContent = total.totalVotos ?? total.TotalVotos;
        document.getElementById('votosValidos').textContent = validos.votosValidos ?? validos.VotosValidos;
        document.getElementById('votosNulos').textContent = nulos.votosNulos ?? nulos.VotosNulos;
        document.getElementById('participacion').textContent = (participacion.participacion ?? participacion.Participacion) + '%';

        const dep = await fetch('https://localhost:7244/Trep/votos-por-departamento').then(r => r.json());
        const depLabels = dep.map(d => d.departamento ?? d.Departamento);
        const depData = dep.map(d => d.votos ?? d.Votos);
        new Chart(document.getElementById('votosPorDepartamento'), {
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

        const porc = await fetch('https://localhost:7244/Trep/porcentaje-votos-partido').then(r => r.json());
        new Chart(document.getElementById('porcentajePartidos'), {
          type: 'doughnut',
          data: {
            labels: porc.map(p => p.partido ?? p.Partido),
            datasets: [{
              data: porc.map(p => p.porcentaje ?? p.Porcentaje),
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

        const totalP = await fetch('https://localhost:7244/Trep/total-votos-partido').then(r => r.json());
        new Chart(document.getElementById('votosTotalesPartidos'), {
          type: 'pie',
          data: {
            labels: totalP.map(p => p.partido ?? p.Partido),
            datasets: [{
              data: totalP.map(p => p.votos ?? p.Votos),
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
      <h1 className="text-4xl font-bold text-center mb-10">DASHBOARD ELECTORAL BOLIVIA</h1>

      <div className="grid grid-cols-4 gap-6 mb-10 text-white">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Total de Votos</p>
          <p className="text-3xl font-bold mt-2" id="totalVotos">-</p>
          <p className="text-sm text-gray-400 mt-1">Comparado con elecciones anteriores</p>
          <span className="bg-green-600 text-sm px-2 py-1 rounded mt-2 inline-block">+12.3%</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Participación</p>
          <p className="text-3xl font-bold mt-2" id="participacion">-</p>
          <p className="text-sm text-gray-400 mt-1">Del padrón electoral</p>
          <span className="bg-green-600 text-sm px-2 py-1 rounded mt-2 inline-block">+3.8%</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Votos Válidos</p>
          <p className="text-3xl font-bold mt-2" id="votosValidos">-</p>
          <p className="text-sm text-gray-400 mt-1">Del total de votos emitidos</p>
          <span className="bg-green-600 text-sm px-2 py-1 rounded mt-2 inline-block">+1.5%</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Votos Nulos</p>
          <p className="text-3xl font-bold mt-2" id="votosNulos">-</p>
          <p className="text-sm text-gray-400 mt-1">Del total de votos emitidos</p>
          <span className="bg-red-600 text-sm px-2 py-1 rounded mt-2 inline-block">-0.7%</span>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Resultados por Departamento</h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <canvas id="votosPorDepartamento"></canvas>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Porcentaje de Votos por Partido</h2>
          <div className="flex justify-center">
            <canvas id="porcentajePartidos" className="w-64 h-64"></canvas>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Total de Votos por Partido</h2>
          <div className="flex justify-center">
            <canvas id="votosTotalesPartidos" className="w-64 h-64"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraficoResultados;
