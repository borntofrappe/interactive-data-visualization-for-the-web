const getDatum = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min)) + min;

const getData = (points = 10, min = 0, max = 100) =>
  Array(points)
    .fill()
    .map((_) => getDatum(min, max));

const vizSelections = () => {
  const points = 10;
  const min = 0;
  const max = 100;

  let dataset = getData(points, min, max);

  const width = 600;
  const height = 350;
  const margin = 50;

  const xScale = d3
    .scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .padding(0.2);

  const yScale = d3.scaleLinear().domain([min, max]).range([height, 0]).nice();

  const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(8);
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
    .style("max-width", "30rem");

  const dataGroup = svg.append("g");
  const axisGroup = svg.append("g");

  axisGroup
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0 ${height})`)
    .call(xAxis);

  axisGroup.append("g").attr("class", "axis y-axis").call(yAxis);

  axisGroup.select(".y-axis").selectAll("text").attr("font-size", "16");
  axisGroup.select(".x-axis").selectAll("text").remove();

  console.log("Empty selection");
  console.log(dataGroup.selectAll("rect"));
  console.log("Data selection");
  console.log(dataGroup.selectAll("rect").data(dataset));
  console.log("Enter subselection");
  console.log(dataGroup.selectAll("rect").data(dataset).enter());

  const groups = dataGroup
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d))
    .attr("height", (d) => height - yScale(d))
    .attr("fill", "hsl(0, 0%, 75%)");

  const controls = viz.append("div");

  controls
    .append("button")
    .text("add")
    .on("click", () => {
      dataset.push(getDatum());
      vizUpdate();
    });
  controls
    .append("button")
    .text("remove")
    .on("click", () => {
      if (dataset.length <= 1) return;

      dataset = [...dataset.slice(0, -1)];
      vizUpdate();
    });
  controls
    .append("button")
    .text("update")
    .on("click", () => {
      dataset = getData(dataset.length, min, max);
      vizUpdate();
    });

  const vizUpdate = () => {
    console.log("No-longer empty selection");
    console.log(dataGroup.selectAll("rect"));
    console.log("Data selection");
    console.log(dataGroup.selectAll("rect").data(dataset));
    console.log("Enter subselection");
    console.log(dataGroup.selectAll("rect").data(dataset).enter());
    console.log("Exit subselection");
    console.log(dataGroup.selectAll("rect").data(dataset).exit());

    const bars = dataGroup.selectAll("rect").data(dataset);

    xScale.domain(d3.range(dataset.length));

    bars
      .enter()
      .append("rect")
      .attr("fill", "hsl(0, 0%, 75%)")
      .merge(bars)
      .attr("x", (d, i) => xScale(i))
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d))
      .attr("height", (d) => height - yScale(d));

    bars.exit().remove();
  };
};

const vizFilter = () => {
  const points = 10;
  const min = 0;
  const max = 100;

  let dataset = getData(points, min, max);

  const width = 600;
  const height = 350;
  const margin = 50;

  const xScale = d3
    .scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .padding(0.2);

  const yScale = d3.scaleLinear().domain([min, max]).range([height, 0]).nice();

  const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(8);
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
    .style("max-width", "30rem");

  const dataGroup = svg.append("g");
  const axisGroup = svg.append("g");

  axisGroup
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0 ${height})`)
    .call(xAxis);

  axisGroup.append("g").attr("class", "axis y-axis").call(yAxis);

  axisGroup.select(".y-axis").selectAll("text").attr("font-size", "16");
  axisGroup.select(".x-axis").selectAll("text").remove();

  const groups = dataGroup
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d))
    .attr("height", (d) => height - yScale(d))
    .attr("fill", "hsl(0, 0%, 75%)");

  viz
    .style("display", "inline-block")
    .style("width", "90vw")
    .style("max-width", "30rem");

  const controls = viz.append("form").on("submit", (e) => e.preventDefault());

  controls.append("Label").text("Highlight values greater than ");
  controls.append("output").text(max);

  controls
    .append("input")
    .style("width", "100%")
    .attr("type", "range")
    .attr("min", min)
    .attr("max", max)
    .attr("value", max);

  controls.select("input").on("input", (e) => {
    const value = parseInt(e.target.value, 10);

    controls.select("output").text(value);

    dataGroup
      .selectAll("rect")
      .attr("fill", "hsl(0, 0%, 75%)")
      .filter((d) => d >= value)
      .attr("fill", "hsl(212, 87%, 64%)");
  });
};

vizSelections();
vizFilter();
