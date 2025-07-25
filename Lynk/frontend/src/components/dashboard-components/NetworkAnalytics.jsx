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

