<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
const series = [
  {
    name: "PRODUCT A",
    data: [44, 55],
  },
  {
    name: "PRODUCT B",
    data: [13, 23],
  },
  {
    name: "PRODUCT C",
    data: [11, 17],
  },
];
const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    stackType: "100%",
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  xaxis: {
    categories: ["2011 Q1", "2011 Q2"],
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "right",
    offsetX: 0,
    offsetY: 50,
  },
};
</script>

<style></style>
