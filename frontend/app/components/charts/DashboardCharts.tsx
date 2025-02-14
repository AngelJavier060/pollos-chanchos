'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface ActivityData {
  fecha: string;
  usuarios: number;
  ventas: number;
}

export const DashboardCharts = ({ 
  actividadData,
  distribucionData 
}: { 
  actividadData: ActivityData[];
  distribucionData: ChartData[];
}) => {
  const lineChartRef = useRef<SVGSVGElement | null>(null);
  const pieChartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (actividadData.length > 0) {
      renderLineChart();
    }
    if (distribucionData.length > 0) {
      renderPieChart();
    }
  }, [actividadData, distribucionData]);

  const renderLineChart = () => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Limpiar el SVG existente
    d3.select(lineChartRef.current).selectAll("*").remove();

    const svg = d3.select(lineChartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escalas
    const x = d3.scaleTime()
      .domain(d3.extent(actividadData, d => new Date(d.fecha)) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(actividadData, d => Math.max(d.usuarios, d.ventas)) || 0])
      .nice()
      .range([height, 0]);

    // Líneas
    const lineUsuarios = d3.line<ActivityData>()
      .x(d => x(new Date(d.fecha)))
      .y(d => y(d.usuarios));

    const lineVentas = d3.line<ActivityData>()
      .x(d => x(new Date(d.fecha)))
      .y(d => y(d.ventas));

    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    // Dibujar líneas
    svg.append("path")
      .datum(actividadData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", lineUsuarios);

    svg.append("path")
      .datum(actividadData)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 1.5)
      .attr("d", lineVentas);

    // Leyenda
    const legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(["Usuarios", "Ventas"])
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", (d, i) => i === 0 ? "steelblue" : "orange");

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);
  };

  const renderPieChart = () => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Limpiar el SVG existente
    d3.select(pieChartRef.current).selectAll("*").remove();

    const svg = d3.select(pieChartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<ChartData>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<ChartData>>()
      .innerRadius(0)
      .outerRadius(radius - 1);

    const arcs = svg.selectAll("arc")
      .data(pie(distribucionData))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    // Etiquetas
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .text(d => d.data.label);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <svg ref={lineChartRef}></svg>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Distribución</h3>
        <svg ref={pieChartRef}></svg>
      </div>
    </div>
  );
}; 