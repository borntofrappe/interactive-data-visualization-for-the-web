let json;

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

const viz = async () => {
  json = await d3.json("us-states.json");

  vizMap();
};

viz();
