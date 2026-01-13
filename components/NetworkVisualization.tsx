'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useGovernmentStore } from '@/lib/store';
import * as d3 from 'd3';
import { Agent, NetworkNode, NetworkEdge } from '@/lib/types';

export function NetworkVisualization() {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkEdge> | null>(null);
  const { state, selectAgent, selectedAgent } = useGovernmentStore();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Memoize agents list to only update when agents actually change
  const agentIds = useMemo(() =>
    state.agents.map(a => a.id).sort().join(','),
    [state.agents]
  );

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Only recreate visualization when agent list changes, not on every state update
    const isFirstRender = !simulationRef.current;

    if (isFirstRender) {
      svg.selectAll('*').remove();
    }

    // Create nodes and edges from government state
    const nodes: NetworkNode[] = state.agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      x: agent.position?.x || (agent.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % dimensions.width),
      y: agent.position?.y || (agent.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0) * 7 % dimensions.height),
      size: getNodeSize(agent),
      color: getNodeColor(agent.type),
      influence: agent.effectiveness,
      connections: agent.relationships.map(r => r.targetAgentId)
    }));

    const edges: NetworkEdge[] = [];
    state.agents.forEach(agent => {
      agent.relationships.forEach(rel => {
        edges.push({
          source: agent.id,
          target: rel.targetAgentId,
          type: rel.type,
          strength: rel.strength,
          color: getEdgeColor(rel.type),
          animated: rel.type === 'oversees' || rel.type === 'reports_to'
        });
      });
    });

    let container: d3.Selection<SVGGElement, unknown, null, undefined>;
    let simulation: d3.Simulation<NetworkNode, NetworkEdge>;

    if (isFirstRender) {
      // Create gradient definitions for enhanced visuals
      const defs = svg.append('defs');

      // Glow filter
      const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('width', '300%')
        .attr('height', '300%')
        .attr('x', '-100%')
        .attr('y', '-100%');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      // Create container for zoom/pan
      container = svg.append('g');

      // Add zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          container.attr('transform', event.transform);
        });

      svg.call(zoom as any);

      // Set up D3 force simulation
      simulation = d3.forceSimulation<NetworkNode, NetworkEdge>(nodes)
        .force('link', d3.forceLink<NetworkNode, NetworkEdge>(edges).id((d) => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
        .force('collision', d3.forceCollide<NetworkNode>().radius((d) => d.size + 10));

      simulationRef.current = simulation;
    } else {
      // Update existing simulation
      container = svg.select('g');
      simulation = simulationRef.current!;

      // Preserve existing node positions
      const existingNodes = simulation.nodes();
      nodes.forEach(newNode => {
        const existing = existingNodes.find(n => n.id === newNode.id);
        if (existing) {
          newNode.x = existing.x;
          newNode.y = existing.y;
          newNode.vx = existing.vx;
          newNode.vy = existing.vy;
        }
      });

      // Update simulation with new data
      simulation.nodes(nodes);
      simulation.force('link', d3.forceLink<NetworkNode, NetworkEdge>(edges).id((d) => d.id).distance(100));
      simulation.alpha(0.1).restart();
    }

    // Draw edges with data joining
    let linkGroup = container.select('g.links');
    if (linkGroup.empty()) {
      linkGroup = container.append('g').attr('class', 'links');
    }

    const link = linkGroup.selectAll('line')
      .data(edges, (d: any) => `${d.source}-${d.target}`);

    link.exit().remove();

    const linkEnter = link.enter().append('line')
      .attr('stroke', (d: NetworkEdge) => d.color)
      .attr('stroke-width', (d: NetworkEdge) => Math.max(1, d.strength * 3))
      .attr('stroke-opacity', 0.6)
      .attr('class', (d: NetworkEdge) => d.animated ? 'animate-pulse' : '');

    const linkMerged = linkEnter.merge(link as any);

    // Draw nodes with data joining
    let nodeGroup = container.select('g.nodes');
    if (nodeGroup.empty()) {
      nodeGroup = container.append('g').attr('class', 'nodes');
    }

    const node = nodeGroup.selectAll('g.node')
      .data(nodes, (d: any) => d.id);

    node.exit().remove();

    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Node circles (only add to new nodes)
    nodeEnter.append('circle')
      .attr('r', (d: NetworkNode) => d.size)
      .attr('fill', (d: NetworkNode) => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels (only add to new nodes)
    nodeEnter.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: NetworkNode) => d.size + 16)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#374151')
      .style('pointer-events', 'none');

    // Effectiveness indicators (only add to new nodes)
    nodeEnter.append('circle')
      .attr('class', 'effectiveness-indicator')
      .attr('r', 4)
      .attr('cx', (d: NetworkNode) => d.size * 0.7)
      .attr('cy', (d: NetworkNode) => -d.size * 0.7);

    // Merge existing and new nodes
    const nodeMerged = nodeEnter.merge(node as any);

    // Update all nodes (existing and new)
    nodeMerged.select('circle:not(.effectiveness-indicator)')
      .attr('filter', (d: NetworkNode) => d.id === selectedAgent?.id ? 'url(#glow)' : 'none')
      .style('opacity', (d: NetworkNode) => 0.8 + d.influence * 0.2);

    nodeMerged.select('text')
      .text((d: NetworkNode) => d.name.length > 20 ? d.name.substring(0, 17) + '...' : d.name);

    nodeMerged.select('.effectiveness-indicator')
      .attr('fill', (d: NetworkNode) => {
        const effectiveness = state.agents.find(a => a.id === d.id)?.effectiveness || 0;
        return effectiveness > 0.7 ? '#10b981' : effectiveness > 0.4 ? '#f59e0b' : '#ef4444';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Node interaction
    nodeMerged.on('click', (event, d: NetworkNode) => {
      const agent = state.agents.find(a => a.id === d.id);
      if (agent) {
        selectAgent(agent);

        // Update glow effect
        nodeMerged.select('circle:not(.effectiveness-indicator)')
          .attr('filter', (nodeData: NetworkNode) =>
            nodeData.id === d.id ? 'url(#glow)' : 'none'
          );
      }
    });

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    nodeMerged.on('mouseover', (event, d: NetworkNode) => {
      const agent = state.agents.find(a => a.id === d.id);
      if (agent) {
        tooltip.style('visibility', 'visible')
          .html(`
            <div><strong>${agent.name}</strong></div>
            <div>Type: ${agent.type}</div>
            <div>Effectiveness: ${Math.round(agent.effectiveness * 100)}%</div>
            <div>Age: ${agent.age} days</div>
            <div>Staff: ${agent.staffCount?.toLocaleString() || 'N/A'}</div>
          `);
      }
    })
    .on('mousemove', (event) => {
      tooltip.style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', () => {
      tooltip.style('visibility', 'hidden');
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      linkMerged
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeMerged.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };

  }, [agentIds, dimensions, selectedAgent, selectAgent]);

  function getNodeSize(agent: Agent): number {
    const baseSizes = {
      executive: 25,
      legislative: 20,
      judicial: 20,
      department: 18,
      agency: 15,
      committee: 12,
      taskforce: 10,
      oversight: 12,
      emergency: 16,
      coalition: 14
    };

    const baseSize = baseSizes[agent.type] || 10;
    const effectivenessMultiplier = 0.5 + agent.effectiveness * 0.5;
    return baseSize * effectivenessMultiplier;
  }

  function getNodeColor(type: string): string {
    const colors = {
      executive: '#3b82f6',    // Blue
      legislative: '#10b981',  // Green
      judicial: '#8b5cf6',     // Purple
      department: '#f59e0b',   // Amber
      agency: '#ef4444',       // Red
      committee: '#06b6d4',    // Cyan
      taskforce: '#84cc16',    // Lime
      oversight: '#f97316',    // Orange
      emergency: '#dc2626',    // Red
      coalition: '#6366f1'     // Indigo
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  }

  function getEdgeColor(type: string): string {
    const colors = {
      reports_to: '#3b82f6',
      oversees: '#10b981',
      collaborates: '#f59e0b',
      coordinates: '#06b6d4',
      conflicts: '#dc2626',
      coalition: '#8b5cf6',
      appointment: '#f97316',
      confirmation: '#84cc16'
    };
    return colors[type as keyof typeof colors] || '#9ca3af';
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 relative">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Agent Types</h4>
        <div className="space-y-2">
          {[
            { type: 'executive', label: 'Executive', color: '#3b82f6' },
            { type: 'legislative', label: 'Legislative', color: '#10b981' },
            { type: 'judicial', label: 'Judicial', color: '#8b5cf6' },
            { type: 'department', label: 'Department', color: '#f59e0b' },
            { type: 'agency', label: 'Agency', color: '#ef4444' },
            { type: 'committee', label: 'Committee', color: '#06b6d4' }
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
        <h4 className="font-semibold text-gray-900 mb-2">Controls</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Click nodes to view details</p>
          <p>• Drag nodes to reposition</p>
          <p>• Scroll to zoom in/out</p>
          <p>• Drag background to pan</p>
        </div>
      </div>
    </div>
  );
}
