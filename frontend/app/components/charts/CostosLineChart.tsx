'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CostoMensual {
  fecha: Date;
  tipo_animal: string;
  costo: number;
}

interface CostosLineChartProps {
  data: CostoMensual[];
}

export const CostosLineChart = ({ data }: CostosLineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    // Limpiar el SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensiones
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Crear el SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.fecha) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.costo) || 0])
      .range([height, 0]);

    // Líneas
    const line = d3.line<CostoMensual>()
      .x(d => xScale(d.fecha))
      .y(d => yScale(d.costo));

    // Separar datos por tipo
    const pollos = data.filter(d => d.tipo_animal === 'pollos');
    const chanchos = data.filter(d => d.tipo_animal === 'chanchos');

    // Dibujar líneas
    svg.append('path')
      .datum(pollos)
      .attr('fill', 'none')
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg.append('path')
      .datum(chanchos)
      .attr('fill', 'none')
      .attr('stroke', '#F44336')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Ejes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g')
      .call(yAxis);

    // Leyenda
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(['Pollos', 'Chanchos'])
      .enter().append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', d => d === 'Pollos' ? '#4CAF50' : '#F44336');

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d);

  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
}; 