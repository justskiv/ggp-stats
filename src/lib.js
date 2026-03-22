import htm from "https://esm.sh/htm@3.1.1";

const { useState, useEffect, useMemo, createElement, Fragment } = React;
const {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Tooltip, Legend, ResponsiveContainer,
} = Recharts;

const html = htm.bind(createElement);

export {
  useState, useEffect, useMemo, createElement, Fragment, html,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Tooltip, Legend, ResponsiveContainer,
};
