const getDatum = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min)) + min;

const getData = (points = 10, min = 0, max = 100) =>
  Array(points)
    .fill()
    .map((_) => getDatum(min, max));

const vizPie = () => {
  const dataset = getData(5);

  const size = 400;
  const margin = 25;

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const pie = d3.pie();
  const arc = d3
    .arc()
    .innerRadius(size / 4)
    .outerRadius(size / 2);

  const pieDataset = pie(dataset);

  const viz = d3.select("body").append("div");

  const svg = viz
    .append("svg")
    .attr(
      "viewBox",
      `${margin * -1} ${margin * -1} ${size + margin * 2} ${size + margin * 2}`
    )
    .style("max-width", "30rem");

  const dataGroup = svg
    .append("g")
    .attr("transform", `translate(${size / 2} ${size / 2})`);

  const groups = dataGroup
    .selectAll("g")
    .data(pieDataset)
    .enter()
    .append("g")
    .attr("fill", (_, i) => scaleColor(i));

  groups.append("path").attr("d", arc);

  groups
    .append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .text((d) => d.value)
    .attr("fill", "hsl(0, 0%, 97%)")
    .attr("stroke", "hsl(0, 0%, 19%)")
    .attr("stroke-width", "5")
    .attr("stroke-linejoin", "round")
    .attr("paint-order", "stroke")
    .attr("font-family", "monospace")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-size", "30");
};

const vizStackBars = async () => {
  const timeParse = d3.timeParse("%Y");
  const data = await d3.csv("dataset.csv");

  const keys = data.columns.filter((d) => d !== "Year");

  const stack = d3.stack().keys(keys);
  const stackDataset = stack(data);

  const width = 500;
  const height = 350;
  const margin = 25;

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const xScale = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([0, width])
    .padding(0.2);

  const max = d3.max(stackDataset[stackDataset.length - 1], (d) => d[1]);
  const yScale = d3.scaleLinear().domain([0, max]).range([0, height]);

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

  const dataGroups = dataGroup
    .selectAll("g")
    .data(stackDataset)
    .enter()
    .append("g")
    .attr("fill", (_, i) => scaleColor(i));

  dataGroups
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", (_, i) => xScale(i))
    .attr("y", (d) => height - yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(d[1] - d[0]));
};

const vizStackArea = async () => {
  const timeParse = d3.timeParse("%Y");
  const data = await d3.csv("dataset.csv");

  const keys = data.columns.filter((d) => d !== "Year");

  const stack = d3.stack().keys(keys);
  const stackDataset = stack(data);

  const width = 500;
  const height = 350;
  const margin = 25;

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => timeParse(d["Year"])))
    .range([0, width]);

  const max = d3.max(stackDataset[stackDataset.length - 1], (d) => d[1]);
  const yScale = d3.scaleLinear().domain([0, max]).range([height, 0]);

  const area = d3
    .area()
    .x((d) => xScale(timeParse(d.data["Year"])))
    .y0((d) => yScale(d[0]))
    .y1((d) => yScale(d[1]))
    .curve(d3.curveBasis);

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

  const dataGroups = dataGroup
    .selectAll("g")
    .data(stackDataset)
    .enter()
    .append("g")
    .attr("fill", (_, i) => scaleColor(i))
    .append("path")
    .attr("d", area);
};

const vizForce = () => {
  const planets = [
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
  ];

  const links = [
    { source: "Earth", target: "Moon" },
    { source: "Mars", target: "Deimos" },
    { source: "Mars", target: "Phobos" },
    { source: "Jupiter", target: "Ganymede" },
    { source: "Jupiter", target: "Callisto" },
    { source: "Jupiter", target: "Io" },
    { source: "Jupiter", target: "Europa" },
    { source: "Saturn", target: "Titan" },
    { source: "Saturn", target: "Rhea" },
    { source: "Saturn", target: "Iapetus" },
    { source: "Saturn", target: "Dione" },
    { source: "Uranus", target: "Titania" },
    { source: "Uranus", target: "Oberon" },
    { source: "Uranus", target: "Umbriel" },
    { source: "Uranus", target: "Ariel" },
    { source: "Neptune", target: "Triton" },
    { source: "Neptune", target: "Proteus" },
    { source: "Neptune", target: "Nereid" },
    { source: "Neptune", target: "Larissa" },
  ];

  for (const source of planets) {
    links.push({
      source: "Sun",
      target: source,
    });
  }

  const nodes = links
    .reduce((acc, curr) => {
      const { source, target } = curr;
      const bodies = [source, target];
      return [...acc, ...bodies.filter((body) => !acc.includes(body))];
    }, [])
    .map((body) => ({ body }));

  const size = 500;
  const margin = 25;

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const force = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-200))
    .force(
      "link",
      d3.forceLink(links).id((d) => d.body)
    )
    .force(
      "center",
      d3
        .forceCenter()
        .x(size / 2)
        .y(size / 2)
    );

  const viz = d3.select("body").append("div");

  const svg = viz
    .append("svg")
    .attr(
      "viewBox",
      `${margin * -1} ${margin * -1} ${size + margin * 2} ${size + margin * 2}`
    )
    .style("max-width", "48rem");

  const dataGroup = svg.append("g");

  const edgesGroup = dataGroup.append("g");
  const nodesGroups = dataGroup
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g");

  nodesGroups
    .append("circle")
    .attr("r", 10)
    .attr("fill", (_, i) => scaleColor(i % nodes.length));

  nodesGroups
    .append("text")
    .attr("fill", "hsl(0, 0%, 23%)")
    .text((d) => d.body)
    .attr("font-family", "monospace")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("font-size", "14");

  const edges = edgesGroup
    .selectAll("path")
    .data(links)
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "hsl(0, 0%, 37%)")
    .attr("stroke-width", "0.5")
    .attr("stroke-dasharray", "8 5");

  force.on("tick", () => {
    edges.attr(
      "d",
      ({ source, target }) =>
        `M ${source.x} ${source.y} L ${target.x} ${target.y}`
    );

    nodesGroups.attr("transform", ({ x, y }) => `translate(${x} ${y})`);
  });
};

const viz = async () => {
  vizForce();
  vizPie();
  await vizStackBars();
  await vizStackArea();
};

viz();
