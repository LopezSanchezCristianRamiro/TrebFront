import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './index.css';

const DashboardRapido = () => {
  useEffect(() => {
    const baseUrl = 'https://localhost:7244/Trep';

    const cargarDatos = async () => {
      try {
        const total = await fetch(`${baseUrl}/total-votos-rapido`).then(r => r.json());
        const validos = await fetch(`${baseUrl}/votos-validos-rapido`).then(r => r.json());
        const nulos = await fetch(`${baseUrl}/votos-nulos-rapido`).then(r => r.json());
        const participacion = await fetch(`${baseUrl}/participacion-electoral-rapido`).then(r => r.json());

        document.getElementById('totalVotosRapido').textContent = total.totalVotos;
        document.getElementById('votosValidosRapido').textContent = validos.votosValidos;
        document.getElementById('votosNulosRapido').textContent = nulos.votosNulos;
        document.getElementById('participacionRapido').textContent = participacion.participacion + '%';

        const dep = await fetch(`${baseUrl}/votos-por-departamento-rapido`).then(r => r.json());
        const depLabels = dep.map(d => d.departamento ?? d.Departamento);
        const depData = dep.map(d => d.votos ?? d.Votos);
        new Chart(document.getElementById('votosPorDepartamentoRapido'), {
          type: 'bar',
          data: {
            labels: depLabels,
            datasets: [{
              label: 'Votos por Departamento',
              data: depData,
              backgroundColor: 'rgb(239 68 68)',
            }]
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
          }
        });

        const porc = await fetch(`${baseUrl}/porcentaje-votos-partido-rapido`).then(r => r.json());
        new Chart(document.getElementById('porcentajePartidosRapido'), {
          type: 'doughnut',
          data: {
            labels: porc.map(p => p.partido ?? p.Partido),
            datasets: [{
              data: porc.map(p => p.porcentaje ?? p.Porcentaje),
              backgroundColor: ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#a855f7']
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

        const totalP = await fetch(`${baseUrl}/total-votos-partido-rapido`).then(r => r.json());
        new Chart(document.getElementById('votosTotalesPartidosRapido'), {
          type: 'pie',
          data: {
            labels: totalP.map(p => p.partido ?? p.Partido),
            datasets: [{
              data: totalP.map(p => p.votos ?? p.Votos),
              backgroundColor: ['#fb7185', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              datalabels: {
                color: '#fff',
                formatter: value => (value ?? 0).toLocaleString(),
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
      <h1 className="text-4xl font-bold text-center mb-10">CONTEO RÁPIDO - BOLIVIA</h1>

      <div className="grid grid-cols-4 gap-6 mb-10 text-white">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Total de Votos</p>
          <p className="text-3xl font-bold mt-2" id="totalVotosRapido">-</p>
          <p className="text-sm text-gray-400 mt-1">Comparado con elecciones anteriores</p>
          <span className="bg-green-600 text-sm px-2 py-1 rounded mt-2 inline-block">+10.2%</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Participación</p>
          <p className="text-3xl font-bold mt-2" id="participacionRapido">-</p>
          <p className="text-sm text-gray-400 mt-1">Del padrón electoral</p>
          <span className="bg-green-600 text-sm px-2 py-1 rounded mt-2 inline-block">+4.1%</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Votos Válidos</p>
          <p className="text-3xl font-bold mt-2" id="votosValidosRapido">-</p>
          <p className="text-sm text-gray-400 mt-1">Del total de votos emitidos</p>
          <span className="bg-green-600 text-sm px-2 py-1 rounded mt-2 inline-block">+1.2%</span>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400">Votos Nulos</p>
          <p className="text-3xl font-bold mt-2" id="votosNulosRapido">-</p>
          <p className="text-sm text-gray-400 mt-1">Del total de votos emitidos</p>
          <span className="bg-red-600 text-sm px-2 py-1 rounded mt-2 inline-block">-0.4%</span>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Resultados por Departamento</h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <canvas id="votosPorDepartamentoRapido"></canvas>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Porcentaje de Votos por Partido</h2>
          <div className="flex justify-center">
            <canvas id="porcentajePartidosRapido" className="w-64 h-64"></canvas>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Total de Votos por Partido</h2>
          <div className="flex justify-center">
            <canvas id="votosTotalesPartidosRapido" className="w-64 h-64"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRapido;
