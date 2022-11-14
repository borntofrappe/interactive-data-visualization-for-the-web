const getDatum = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min)) + min;

const getData = (points = 10, min = 0, max = 100) =>
  Array(points)
    .fill()
    .map((_) => getDatum(min, max));

const vizSorting = () => {
  const dataset = getData();

  const width = 600;
  const height = 350;
  const margin = 50;

  const xScale = d3
    .scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([height, 0])
    .nice();

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

  axisGroup.selectAll("text").attr("font-size", "16");

  const groups = dataGroup
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    .attr("fill", "hsl(0, 0%, 75%)")
    .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

  groups
    .append("rect")
    .attr("fill", "inherit")
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d))
    .attr("height", (d) => height - yScale(d));

  groups
    .append("text")
    .attr("fill", "hsl(0, 0%, 20%)")
    .attr("font-size", "18")
    .attr("font-weight", "700")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("x", xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d) - 8)
    .text((d) => d);

  dataGroup.selectAll("g").on("mouseenter", function (e, d) {
    // console.log(d)
    d3.select(this).transition("fill").attr("fill", "tomato");
  });

  dataGroup.selectAll("g").on("mouseleave", function () {
    d3.select(this).transition("fill").attr("fill", "hsl(0, 0%, 75%)");
  });

  let ascendingOrder = false;

  viz
    .append("button")
    .text("Sort")
    .on("click", () => {
      ascendingOrder = !ascendingOrder;

      const sortingOrder = ascendingOrder ? d3.ascending : d3.descending;

      dataGroup
        .selectAll("g")
        .sort((a, b) => sortingOrder(a, b))
        .transition()
        .duration(500)
        .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);
    });

  //   viz
  //     .append("button")
  //     .text("Stop")
  //     .on("click", () => {
  //       dataGroup.selectAll("g").interrupt();
  //     });
};

const vizTooltip = () => {
  const dataset = getData();

  const width = 600;
  const height = 350;
  const margin = 50;

  const xScale = d3
    .scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([height, 0])
    .nice();

  const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(8);
  const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(0).tickPadding(8);

  const viz = d3.select("body").append("div").style("position", "relative");

  viz
    .append("div")
    .attr("id", "tooltip")
    .style("pointer-events", "none")
    .style("position", "absolute")
    .style("transform", "translate(-50%, -100%)")
    .style("visibility", "hidden")
    .style("opacity", "0")
    .style("padding", "0.1rem 1rem")
    .style("border-radius", "0.25rem")
    .style("color", "hsl(0, 0%, 20%)")
    .style("background", "hsl(0, 0%, 100%)")
    .append("p")
    .style("font-family", "sans-serif");

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

  axisGroup.selectAll("text").attr("font-size", "16");

  const groups = dataGroup
    .selectAll("g")
    .data(dataset)
    .enter()
    .append("g")
    .attr("fill", "hsl(0, 0%, 75%)")
    .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

  groups.append("title").text((d) => `Value: ${d}`);

  groups
    .append("rect")
    .attr("fill", "inherit")
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d))
    .attr("height", (d) => height - yScale(d));

  groups
    .append("text")
    .attr("fill", "hsl(0, 0%, 20%)")
    .attr("font-size", "18")
    .attr("font-weight", "700")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("x", xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d) - 8)
    .text((d) => d);

  // expand interactive area
  groups
    .append("rect")
    .attr("opacity", "0")
    .attr("fill", "transparent")
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height);

  groups
    .on("mousemove", (e) => {
      const { offsetX, offsetY } = e;
      viz
        .select("#tooltip")
        .style("left", `${offsetX}px`)
        .style("top", `${offsetY}px`);
    })
    .on("mouseover", function (e, d) {
      d3.select(this).transition("fill").attr("fill", "tomato");

      viz
        .select("#tooltip")
        .select("p")
        .html(`Value: <span style="font-weight: bold;">${d}</span>`);

      const { offsetX, offsetY } = e;

      viz
        .select("#tooltip")
        .transition()
        .style("visibility", "visible")
        .style("opacity", "1")
        .style("left", `${offsetX}px`)
        .style("top", `${offsetY}px`);

      const [x, y] = d3.pointer(e);

      const elements = groups.nodes();
      const i = elements.indexOf(this);

      svg
        .append("text")
        .style("pointer-events", "none")
        .attr("id", "text-tooltip")
        .html(`Value: <tspan font-weight="bold">${d}</tspan>`)
        .attr("x", xScale(i) + xScale.bandwidth() / 2)
        .attr("y", -22)
        .attr("text-anchor", "middle")
        .attr("fill", "hsl(0, 0%, 20%)")
        .attr("font-family", "sans-serif")
        .attr("font-size", "22")
        .attr("opacity", "0")
        .transition()
        .attr("opacity", "1");
    })
    .on("mouseout", function (e, d) {
      d3.select(this).transition("fill").attr("fill", "hsl(0, 0%, 75%)");

      svg.select("#text-tooltip").remove();
    });

  svg.on("mouseout", (e, d) => {
    viz.select("#tooltip").style("visibility", "hidden").style("opacity", "0");
  });
};

vizSorting();
vizTooltip();
