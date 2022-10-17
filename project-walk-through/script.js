// REQUIRES A SERVER TO BYPASS CORS ISSUE
const draw = async () => {
  const timeParse = d3.timeParse("%Y");
  const timeFormat = d3.timeFormat("%Y");

  const dataset = await d3.csv("dataset.csv", ({ Year, Name, Number }) => ({
    year: timeParse(Year),
    name: Name,
    number: parseInt(Number, 10),
  }));

  const width = 1000;
  const height = 400;
  const margin = 20;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, ({ year }) => year))
    .range([0, width]);

  const div = d3
    .select("body")
    .append("div")
    .style("font-family", "monospace")
    .style("font-size", "20px");

  const header = div.append("header");
  header
    .append("h1")
    .text("The letters, the names of the future")
    .style("max-width", "40ch");

  header
    .append("p")
    .html(
      `This chart highlights the names given to French babies, males, in between the years ${xScale
        .domain()
        .map((d) => timeFormat(d))
        .join(
          " and "
        )}. <br/>The focus is on the name's initial, but select a portion to highlight the names behind each category.`
    )
    .style("max-width", "60ch")
    .style("line-height", "1.5");

  const svg = div
    .append("svg")
    .attr(
      "viewBox",
      `${-margin} ${-margin} ${width + margin * 2} ${height + margin * 2}`
    );

  const defs = svg.append("defs");

  const clipPath = defs
    .append("clipPath")
    .attr("id", "clip-path-project-walk-through");

  clipPath.append("rect").attr("width", width).attr("height", height);

  const axisGroup = svg.append("g");
  const dataGroup = svg
    .append("g")
    .attr("id", "clip-path-project-walk-through");
};

draw();
