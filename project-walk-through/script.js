// REQUIRE A SERVER TO BYPASS CORS ISSUE
let dataset;

const timeParse = d3.timeParse("%Y");
const timeFormat = d3.timeFormat("%Y");
const numberFormat = d3.format(",");

const vizNames = () => {
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
  const height = 400;
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 80,
  };

  const dataStack = Object.values(data);

  const stack = d3
    .stack()
    .keys(names)
    .value((d, key) => d[key] || 0);

  const dataStacked = stack(dataStack);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataStack, ({ year }) => year))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataStacked[dataStacked.length - 1], ([, m]) => m)])
    .range([height, 0])
    .nice();

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const area = d3
    .area()
    .x(({ data }) => xScale(data.year))
    .y0(([y0]) => yScale(y0))
    .y1(([, y1]) => yScale(y1));

  const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(16);
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(16).ticks(5);

  const article = d3.select("#viz").append("article");
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

  const clipPath = defs.append("clipPath").attr("id", "clip-path-viz-names");

  clipPath.append("rect").attr("width", width).attr("height", height);

  const dataGroup = svg.append("g").attr("id", "clip-path-viz-names");
  const axisGroup = svg.append("g");

  dataGroup
    .selectAll("path")
    .data(dataStacked)
    .enter()
    .append("path")
    .attr("fill", (_, i) => scaleColor(i % dataStacked.length))
    .attr("d", area);

  axisGroup.append("g").attr("transform", `translate(0 ${height})`).call(xAxis);
  axisGroup.append("g").call(yAxis);

  const [yearStart, yearEnd] = xScale.domain().map((d) => timeFormat(d));
  const dataLast = dataStacked[dataStacked.length - 1];
  const [, numberStart] = dataLast[0];
  const [, numberEnd] = dataLast[dataLast.length - 1];

  article
    .append("p")
    .html(
      `From <strong>${numberFormat(
        numberStart
      )}</strong> in <strong>${yearStart}</strong> the number of most frequent names falls to <strong>${numberFormat(
        numberEnd
      )}</strong> in <strong>${yearEnd}</strong>.`
    );
};

const vizLetters = () => {
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
  const height = 400;
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 80,
  };

  const dataStack = Object.values(data);

  const stack = d3
    .stack()
    .keys(letters)
    .value((d, key) => d[key] || 0);

  const dataStacked = stack(dataStack);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataStack, ({ year }) => year))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataStacked[dataStacked.length - 1], ([, m]) => m)])
    .range([height, 0])
    .nice();

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const area = d3
    .area()
    .x(({ data }) => xScale(data.year))
    .y0(([y0]) => yScale(y0))
    .y1(([, y1]) => yScale(y1));

  const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(16);
  const yAxis = d3.axisLeft(yScale).tickSize(0).tickPadding(16).ticks(5);

  const article = d3.select("#viz").append("article");
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
      `${-margin.left} ${-margin.top} ${width + (margin.left + margin.right)} ${
        height + (margin.top + margin.bottom)
      }`
    );

  const defs = svg.append("defs");

  const clipPath = defs.append("clipPath").attr("id", "clip-path-viz-letters");

  clipPath.append("rect").attr("width", width).attr("height", height);

  const dataGroup = svg.append("g").attr("id", "clip-path-viz-letters");
  const axisGroup = svg.append("g");

  dataGroup
    .selectAll("path")
    .data(dataStacked)
    .enter()
    .append("path")
    .attr("fill", (_, i) => scaleColor(i % dataStacked.length))
    .attr("d", area);

  axisGroup.append("g").attr("transform", `translate(0 ${height})`).call(xAxis);
  axisGroup.append("g").call(yAxis);

  const [yearStart, yearEnd] = xScale.domain().map((d) => timeFormat(d));
  const dataLast = dataStacked[dataStacked.length - 1];
  const [, numberStart] = dataLast[0];
  const [, numberEnd] = dataLast[dataLast.length - 1];
};

const viz = async () => {
  dataset = await d3.csv("dataset.csv", ({ Year, Name, Number }) => ({
    year: Year,
    name: Name,
    number: parseInt(Number, 10),
  }));

  const div = d3.select("body").append("div").attr("id", "viz");
  const header = div.append("header");
  header.append("h1").text("Les noms de l'avenir");

  vizNames();
  vizLetters();
};

viz();
