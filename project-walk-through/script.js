// REQUIRE A SERVER TO BYPASS CORS ISSUE
(async () => {
  const data = await d3.csv("data.csv", ({ year, name, number }) => ({
    year,
    name,
    number: parseInt(number, 10),
  }));

  const div = d3.select("body").append("div").attr("id", "root");
  const header = div.append("header");
  header.append("h1").text("Interactive stacked area chart");

  const article = div.append("article");

  article
    .append("p")
    .text(
      "The visual highlights the 100 most frequent names given to French babies, males."
    );

  const visual = article.append("div");

  const width = 1000;
  const height = 500;
  const margin = {
    top: 10,
    right: 70,
    bottom: 30,
    left: 20,
  };

  const svg = visual
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + (margin.left + margin.right)} ${
        height + (margin.top + margin.bottom)
      }`
    );

  visual.style("position", "relative");
  const tooltip = visual
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("visibility", "hidden")
    .style("opacity", "0");

  article
    .append("p")
    .text(
      "Click on one of the areas to to highlight the names beggining with a specific letter."
    );

  const timeParse = d3.timeParse("%Y");
  const timeFormat = d3.timeFormat("%Y");
  const numberFormat = d3.format(",");

  const names = data
    .map(({ name }) => name)
    .reduce(
      (acc, curr) => (acc.includes(curr) ? [...acc] : [...acc, curr]),
      []
    );

  const letters = names
    .map((name) => name[0])
    .reduce(
      (acc, curr) => (acc.includes(curr) ? [...acc] : [...acc, curr]),
      []
    );

  const dataStack = [...d3.group(data, (d) => d.year)].reduce(
    (acc, [year, values]) => {
      return [
        ...acc,
        {
          year: timeParse(year),
          ...values.reduce((a, { name, number }) => {
            const [letter] = name;

            return {
              ...a,
              [letter]: a[letter] ? a[letter] + number : number,
            };
          }, {}),
        },
      ];
    },
    []
  );

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
    .domain([0, d3.max(dataStacked[dataStacked.length - 1], ([, d1]) => d1)])
    .range([height, 0])
    .nice();

  const scaleYDomain = scaleY.domain();

  const scaleColor = d3.scaleOrdinal(d3.schemeSet2);

  const area = d3
    .area()
    .x(({ data }) => scaleX(data.year))
    .y0(([y0]) => scaleY(y0))
    .y1(([, y1]) => scaleY(y1))
    .curve(d3.curveCatmullRom);

  const axisX = d3.axisBottom(scaleX).tickSize(0).tickPadding(12);
  const axisY = d3
    .axisRight(scaleY)
    .tickSize(0)
    .tickPadding(10)
    .ticks(5)
    .tickFormat((d) => (d ? numberFormat(d) : ""));

  const group = svg
    .append("g")
    .attr("transform", `translate(${margin.left} ${margin.top})`);

  const defs = svg.append("defs");

  const clipPath = defs
    .append("clipPath")
    .attr("id", "clip-path-stacked-area-chart");

  clipPath.append("rect").attr("width", width).attr("height", height);

  const groupData = group.append("g").attr("id", "clip-path-highlight-names");
  const groupAxis = group.append("g");

  const groupLetters = groupData.append("g");
  const groupOverlay = groupData.append("g");
  const groupNames = groupData.append("g");

  groupAxis
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0 ${height})`)
    .call(axisX);
  groupAxis
    .append("g")
    .attr("transform", `translate(${width} 0)`)
    .attr("class", "axis y-axis")
    .call(axisY);

  groupLetters
    .selectAll("path")
    .data(dataStacked)
    .enter()
    .append("path")
    .attr("fill", (_, i) => scaleColor(i))
    .attr("d", area);

  groupOverlay
    .style("pointer-events", "none")
    .style("cursor", "zoom-out")
    .attr("opacity", "0")
    .append("rect")
    .attr("transform", `translate(${-margin.left} ${-margin.top})`)
    .attr("width", width + (margin.left + margin.right))
    .attr("height", height + (margin.top + margin.bottom));

  groupLetters
    .selectAll("path")
    .on("pointerenter", function (e, { key }) {
      groupLetters.selectAll("path").attr("opacity", "0.5");

      d3.select(this).attr("opacity", 1);

      tooltip
        .style("visibility", "visible")
        .style("opacity", "1")
        .style("left", `${e.layerX}px`)
        .style("top", `${e.layerY}px`);

      tooltip.append("p").html(`Letter: <strong>${key}</strong>`);
    })
    .on("pointermove", (e) => {
      tooltip.style("left", `${e.layerX}px`).style("top", `${e.layerY}px`);
    })
    .on("pointerleave", () => {
      groupLetters.selectAll("path").attr("opacity", "1");

      tooltip
        .style("visibility", "hidden")
        .style("opacity", "0")
        .selectAll("*")
        .remove();
    });

  groupLetters
    .selectAll("path")
    .style("cursor", "zoom-in")
    .on("click", function (e, d) {
      groupLetters.selectAll("path").attr("opacity", "1");

      tooltip
        .style("visibility", "hidden")
        .style("opacity", "0")
        .selectAll("*")
        .remove();

      groupOverlay.style("pointer-events", "initial");

      const letter = d.key;

      const dataStackedLetter = d3
        .stack()
        .keys(letters)
        .value((d, key) => {
          if (key !== letter) return 0;

          return d[key] || 0;
        })(dataStack);

      scaleY
        .domain([
          0,
          d3.max(dataStackedLetter[dataStackedLetter.length - 1], ([, m]) => m),
        ])
        .nice();

      const transition = d3.transition().duration(750).ease(d3.easeQuadInOut);

      groupAxis.select(".y-axis").transition(transition).call(axisY);
      groupLetters
        .selectAll("path")
        .data(dataStackedLetter)
        .transition(transition)
        .attr("d", area);

      const namesLetter = names.filter((name) => name[0] === letter);
      const dataStackNames = [...d3.group(data, (d) => d.year)].reduce(
        (acc, [year, values]) => {
          return [
            ...acc,
            {
              year: timeParse(year),
              ...values.reduce((a, { name, number }) => {
                if (name[0] === letter) {
                  a[name] = number;
                }
                return a;
              }, {}),
            },
          ];
        },
        []
      );

      const dataStackedEmpty = d3
        .stack()
        .keys(namesLetter)
        .value(() => 0)(dataStackNames);

      groupNames
        .selectAll("path")
        .data(dataStackedEmpty)
        .enter()
        .append("path")
        .attr("fill", (_, i) => scaleColor(i))
        .attr("d", area);

      transition.on("end", () => {
        const transition = d3
          .transition()
          .duration(750)
          .delay(50)
          .ease(d3.easeQuadInOut);

        const dataStackedNames = d3
          .stack()
          .keys(namesLetter)
          .value((d, key) => d[key] || 0)(dataStackNames);

        groupNames
          .selectAll("path")
          .data(dataStackedNames)
          .transition(transition)
          .attr("d", area);

        transition.on("end", () => {
          groupNames
            .selectAll("path")
            .on("pointerenter", function (e, { key }) {
              groupNames.selectAll("path").attr("opacity", "0.5");

              d3.select(this).attr("opacity", 1);

              tooltip
                .style("visibility", "visible")
                .style("opacity", "1")
                .style("left", `${e.layerX}px`)
                .style("top", `${e.layerY}px`);

              tooltip.append("p").html(`Name: <strong>${key}</strong>`);
            })
            .on("pointermove", (e) => {
              tooltip
                .style("left", `${e.layerX}px`)
                .style("top", `${e.layerY}px`);
            })
            .on("pointerleave", function () {
              groupNames.selectAll("path").attr("opacity", "1");

              tooltip
                .style("visibility", "hidden")
                .style("opacity", "0")
                .selectAll("*")
                .remove();
            });

          groupOverlay.on(
            "click",
            function (e, d) {
              scaleY.domain(scaleYDomain).nice();

              const transition = d3
                .transition()
                .duration(750)
                .ease(d3.easeQuadInOut);

              groupAxis.select(".y-axis").transition(transition).call(axisY);
              groupLetters
                .selectAll("path")
                .data(dataStacked)
                .transition(transition)
                .attr("d", area);

              groupNames
                .selectAll("path")
                .data(dataStackedEmpty)
                .transition(transition)
                .attr("d", area)
                .remove();

              transition.on("end", () => {
                groupOverlay.style("pointer-events", "none");
              });
            },
            {
              once: true,
            }
          );
          //
        });
      });
    });
})();
