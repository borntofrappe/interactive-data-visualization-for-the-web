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

  vizMap();
  vizChoropleth();
};

viz();
