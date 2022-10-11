// REQUIRES A SERVER TO BYPASS CORS ISSUE
const vizLineChart = async () => {
  const timeParse = d3.timeParse("%Y-%m-%d");
  const timeFormat = d3.timeFormat("%Y");
  const labelFormat = d3.timeFormat("%B %d");

  const dataset = await d3.csv("dataset.csv", (d) => ({
    date: timeParse(d.date),
    value: parseInt(d.value, 10),
  }));

  const width = 600;
  const height = 300;
  const margin = 40;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, (d) => d.date))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.value)])
    .range([height, 0]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(0)
    .tickPadding(8)
    .tickValues(d3.timeYears(...xScale.domain()))
    .tickFormat((d) => timeFormat(d));
  const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(8);

  const viz = d3.select("body").append("div");

  const svg = viz
    .append("svg")
    .attr(
      "viewBox",
      `${margin * -1} ${margin * -1} ${width + margin * 2} ${
        height + margin * 2
      }`
    )
    .style("max-width", "42rem");

  const dataGroup = svg.append("g");

  const axisGroup = svg.append("g");

  axisGroup
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0 ${height})`)
    .call(xAxis);

  axisGroup.append("g").attr("class", "axis y-axis").call(yAxis);

  axisGroup
    .selectAll("text")
    .attr("font-size", "14")
    .attr("font-family", "monospace");

  const mean = d3.mean(dataset, (d) => d.value);

  dataGroup
    .append("path")
    .attr("d", `M 0 ${yScale(mean)} h ${width}`)
    .attr("fill", "none")
    .attr("stroke", "hsl(0, 0%, 70%)")
    .attr("stroke-width", "1")
    .attr("stroke-dasharray", "6 8");

  const area1 = d3
    .area()
    .defined((d) => d.value <= mean)
    .x((d) => xScale(d.date))
    .y0(height)
    .y1((d) => yScale(d.value));

  const area2 = d3
    .area()
    .defined((d) => d.value >= mean)
    .x((d) => xScale(d.date))
    .y0(yScale(mean))
    .y1((d) => yScale(d.value));

  const line1 = d3
    .line()
    .defined((d) => d.value <= mean)
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  const line2 = d3
    .line()
    .defined((d) => d.value >= mean)
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));

  dataGroup
    .append("path")
    .datum(dataset)
    .attr("d", area1)
    .attr("fill", "hsl(0, 0%, 90%)");

  dataGroup
    .append("path")
    .datum(dataset)
    .attr("d", line1)
    .attr("fill", "none")
    .attr("stroke", "hsl(0, 0%, 30%)")
    .attr("stroke-width", "2");

  dataGroup
    .append("path")
    .datum(dataset)
    .attr("d", area2)
    .attr("fill", "hsl(192, 67%, 98%)");

  dataGroup
    .append("path")
    .datum(dataset)
    .attr("d", line2)
    .attr("fill", "none")
    .attr("stroke", "hsl(192, 75%, 57%)")
    .attr("stroke-width", "2");

  const [min, max] = d3.extent(dataset, (d) => d.value);
  const dataMin = dataset.filter((d) => d.value === min);
  const dataMax = dataset.filter((d) => d.value === max);

  const minGroups = dataGroup
    .append("g")
    .selectAll("g")
    .data(dataMin)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d) => `translate(${xScale(d.date)} ${yScale(d.value)})`
    );

  minGroups
    .append("path")
    .attr("d", (d) => `M 0 0 v ${height - yScale(d.value)}`)
    .attr("fill", "none")
    .attr("stroke", "hsl(0, 0%, 70%)")
    .attr("stroke-width", "1")
    .attr("stroke-dasharray", "6 8");

  minGroups.append("circle").attr("r", "7").attr("fill", "hsl(0, 0%, 62%)");

  minGroups
    .append("text")
    .attr("y", "24")
    .attr("font-size", "16")
    .attr("font-family", "monospace")
    .attr("text-anchor", "middle")
    .attr("fill", "hsl(0, 0%, 20%)")
    .html(
      (d) =>
        `${labelFormat(d.date)}: <tspan font-weight="bold">${d.value}</tspan>`
    );

  const maxGroups = dataGroup
    .append("g")
    .selectAll("g")
    .data(dataMax)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d) => `translate(${xScale(d.date)} ${yScale(d.value)})`
    );

  maxGroups
    .append("path")
    .attr("d", (d) => `M 0 0 v ${height - yScale(d.value)}`)
    .attr("fill", "none")
    .attr("stroke", "hsl(0, 0%, 70%)")
    .attr("stroke-width", "1")
    .attr("stroke-dasharray", "6 8");

  maxGroups.append("circle").attr("r", "7").attr("fill", "hsl(197, 85%, 57%)");

  maxGroups
    .append("text")
    .attr("y", "-10")
    .attr("font-size", "16")
    .attr("font-family", "monospace")
    .attr("text-anchor", "middle")
    .attr("fill", "hsl(0, 0%, 20%)")
    .html(
      (d) =>
        `${labelFormat(d.date)}: <tspan font-weight="bold">${d.value}</tspan>`
    );
};

vizLineChart();
