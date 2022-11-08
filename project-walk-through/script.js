// REQUIRE A SERVER TO BYPASS CORS ISSUE
let dataset;

const timeParse = d3.timeParse("%Y");
const timeFormat = d3.timeFormat("%Y");
const numberFormat = d3.format(",");

const visualizeNames = () => {
  const names = [];
  const data = {};

  for (const { year, name, number } of dataset) {
    if (!names.includes(name)) names.push(name);

    if (data[year]) {
      data[year][name] = number;
    } else {
      data[year] = { year: timeParse(year), [name]: number };
    }
  }

  const width = 1000;
  const height = 500;
  const margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 70,
  };

  const dataStack = Object.values(data);

  const stack = d3
    .stack()
    .keys(names)
    .value((d, key) => d[key] || 0);

  const dataStacked = stack(dataStack);

  const scaleX = d3
    .scaleTime()
    .domain(d3.extent(dataStack, ({ year }) => year))
    .range([0, width]);

  const scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(dataStacked[dataStacked.length - 1], ([, m]) => m)])
    .range([height, 0])
    .nice();

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const area = d3
    .area()
    .x(({ data }) => scaleX(data.year))
    .y0(([y0]) => scaleY(y0))
    .y1(([, y1]) => scaleY(y1));

  const axisX = d3.axisBottom(scaleX).tickSize(0).tickPadding(12);
  const axisY = d3
    .axisLeft(scaleY)
    .tickSize(0)
    .tickPadding(10)
    .ticks(5)
    .tickFormat((d) => (d ? numberFormat(d) : ""));

  const article = d3.select("#root").append("article");
  article.append("h2").text("Most frequent names");
  article
    .append("p")
    .html(
      "If you focus on the number of <em>all</em> names it is difficult to discern a trend — although it is possible to see that the number of the most frequent names decreases through the years."
    );

  const svg = article
    .append("svg")
    .attr(
      "viewBox",
      `${-margin.left} ${-margin.top} ${width + (margin.left + margin.right)} ${
        height + (margin.top + margin.bottom)
      }`
    );

  const defs = svg.append("defs");

  const clipPath = defs
    .append("clipPath")
    .attr("id", "clip-path-visualize-names");

  clipPath.append("rect").attr("width", width).attr("height", height);

  const dataGroup = svg.append("g").attr("id", "clip-path-visualize-names");
  const axisGroup = svg.append("g");

  dataGroup
    .selectAll("path")
    .data(dataStacked)
    .enter()
    .append("path")
    .attr("fill", (_, i) => scaleColor(i % dataStacked.length))
    .attr("d", area);

  axisGroup.append("g").attr("transform", `translate(0 ${height})`).call(axisX);
  axisGroup.append("g").call(axisY);

  const [yearStart, yearEnd] = scaleX.domain().map((d) => timeFormat(d));
  const dataLast = dataStacked[dataStacked.length - 1];
  const [, numberStart] = dataLast[0];
  const [, numberEnd] = dataLast[dataLast.length - 1];

  article
    .append("p")
    .html(
      `From <strong>${numberFormat(
        numberStart
      )}</strong> in <strong>${yearStart}</strong> the 100 most frequent names fall to <strong>${numberFormat(
        numberEnd
      )}</strong> in <strong>${yearEnd}</strong>.`
    );

  article.style("position", "relative");

  const tooltip = article
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("visibility", "hidden")
    .style("opacity", "0");

  dataGroup
    .selectAll("path")
    .on("pointerenter", function (e, { key }) {
      d3.select(this).style("filter", "brightness(1.1)");

      tooltip.style("visibility", "visible").style("opacity", "1");

      tooltip
        .append("p")
        .html(
          `<span class="visually-hidden">Name: </span><strong>${key}</strong>`
        );
    })
    .on("pointermove", (e) => {
      tooltip.style("left", `${e.layerX}px`).style("top", `${e.layerY}px`);
    })
    .on("pointerleave", function () {
      console.log("!!");
      d3.select(this).style("filter", "brightness(1)");

      tooltip
        .style("visibility", "hidden")
        .style("opacity", "0")
        .selectAll("*")
        .remove();
    });
};

const highlightNames = () => {
  const names = [];
  const letters = [];
  const data = {};

  for (const { year, name, number } of dataset) {
    if (!names.includes(name)) names.push(name);

    const [letter] = name;
    if (!letters.includes(letter)) letters.push(letter);

    if (data[year]) {
      data[year][letter] = data[year][letter]
        ? data[year][letter] + number
        : number;
    } else {
      data[year] = { year: timeParse(year), [letter]: number };
    }
  }

  const width = 1000;
  const height = 500;
  const margin = {
    top: 10,
    right: 20,
    bottom: 30,
    left: 70,
  };

  const dataStack = Object.values(data);

  const stack = d3
    .stack()
    .keys(letters)
    .value((d, key) => d[key] || 0);

  const dataStacked = stack(dataStack);

  const scaleX = d3
    .scaleTime()
    .domain(d3.extent(dataStack, ({ year }) => year))
    .range([0, width]);

  const scaleY = d3
    .scaleLinear()
    .domain([0, d3.max(dataStacked[dataStacked.length - 1], ([, m]) => m)])
    .range([height, 0])
    .nice();

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const area = d3
    .area()
    .x(({ data }) => scaleX(data.year))
    .y0(([y0]) => scaleY(y0))
    .y1(([, y1]) => scaleY(y1));

  const axisX = d3.axisBottom(scaleX).tickSize(0).tickPadding(12);
  const axisY = d3
    .axisLeft(scaleY)
    .tickSize(0)
    .tickPadding(10)
    .ticks(5)
    .tickFormat((d) => (d ? numberFormat(d) : ""));

  const article = d3.select("#root").append("article");
  article.append("h2").text("Most frequent letters");
  article
    .append("p")
    .html(
      "If you study the names considering <em>the first letter</em>, you start to see a few values take the spotlight."
    );

  const svg = article
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + (margin.left + margin.right)} ${
        height + (margin.top + margin.bottom)
      }`
    );

  const group = svg
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

  const defs = svg.append("defs");

  const clipPath = defs
    .append("clipPath")
    .attr("id", "clip-path-highlight-names");

  clipPath.append("rect").attr("width", width).attr("height", height);

  const dataGroup = group.append("g").attr("id", "clip-path-highlight-names");
  const axisGroup = group.append("g");

  dataGroup
    .selectAll("path")
    .data(dataStacked)
    .enter()
    .append("path")
    .attr("fill", (_, i) => scaleColor(i % dataStacked.length))
    .attr("d", area);

  axisGroup.append("g").attr("transform", `translate(0 ${height})`).call(axisX);
  axisGroup.append("g").call(axisY);

  article.style("position", "relative");

  const tooltip = article
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("visibility", "hidden")
    .style("opacity", "0");

  dataGroup
    .selectAll("path")
    .on("pointerenter", function (e, { key }) {
      d3.select(this).style("filter", "brightness(1.1)");

      tooltip.style("visibility", "visible").style("opacity", "1");

      tooltip
        .append("p")
        .html(
          `<span class="visually-hidden">Letter: </span><strong>${key}</strong>`
        );
    })
    .on("pointermove", (e) => {
      tooltip.style("left", `${e.layerX}px`).style("top", `${e.layerY}px`);
    })
    .on("pointerleave", function () {
      console.log("!!");
      d3.select(this).style("filter", "brightness(1)");

      tooltip
        .style("visibility", "hidden")
        .style("opacity", "0")
        .selectAll("*")
        .remove();
    });

  // article
  //   .append("p")
  //   .html(
  //     "Click on one of the areas to to highlight <em>all</em> the names starting with the corresponding letter."
  //   );
};

(async () => {
  dataset = await d3.csv("dataset.csv", ({ year, name, number }) => ({
    year,
    name,
    number: parseInt(number, 10),
  }));

  const div = d3.select("body").append("div").attr("id", "root");
  const header = div.append("header");
  header.append("h1").text("Les noms de l'avenir");

  visualizeNames();
  highlightNames();
})();
