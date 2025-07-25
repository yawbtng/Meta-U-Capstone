import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3, Users, Building, MapPin, Briefcase, Heart, ZoomIn, ZoomOut, RotateCcw, Mail, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import * as d3 from "d3";
import { UserAuth } from "../../context/AuthContext";
import { industries } from "../../lib/industries";
import ViewContactCard from "../ViewContactCard";

const GROUPS = {
  industry: industries.map(i => i.value),
  relationship_type: ["professional", "personal", "social"],
  location: [],
  role: [],
};
const RELATIONSHIP_LABELS = {
  professional: "Professional",
  personal: "Personal",
  social: "Social"
};

const getNodeColor = (node, groupBy) => {
  if (groupBy === "relationship_type") {
    const colors = {
      professional: "#2563eb",
      personal: "#059669",
      social: "#d97706"
    };
    return colors[node.relationship_type] || "#6b7280";
  }
  if (groupBy === "industry") {
    const idx = industries.findIndex(i => i.value === node.industry);
    const palette = ["#2563eb", "#059669", "#d97706", "#db2777", "#7c3aed", "#16a34a", "#4b5563", "#dc2626", "#0891b2", "#f59e42", "#f472b6", "#a3e635", "#fbbf24", "#f87171", "#818cf8", "#facc15", "#f472b6", "#a3e635", "#fbbf24", "#f87171", "#818cf8"]; // repeat if needed
    return idx >= 0 ? palette[idx % palette.length] : "#6b7280";
  }
  return node.isMainUser ? "#2563eb" : "#6b7280";
};

const NetworkNodeCloud = ({ data, groupBy, onNodeHover, onNodeClick }) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
    if (!data?.nodes?.length || !svgRef.current) return;
    
    // Small delay to ensure container has resized, especially for modal
    const timer = setTimeout(() => {
      // Get actual container dimensions
      const container = svgRef.current.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const nodeRadius = 30;
      
      const nodes = data.nodes.map(n => ({ ...n }));
      
      // Grouping logic
      let groupValues = [];
      if (groupBy !== "none") {
        groupValues = [...new Set(nodes.map(n => n[groupBy] || "Unknown"))];
      }
      
      // D3 simulation
      const sim = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-150))
        .force("collision", d3.forceCollide().radius(35))
        .force("center", d3.forceCenter(width / 2, height / 2));
        
      if (groupBy !== "none") {
        // Cluster by group using forceX/forceY
        sim.force("x", d3.forceX(d => {
          const idx = groupValues.indexOf(d[groupBy] || "Unknown");
          return width / (groupValues.length + 1) * (idx + 1);
        }).strength(0.4));
        sim.force("y", d3.forceY(height / 2).strength(0.3));
      }
      
      // Store simulation in ref
      simulationRef.current = sim;
      
      // Render
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      
      // Set SVG dimensions to match container
      svg.attr("width", width).attr("height", height);
      
      const g = svg.append("g");
      
      // Draw nodes
      const node = g.selectAll("g.node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .on("mouseover", (event, d) => onNodeHover(d, event))
        .on("mouseout", () => onNodeHover(null))
        .on("click", (event, d) => onNodeClick(d, event));
        
      node.append("circle")
        .attr("r", nodeRadius)
        .attr("fill", d => getNodeColor(d, groupBy))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 3)
        .attr("stroke-opacity", 1)
        .attr("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");
        
      node.append("image")
        .attr("xlink:href", d => d.avatar_url || null)
        .attr("x", -22)
        .attr("y", -22)
        .attr("width", 44)
        .attr("height", 44)
        .attr("clip-path", "circle(22px at 22px 22px)")
        .attr("opacity", 0.95)
        .style("display", d => d.avatar_url ? "block" : "none");
        
      node.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("font-size", "14px")
        .attr("font-weight", "600")
        .attr("fill", "#ffffff")
        .style("display", d => d.avatar_url ? "none" : "block")
        .text(d => {
          const names = d.name.split(' ');
          return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : d.name.substring(0, 2).toUpperCase();
        });
        
      sim.on("tick", () => {
        node.attr("transform", d => {
          // Clamp node positions to prevent clipping at edges
          d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x));
          d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y));
          return `translate(${d.x},${d.y})`;
        });
      });
      
      function dragstarted(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event, d) {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
    };
  }, [data, groupBy, onNodeHover, onNodeClick]);

  // Zoom controls
  const handleZoomIn = () => setTransform(prev => ({ ...prev, k: Math.min(prev.k * 1.2, 3) }));
  const handleZoomOut = () => setTransform(prev => ({ ...prev, k: Math.max(prev.k / 1.2, 0.3) }));
  const handleReset = () => setTransform({ x: 0, y: 0, k: 1 });
  const handleMouseDown = (e) => { 
    if (e.button === 0 && !e.target.closest('button')) { 
      setIsDragging(true); 
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y }); 
    } 
  };
  const handleMouseMove = (e) => { 
    if (isDragging) { 
      setTransform(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })); 
    } 
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      className="relative w-full h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button size="sm" variant="secondary" onClick={handleZoomIn} className="w-8 h-8 p-0"><ZoomIn className="h-4 w-4" /></Button>
        <Button size="sm" variant="secondary" onClick={handleZoomOut} className="w-8 h-8 p-0"><ZoomOut className="h-4 w-4" /></Button>
        <Button size="sm" variant="secondary" onClick={handleReset} className="w-8 h-8 p-0"><RotateCcw className="h-4 w-4" /></Button>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      />
    </div>
  );
};

