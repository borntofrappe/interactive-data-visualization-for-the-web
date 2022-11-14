const drawHTML = () => {
  const dataset = [5, 11, 3, 7, 11, 2, 12, 8, 5, 14, 6, 4];

  d3.select("body")
    .append("div")
    .selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", (d) => `${20 + d}px`)
    .style("background", (d) =>
      d > 10 ? "hsl(0, 80%, 90%)" : "hsl(230, 70%, 85%)"
    );
};

const drawSVG = () => {
  const dataset = [5, 11, 3, 7, 11, 2, 12, 8, 5, 14, 6, 4];

  const width = dataset.length;
  const height = d3.max(dataset);
  const margin = 0.1;
  const barWidth = 1 - margin * 2;

  d3.select("body")
    .append("div")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-height", "30rem")
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (_, i) => i + margin)
    .attr("width", barWidth)
    .attr("y", (d) => height - d)
    .attr("height", (d) => d)
    .attr("fill", (d) => (d > 10 ? "hsl(0, 80%, 90%)" : "hsl(230, 70%, 85%)"));
};

const drawScatterPlot = () => {
  const dataset = [
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88],
  ];

  const width = d3.max(dataset, ([x]) => x);
  const height = d3.max(dataset, ([, y]) => y);

  const radius = 5;
  const margin = 20;

  const svg = d3
    .select("body")
    .append("div")
    .append("svg")
    .attr(
      "viewBox",
      `${margin * -1} ${margin * -1} ${width + margin * 2} ${
        height + margin * 2
      }`
    )
    .style("max-height", "30rem");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("fill", "hsl(0, 0%, 70%)")
    .attr("cx", ([x]) => x)
    .attr("cy", ([, y]) => height - y)
    .attr("r", radius);

  svg
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", ([x]) => x)
    .attr("y", ([, y]) => height - y - radius - 2)
    .text(([x, y]) => `${x},${y}`)
    .attr("font-size", 9)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("fill", "hsl(0, 0%, 20%)");
};

drawHTML();
drawSVG();
drawScatterPlot();
