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

  const width = 400;
  const height = 400;
  const margin = 30;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, ([x]) => x)])
    .range([0, width])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, ([, y]) => y)])
    .range([height, 0])
    .nice();

  const aScale = d3.scaleLinear().domain(yScale.domain()).range([5, 10]);

  const xAxis = d3.axisBottom(xScale).ticks(5).tickSize(0).tickPadding(10);
  const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(10);

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
    .style("max-width", "30rem");

  const dataGroup = svg.append("g");
  const axisGroup = svg.append("g");

  axisGroup.append("g").attr("transform", `translate(0 ${height})`).call(xAxis);
  axisGroup.append("g").call(yAxis);

  const groups = dataGroup
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    .attr("transform", ([x, y]) => `translate(${xScale(x)} ${yScale(y)})`);

  groups
    .append("circle")
    .attr("fill", "hsl(0, 0%, 70%)")
    .attr("r", ([, y]) => aScale(y));

  groups
    .append("text")
    .attr("y", ([, y]) => -aScale(y) - 2)
    .text(([x, y]) => `${x}:${y}`)
    .attr("font-size", 18)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("fill", "hsl(0, 0%, 20%)");
};

// REQUIRES A SERVER TO BYPASS CORS ISSUE
const drawBarChart = async () => {
  const timeParse = d3.timeParse("%m/%d/%y");
  const timeFormat = d3.timeFormat("%b %e");
  const timeFormatAxis = d3.timeFormat("%A");
  const valueFormat = d3.format(".1f");

  const dataset = await d3.csv("dataset.csv", (d) => ({
    date: timeParse(d["Date"]),
    value: parseFloat(d["Amount"]),
  }));

  const width = 400;
  const height = 400;
  const margin = 50;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, (d) => d.date))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d.value)])
    .range([height, 0])
    .nice();

  const aScale = d3.scaleLinear().domain(yScale.domain()).range([5, 10]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(dataset.map(({ date }) => date))
    .tickFormat((d) => timeFormatAxis(d))
    .tickSize(0)
    .tickPadding(10);

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
    .style("max-width", "30rem");

  const dataGroup = svg.append("g");
  const axisGroup = svg.append("g");

  axisGroup
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0 ${height})`)
    .call(xAxis);

  d3.select(".x-axis")
    .selectAll("text")
    .attr("font-size", "12")
    .style("text-transform", "uppercase");

  d3.select(".x-axis").select("path").remove();

  const groups = dataGroup
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    .attr(
      "transform",
      ({ date, value }) => `translate(${xScale(date)} ${yScale(value)})`
    );

  groups
    .append("line")
    .attr("stroke", "hsl(0, 0%, 60%)")
    .attr("stroke-width", "1")
    .attr("y1", 0)
    .attr("y2", ({ value }) => height - yScale(value));

  groups
    .append("circle")
    .attr("fill", "hsl(0, 0%, 70%)")
    .attr("r", ({ value }) => aScale(value));

  groups
    .append("text")
    .attr("y", ({ value }) => -aScale(value) - 5)
    .text(({ value }) => valueFormat(value))
    .attr("font-size", 18)
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-family", "sans-serif")
    .attr("fill", "hsl(0, 0%, 20%)");
};

drawScatterPlot();
drawBarChart();
