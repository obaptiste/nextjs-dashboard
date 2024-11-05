"use client";

import React from "react";
import { ResponsiveBar } from "@nivo/bar";

export default function RevenueChart() {
  const data = [
    { customer: "Oris C John-Baptiste", revenue: 210000 },
    { customer: "Michael Novotny", revenue: 77345 },
    { customer: "Balazs Orban", revenue: 52068 },
    { customer: "Delba de Oliveira", revenue: 5800 },
    { customer: "Amy Burns", revenue: 4290 },
    { customer: "Lee Robinson", revenue: 3200 },
    { customer: "Evil Rabbit", revenue: 1000 },
  ];

  return (
    <div className="w-full h-[28rem]">
      <ResponsiveBar
        data={data}
        keys={["revenue"]}
        indexBy="customer"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        animate={true} // Enable animation
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45, // Rotate names for better readability
          legend: "Customer",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Revenue",
          legendPosition: "middle",
          legendOffset: -40,
        }}
      />
    </div>
  );
}
