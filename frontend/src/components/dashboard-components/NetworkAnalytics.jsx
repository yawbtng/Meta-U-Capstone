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

const getNodeColor = (node, groupBy, contacts = []) => {
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
  if (groupBy === "location") {
    const palette = ["#2563eb", "#059669", "#d97706", "#db2777", "#7c3aed", "#16a34a", "#4b5563", "#dc2626", "#0891b2", "#f59e42", "#f472b6", "#a3e635", "#fbbf24", "#f87171", "#818cf8", "#facc15"];
    // Get all unique locations and find the index of this node's location
    const allLocations = [...new Set(contacts.map(c => c.location).filter(Boolean))];
    const locationIndex = allLocations.indexOf(node.location);
    return locationIndex >= 0 ? palette[locationIndex % palette.length] : "#6b7280";
  }
  if (groupBy === "role") {
    const palette = ["#2563eb", "#059669", "#d97706", "#db2777", "#7c3aed", "#16a34a", "#4b5563", "#dc2626", "#0891b2", "#f59e42", "#f472b6", "#a3e635", "#fbbf24", "#f87171", "#818cf8", "#facc15"];
    // Get all unique roles and find the index of this node's role
    const allRoles = [...new Set(contacts.map(c => c.role).filter(Boolean))];
    const roleIndex = allRoles.indexOf(node.role);
    return roleIndex >= 0 ? palette[roleIndex % palette.length] : "#6b7280";
  }
  return node.isMainUser ? "#2563eb" : "#6b7280";
};

const NetworkNodeCloud = ({ data, groupBy, onNodeHover, onNodeClick, contacts }) => {
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
        .attr("fill", d => getNodeColor(d, groupBy, contacts))
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
  }, [data, groupBy, onNodeHover, onNodeClick, contacts]);

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

const NetworkAnalytics = ({ contacts, loading, user }) => {
  const { profile } = UserAuth();
  const [groupBy, setGroupBy] = useState("none");
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedContact, setSelectedContact] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    // Create nodes
    const nodes = [
      // Main user node
      {
        id: user?.id || "main-user",
        name: profile?.name || user?.user_metadata?.full_name || "You",
        isMainUser: true,
        avatar_url: profile?.avatar_url || user?.user_metadata?.avatar_url,
        groupBy: "main"
      },
      ...contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        company: contact.company,
        role: contact.role,
        industry: contact.industry,
        location: contact.location,
        relationship_type: contact.relationship_type?.[0] || "professional",
        avatar_url: contact.avatar_url,
        connection_score: contact.connection_score,
        interactions_count: contact.interactions_count,
        last_contact_at: contact.last_contact_at,
        isMainUser: false
      }))
    ];
    setGraphData({ nodes });
  }, [contacts, user, groupBy, profile]);

  const handleNodeHover = useCallback((node, event) => {
    setHoveredNode(node);
    if (event && node) {
      // Position tooltip near the node
      const rect = event.currentTarget.getBoundingClientRect();
      const containerRect = event.currentTarget.closest('.relative').getBoundingClientRect();
      setTooltipPosition({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 10
      });
    }
  }, []);

  const handleNodeClick = useCallback((node) => {
    if (node && !node.isMainUser) {
      // Find the original contact data from the contacts array
      const originalContact = contacts.find(contact => contact.id === node.id);
      if (originalContact) {
        setSelectedContact(originalContact);
        setIsViewModalOpen(true);
      }
    }
  }, [contacts]);



  const getGroupOptions = () => [
    { value: "none", label: "No Grouping", icon: Users },
    { value: "industry", label: "Industry", icon: Building },
    { value: "relationship_type", label: "Relationship", icon: Heart },
    { value: "location", label: "Location", icon: MapPin },
    { value: "role", label: "Role", icon: Briefcase }
  ];

  const getLegendData = () => {
    if (groupBy === "none") return [];
    
    if (groupBy === "relationship_type") {
      return [
        { label: "Professional", color: "#2563eb" },
        { label: "Personal", color: "#059669" },
        { label: "Social", color: "#d97706" }
      ];
    }
    
    if (groupBy === "industry") {
      // Get unique industries from the data
      const uniqueIndustries = [...new Set(contacts.map(c => c.industry).filter(Boolean))];
      const palette = ["#2563eb", "#059669", "#d97706", "#db2777", "#7c3aed", "#16a34a", "#4b5563", "#dc2626", "#0891b2", "#f59e42", "#f472b6", "#a3e635", "#fbbf24", "#f87171", "#818cf8", "#facc15"];
      
      return uniqueIndustries.map((industry, index) => ({
        label: industries.find(i => i.value === industry)?.label || industry,
        color: palette[index % palette.length]
      }));
    }
    
    if (groupBy === "location") {
      const uniqueLocations = [...new Set(contacts.map(c => c.location).filter(Boolean))];
      const palette = ["#2563eb", "#059669", "#d97706", "#db2777", "#7c3aed", "#16a34a", "#4b5563", "#dc2626", "#0891b2", "#f59e42", "#f472b6", "#a3e635", "#fbbf24", "#f87171", "#818cf8", "#facc15"];
      
      return uniqueLocations.map((location, index) => ({
        label: location,
        color: palette[index % palette.length]
      }));
    }
    
    if (groupBy === "role") {
      const uniqueRoles = [...new Set(contacts.map(c => c.role).filter(Boolean))];
      const palette = ["#2563eb", "#059669", "#d97706", "#db2777", "#7c3aed", "#16a34a", "#4b5563", "#dc2626", "#0891b2", "#f59e42", "#f472b6", "#a3e635", "#fbbf24", "#f87171", "#818cf8", "#facc15"];
      
      return uniqueRoles.map((role, index) => ({
        label: role,
        color: palette[index % palette.length]
      }));
    }
    
    return [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Visualize Your Network
            </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-125 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        </CardContent>
    </Card>
);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Visualize Your Network
        </CardTitle>
        <div className="flex items-center gap-4 mt-4">
          <label className="text-sm font-medium">Group by:</label>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getGroupOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[500px]">
        <div className="relative">
          <NetworkNodeCloud
            data={graphData}
            groupBy={groupBy}
            onNodeHover={handleNodeHover}
            onNodeClick={handleNodeClick}
            contacts={contacts}
          />
          {/* Custom Tooltip positioned over the node */}
          {hoveredNode && (
            <div 
              className="absolute z-50 pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: 'translateX(-50%) translateY(-100%)'
              }}
            >
              <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 max-w-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-gray-100">
                      <AvatarImage src={hoveredNode.avatar_url} />
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        {hoveredNode.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{hoveredNode.name}</p>
                      {hoveredNode.role && (
                        <p className="text-sm text-gray-600 truncate">{hoveredNode.role}</p>
                      )}
                    </div>
                  </div>
                  
                  {hoveredNode.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-700 truncate">{hoveredNode.email}</p>
                    </div>
                  )}
                  
                  {hoveredNode.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-700 truncate">{hoveredNode.company}</p>
                    </div>
                  )}
                  
                  {hoveredNode.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-700 truncate">{hoveredNode.location}</p>
                    </div>
                  )}
                  
                  {hoveredNode.industry && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {industries.find(i => i.value === hoveredNode.industry)?.label || hoveredNode.industry}
                    </Badge>
                  )}
                  
                  {hoveredNode.relationship_type && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {RELATIONSHIP_LABELS[hoveredNode.relationship_type] || hoveredNode.relationship_type}
                    </Badge>
                  )}
                  
                  <div className="flex gap-4 text-xs text-gray-600">
                    {hoveredNode.connection_score && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Score: {hoveredNode.connection_score}</span>
                      </div>
                    )}
                    {hoveredNode.interactions_count && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Interactions: {hoveredNode.interactions_count}</span>
                      </div>
                    )}
                  </div>
                  
                  {hoveredNode.last_contact_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Last contact: {formatDate(hoveredNode.last_contact_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Legend */}
      {groupBy !== "none" && getLegendData().length > 0 && (
        <div className="px-6 pb-6">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
            <div className="flex flex-wrap gap-3">
              {getLegendData().map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Detail Modal */}
      <ViewContactCard
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        contact={selectedContact}
      />
    </Card>
  );
};

export default NetworkAnalytics; 