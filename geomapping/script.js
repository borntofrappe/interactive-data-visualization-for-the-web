let json;
let dataProductivity;
let dataCities;

const vizMap = () => {
  const width = 1000;
  const height = 500;

  const div = d3.select("body").append("div");

  const svg = div
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "48rem");

  const projection = d3.geoAlbersUsa();
  const path = d3.geoPath().projection(projection);

  svg
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "hsl(0, 0%, 30%)")
    .attr("stroke", "hsl(0, 0%, 97%)")
    .attr("stroke-width", "1");
};

const vizChoropleth = () => {
  const width = 1000;
  const height = 500;

  const div = d3.select("body").append("div");

  const svg = div
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "48rem");

  const projection = d3.geoAlbersUsa();
  const path = d3.geoPath().projection(projection);

  const scaleColor = d3
    .scaleQuantize()
    .domain(d3.extent(json.features, (d) => d.properties.value))
    .range([
      "rgb(237,248,233)",
      "rgb(186,228,179)",
      "rgb(116,196,118)",
      "rgb(49,163,84)",
      "rgb(0,109,44)",
    ]);

  const scaleArea = d3
    .scaleSqrt()
    .domain([0, d3.max(dataCities, (d) => d.population)])
    .range([5, 30]);

  svg
    .append("g")
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) =>
      d.properties.value ? scaleColor(d.properties.value) : "hsl(0, 0%, 30%)"
    )
    .attr("stroke", "hsl(0, 0%, 97%)")
    .attr("stroke-width", "1");

  svg
    .append("g")
    .selectAll("circle")
    .data(dataCities)
    .enter()
    .append("circle")
    .attr("transform", (d) => {
      const [x, y] = projection([d.lon, d.lat]);
      return `translate(${x} ${y})`;
    })
    .attr("r", (d) => scaleArea(d.population))
    .attr("fill", "hsl(13, 79%, 67%)")
    .attr("opacity", "0.8");
};

const vizPan = () => {
  const width = 1000;
  const height = 500;

  const scale = 2000;
  const projection = d3.geoAlbersUsa().scale(scale);
  const path = d3.geoPath().projection(projection);

  const scaleColor = d3
    .scaleQuantize()
    .domain(d3.extent(json.features, (d) => d.properties.value))
    .range([
      "rgb(237,248,233)",
      "rgb(186,228,179)",
      "rgb(116,196,118)",
      "rgb(49,163,84)",
      "rgb(0,109,44)",
    ]);

  const scaleArea = d3
    .scaleSqrt()
    .domain([0, d3.max(dataCities, (d) => d.population)])
    .range([5, 30]);

  const div = d3.select("body").append("div");

  const svg = div
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "48rem");

  const dataGroup = svg.append("g");
  const controlsGroup = svg.append("g");

  dataGroup
    .append("g")
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) =>
      d.properties.value ? scaleColor(d.properties.value) : "hsl(0, 0%, 30%)"
    )
    .attr("stroke", "hsl(0, 0%, 97%)")
    .attr("stroke-width", "1");

  dataGroup
    .append("g")
    .selectAll("circle")
    .data(dataCities)
    .enter()
    .append("circle")
    .attr("transform", (d) => {
      const [x, y] = projection([d.lon, d.lat]);
      return `translate(${x} ${y})`;
    })
    .attr("r", (d) => scaleArea(d.population))
    .attr("fill", "hsl(13, 79%, 67%)")
    .attr("opacity", "0.8");

  const controls = [
    {
      d: `M 0 0 ${width} 0 ${width / 2} ${height / 2}z`,
      offset: [0, 100],
      quadrant: 0,
    },
    {
      d: `M ${width} 0 ${width} ${height} ${width / 2} ${height / 2}z`,
      offset: [-100, 0],
      quadrant: 1,
    },
    {
      d: `M 0 ${height} ${width} ${height} ${width / 2} ${height / 2}z`,
      offset: [0, -100],
      quadrant: 2,
    },
    {
      d: `M 0 0 0 ${height} ${width / 2} ${height / 2}z`,
      offset: [100, 0],
      quadrant: 3,
    },
  ];

  const handlePan = (offset) => {
    const [x, y] = projection.translate();
    const [dx, dy] = offset;
    projection.translate([x + dx, y + dy]);

    dataGroup.selectAll("path").transition().attr("d", path);
    dataGroup
      .selectAll("circle")
      .transition()
      .attr("transform", (d) => {
        const [x, y] = projection([d.lon, d.lat]);
        return `translate(${x} ${y})`;
      });
  };

  const controlsGroups = controlsGroup
    .append("g")
    .selectAll("g")
    .data(controls)
    .enter()
    .append("g");

  controlsGroups
    .append("path")
    .attr("d", ({ d }) => d)
    .attr("opacity", "0")
    .style("cursor", "pointer")
    .on("click", (e, { offset }) => handlePan(offset))
    .on("mouseenter", function () {
      d3.select(this).transition().attr("opacity", "0.2");
    })
    .on("mouseleave", function () {
      d3.select(this).transition().attr("opacity", "0");
    });
};

const vizDrag = () => {
  const width = 1000;
  const height = 500;

  const scale = 2000;
  const projection = d3.geoAlbersUsa().scale(scale);
  const path = d3.geoPath().projection(projection);

  const scaleColor = d3
    .scaleQuantize()
    .domain(d3.extent(json.features, (d) => d.properties.value))
    .range([
      "rgb(237,248,233)",
      "rgb(186,228,179)",
      "rgb(116,196,118)",
      "rgb(49,163,84)",
      "rgb(0,109,44)",
    ]);

  const scaleArea = d3
    .scaleSqrt()
    .domain([0, d3.max(dataCities, (d) => d.population)])
    .range([5, 30]);

  const div = d3.select("body").append("div");

  const svg = div
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "48rem");

  const dataGroup = svg.append("g").attr("transform", "translate(0 0)");

  dataGroup
    .append("g")
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) =>
      d.properties.value ? scaleColor(d.properties.value) : "hsl(0, 0%, 30%)"
    )
    .attr("stroke", "hsl(0, 0%, 97%)")
    .attr("stroke-width", "1");

  dataGroup
    .append("g")
    .selectAll("circle")
    .data(dataCities)
    .enter()
    .append("circle")
    .attr("transform", (d) => {
      const [x, y] = projection([d.lon, d.lat]);
      return `translate(${x} ${y})`;
    })
    .attr("r", (d) => scaleArea(d.population))
    .attr("fill", "hsl(13, 79%, 67%)")
    .attr("opacity", "0.8");

  const drag = d3.drag().on("drag", (e) => {
    const { dx, dy } = e;

    const [x, y] = projection.translate();
    projection.translate([x + dx, y + dy]);

    dataGroup.selectAll("path").attr("d", path);
    dataGroup.selectAll("circle").attr("transform", (d) => {
      const [x, y] = projection([d.lon, d.lat]);
      return `translate(${x} ${y})`;
    });
  });

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", "0")
    .style("cursor", "pointer")
    .call(drag);
};

const viz = async () => {
  json = await d3.json("us-states.json");
  dataProductivity = await d3.csv(
    "us-ag-productivity.csv",
    ({ state, value }) => ({
      state,
      value: parseFloat(value),
    })
  );

  dataCities = await d3.csv(
    "us-cities.csv",
    ({ place, population, lat, lon }) => ({
      place,
      population: parseInt(population, 10),
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    })
  );

  for (const { state, value } of dataProductivity) {
    const feature = json.features.find((d) => d.properties.name === state);

    if (feature) {
      feature.properties.value = value;
    }
  }

  // vizMap();
  // vizChoropleth();

  vizPan();
  vizDrag();
};

viz();
