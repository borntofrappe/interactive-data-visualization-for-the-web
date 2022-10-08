d3.select("body").append("p").text("Hello world");

const paragraph = d3.select("body").append("p");

paragraph.text("I said hello!");

const dataset = [5, 8, 13, 4, 7];

d3.select("body")
  .append("div")
  .selectAll("p")
  .data(dataset)
  .enter()
  .append("p")
  .text((d) => `Number #${d}`);

// REQUIRES A SERVER TO BYPASS CORS ISSUE
d3.csv("dataset.csv", (d) => ({
  name: d.name,
  age: parseInt(d.age, 10),
})).then((dataset) => {
  d3.select("body")
    .append("div")
    .selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text(
      (d) =>
        `${d.name[0].toUpperCase()}${d.name.slice(1)} is ${
          d.age + 1
        } years young`
    );
});
