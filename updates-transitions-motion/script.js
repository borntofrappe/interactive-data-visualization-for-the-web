const getDatum = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min)) + min;

const getData = (points = 10, min = 0, max = 100) =>
  Array(points)
    .fill()
    .map((_) => getDatum(min, max));

const vizSetup = () => {
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
    .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

  groups
    .append("rect")
    .attr("fill", "hsl(0, 0%, 75%)")
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
};

const vizUpdateEverything = () => {
  // ! repeats vizSetup until the button element

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
    .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

  groups
    .append("rect")
    .attr("fill", "hsl(0, 0%, 75%)")
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

  // update
  const delayScale = d3.scaleBand().domain(xScale.domain()).range([0, 100]);

  viz
    .append("button")
    .text("Update everything")
    .on("click", () => {
      const dataset = getData();

      yScale.domain([0, d3.max(dataset)]).nice();

      const groups = dataGroup.selectAll("g").data(dataset);

      axisGroup.select(".y-axis").transition().duration(500).call(yAxis);

      axisGroup.selectAll("text").attr("font-size", "16");

      groups
        .select("rect")
        .transition()
        .duration(500)
        .attr("y", (d) => yScale(d))
        .delay((_, i) => delayScale(i))
        .attr("height", (d) => height - yScale(d));

      groups
        .select("text")
        .text((d) => d)
        .transition()
        .duration(500)
        .delay((_, i) => delayScale(i))
        .attr("y", (d) => yScale(d) - 8);
    });
};

const vizUpdateSelections = () => {
  const dataPoints = 10;
  let dataset = [];
  let id = 0;
  for (let i = 0; i < dataPoints; i++) {
    dataset.push({
      key: id++,
      value: getDatum(),
    });
  }

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
    .domain([0, d3.max(dataset, ({ value }) => value)])
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

  const defs = svg.append("defs");
  const clipPath = defs
    .append("clipPath")
    .attr("id", "clip-path-update-selections");
  clipPath
    .append("rect")
    .attr("width", width)
    .attr("y", -margin) // avoid cutting off the labels
    .attr("height", height + margin);

  const dataGroup = svg
    .append("g")
    .attr("clip-path", "url(#clip-path-update-selections)");
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
    .data(dataset, ({ key }) => key)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

  groups
    .append("rect")
    .attr("fill", "hsl(0, 0%, 75%)")
    .attr("width", xScale.bandwidth())
    .attr("y", ({ value }) => yScale(value))
    .attr("height", ({ value }) => height - yScale(value));

  groups
    .append("text")
    .attr("fill", "hsl(0, 0%, 20%)")
    .attr("font-size", "18")
    .attr("font-weight", "700")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("x", xScale.bandwidth() / 2)
    .attr("y", ({ value }) => yScale(value) - 8)
    .text(({ value }) => value);

  const delayScale = d3.scaleBand().domain(xScale.domain()).range([0, 100]);

  viz
    .append("button")
    .text("Update everything")
    .on("click", () => {
      dataset.forEach((d) => {
        d.value = getDatum();
      });

      const transition = d3.transition().duration(500);

      yScale.domain([0, d3.max(dataset, ({ value }) => value)]).nice();

      axisGroup.select(".y-axis").transition(transition).call(yAxis);

      axisGroup.selectAll("text").attr("font-size", "16");

      const groups = dataGroup.selectAll("g").data(dataset, ({ key }) => key);

      groups
        .select("rect")
        .transition(transition)
        .attr("y", ({ value }) => yScale(value))
        .attr("height", ({ value }) => height - yScale(value));

      groups
        .select("text")
        .text(({ value }) => value)
        .transition(transition)
        .attr("y", ({ value }) => yScale(value) - 8);
    });

  viz
    .append("button")
    .text("Add value")
    .on("click", () => {
      dataset.push({
        key: id++,
        value: getDatum(),
      });

      const transition = d3.transition().duration(500);

      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset, ({ value }) => value)]).nice();

      axisGroup.select(".x-axis").transition(transition).call(xAxis);
      axisGroup.select(".y-axis").transition(transition).call(yAxis);

      axisGroup.selectAll("text").attr("font-size", "16");

      const groups = dataGroup.selectAll("g").data(dataset, ({ key }) => key);

      const enterGroups = groups.enter().append("g");

      enterGroups
        .attr("transform", `translate(${width} 0)`)
        .transition(transition)
        .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

      enterGroups
        .append("rect")
        .attr("fill", "hsl(0, 0%, 75%)")
        .attr("width", xScale.bandwidth())
        .attr("y", ({ value }) => yScale(value))
        .attr("height", ({ value }) => height - yScale(value));

      enterGroups
        .append("text")
        .attr("fill", "hsl(0, 0%, 20%)")
        .attr("font-size", "18")
        .attr("font-weight", "700")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("x", xScale.bandwidth() / 2)
        .attr("y", ({ value }) => yScale(value) - 8)
        .text(({ value }) => value);

      groups
        .transition(transition)
        .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

      groups
        .select("rect")
        .transition(transition)
        .attr("y", ({ value }) => yScale(value))
        .attr("width", xScale.bandwidth())
        .attr("height", ({ value }) => height - yScale(value));

      groups
        .select("text")
        .text(({ value }) => value)
        .transition(transition)
        .attr("x", xScale.bandwidth() / 2)
        .attr("y", ({ value }) => yScale(value) - 8);
    });

  viz
    .append("button")
    .text("Remove value at random")
    .on("click", () => {
      if (dataset.length <= 1) return;

      const i = Math.floor(Math.random() * dataset.length);

      dataset = [...dataset.slice(0, i), ...dataset.slice(i + 1)];

      const transition = d3.transition().duration(500);

      xScale.domain(d3.range(dataset.length));
      yScale.domain([0, d3.max(dataset, ({ value }) => value)]).nice();

      axisGroup.select(".x-axis").transition(transition).call(xAxis);
      axisGroup.select(".y-axis").transition(transition).call(yAxis);

      axisGroup.selectAll("text").attr("font-size", "16");

      const groups = dataGroup.selectAll("g").data(dataset, ({ key }) => key);

      groups
        .exit()
        .transition(transition)
        .attr("transform", `translate(${width} 0)`)
        .remove();

      groups
        .transition(transition)
        .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);

      groups
        .select("rect")
        .transition(transition)
        .attr("y", ({ value }) => yScale(value))
        .attr("width", xScale.bandwidth())
        .attr("height", ({ value }) => height - yScale(value));

      groups
        .select("text")
        .text(({ value }) => value)
        .transition(transition)
        .attr("x", xScale.bandwidth() / 2)
        .attr("y", ({ value }) => yScale(value) - 8);
    });
};

vizSetup();
vizUpdateEverything();
vizUpdateSelections();
