# Interactive Data Visualizations for the Web

> Demos are worth something, at least more than the notes which follow — more a random collection of thoughts.

## Introduction

Mapping information to visuals — think mapping larger values to taller bars.

Why interactive? Why data? Why visualizations? Why the web? Reasons, reasons, reasons, reasons!

A great medium able to convey information which an incredible degree of effectiveness.

Ben Shneiderman "Visual Information-Seeking Mantra": _Overview first, zoom and filter, then details on demand._

## Introducing D3

Data driven (web) documents. A library by Mike Bostock.

The library is not a charting library. It focuses on the generation and manipulation of data so that you chart, you plot the values in the way you want.

Transformation, mapping is key. Visual decisions are up to you.

## Technology fundamentals

### The web

Communication between client and server, communication through protocols.

### HTML

Semantic structure of the content. Elements, attributes, comments, DOM, developer tools, box model.

### CSS

Style. Selector and properties, comments, inheritance, cascade, specificity.

### JavaScript

Dynamic pages. Console, variables, data types, arrays, objects

Arrays as sequence of values. Objects with properties and values.

JSON JavasSript object notation. GeoJSON, geographic javascript object notation.

Mathematical operators, comparison operators.

Control structures.

For loops.

Functions.

Comments.

A few gotchas: variable types, strict equality, function hoisting, scope. global namespace.

### SVG

Drawing on the web. Width, height, drawing elements.

Style with CSS properties or HTML attributes.

Create layers with the drawing order.

Modify transparency with opacity, or again color values.

## Setup

Download library from [d3js.org](https://d3js.org/). Reference in `index.html`.

! to work around CORS issues you might need a server. [`live-server`](https://www.npmjs.com/package/live-server) works as a quick workaround.

## Data

Structured information with potential for meaning. Text-based data in different formats: `.txt`, `.csv`, `.json`.

### Generate page elements

> refer to the [d3-selection](https://github.com/d3/d3-selection) module

```js
d3.select("body").append("p").text("Hello world");
```

Creates a paragraph element and appends the element to the body of the page.

D3 allows to chain functions:

- point to the d3 library and object

- use the select method to target the body element — D3 supports any CSS selector with which you are familiary

- use the append method to create the DOM element and add it to the current selection — the body

- add text in the current selection.

`append` returns the new element so that the current selection no longer refers to the body, it refers to the paragraph.

```js
const paragraph = d3.select("body").append("p");

paragraph.text("I said hello!");
```

### Bind data

Data visualization, as noted above, focuses on mapping data to visuals.

Bind data to DOM elements with `.data()`.

Data, like an array of numbers.

```js
const dataset = [5, 8, 13, 4, 7];
```

- select the desired HTML elements.

  ```js
  d3.select("body").selectAll("p");
  ```

  If there are no elements `selectAll` returns an empty selection.

- use the data method

  ```js
  d3.select("body").selectAll("p").data(dataset);
  ```

  `data` counts and parses the data values, executing the code which follows as many times as necessary.

- use the enter method

  ```js
  d3.select("body").selectAll("p").data(dataset).enter();
  ```

  `enter` looks at the current — empty — selection and the data values. With more values than DOM elements, the function creates a placeholder element.

- append the DOM node

  ```js
  d3.select("body").selectAll("p").data(dataset).enter().append("p");
  ```

  `append` adds a paragraph element bound to the data value. You can access the datum in functions like `text`.

  ```js
  d3.select("body")
    .selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text((d) => `Number ${d}`);
  ```

  Functions like `text`, `attr`, or again `style` accept a value or an anonymous function. Bound to data, the anonymous function receives as argument the datum.

_Note_: in the demo I append the paragraphs in a `div` container to separate the elements from the previous paragraphs. The choice will become clear in the context of the update-enter-exit selections from a future chapter.

---

Debugging notes:

- `d3.selectAll("p")` returns an object with a `_groups` and `_parents` array

- `_groups` contains a NodeList array

- the NodeList array contains the bound DOM nodes

- the nodes each have a `__data__` attribute with the data values

---

### Data sources

> refer to the [d3-dsv](https://github.com/d3/d3-dsv) module

Beyond a simple array you could retrieve the data from a `.csv`, `.tsv`, `.json` file.

Functions from the D3 library return a promise so that you instruct what to do with the data once the data is fetched.

```js
d3.csv("dataset.csv").then((dataset) => {
  console.log(dataset);
});
```

With a `.csv` file the first row is treated as the key's row.Values are also included as string.

It is possible to customize the conversion, for instance passing a function as a second argument.

```js
d3.csv("dataset.csv", (d) => ({
  name: d.name,
  age: parseInt(d.age, 10),
})).then((dataset) => {
  console.log(dataset);
});
```

## Drawing with data

### HTML

Using div elements, directly with D3 and the style method.

```js
// bound data
  .append("div")
  .style("width", "20px")
  .style("height", (d) => `${20 + d}px`)
  .style("display", "inline-block")
```

With the attr method assign a class to style the bars with CSS. Ultimately use D3 for the properties which depend on the data.

```js
// bound data
.append("div")
  .attr("class", "bar")
  .style("height", (d) => `${20 + d}px`)
```

### SVG

Use SVG elements and attributes.

The anonymous function of a bound element receives the datum as first argument, a numeric index value as a second value.

```js
// bound rectangles
  .append("rect")
  .attr("x", (_, i) => i + margin)
```

The coordinate system with SVG works from the top left corner, with increasing x values moving the system to the right, increase y values to the bottom.

_Note_: I use a bit of SVG trickery to size the vector graphic with the `viewBox` instead of `width` and `height` attributes. With the `viewBox` the width matches the number of data points so that you can give a width of 1 — minus the margin — on a single data point. The height matches the maximum value so that you can use the value directly to size the bars. The trickery will be less relevant once you introduce _scales_.

### Visualizations

Draw a bar chart with rectangles side by side. Draw a scatter plot over two dimensions and with circles. If you bind the data to the size of the circle consider updating the the _area_, not the _radius_.

```js
-.attr("r", (value) => value)
+.attr("r", (value) => Math.sqrt(value))
```

Scaling the radius tends to skew the perception of change, of the variation of values giving too much importance to large data points.

## Scales

Functions which map from input domain to output range.

The problem: you don't know the values ahead of time, but you want to have them position/sized/styled according to known value.

D3's approach: set a domain and a range so that the unknown values fit in the known metrics.

Scales have no visual representation, they are just mathematical relations.

d3.scaleLinear maps values linearly — by default an identity scale returning the input value.

```js
d3.scaleLinear();
```

Set a domain and a range so that the values are normalized and mapped to the output values.

```js
const scale = d3.scaleLinear().domain([0, 10]).range([0, 100]);

scale(8); // 80
```

Use `d3.min`, `max` and `extent` to rapidly find the minimum, maximum, both valules from the input data. Pass an accessor function to consider a value in the input collection instead of the index — default.

```js
d3.max(dataset, ([x]) => x);
```

Additional methods allow to customize the scale

- `nice()` rounds the ends of the input domain

- `rangeRound()` instead of range rounds the values returned by the scale

- `clamp()` ensures the scale function doesn't return a value outside of the input domain

Past linearScale there are several scaling functions.

- `scaleSqrt`, square root

- `scalePow`, power

- `scaleLog`, logarithmic

- `scaleQuantize`, outputting to discrete values, buckets

- `scaleQuantile`, from discrete values to discrete values, buckets to buckets

- `scaleOrdinal`, non quantitative output, such as categories

- `scaleTime`, input dates

- `schemeCategory10`, `schemeCategory20`, `schemeCategory20b`, `schemeCategory20c`; presets which output to categorical colors

The root scale helps to size the circle's radius, so to consider the area.

The time scale helps to work with scales, alongside other methods to convert string to Date objects and format Date objects with friendlier labels:

- `d3.timeParse("")`; from string to date

- `d3.timeFormat("")`; from date to string

The input string illustrates the [format](https://github.com/d3/d3-time-format#locale_format) for both functions.

## Axes

Axes are functions which do not return something, but generate visual elements. Think line, labels, ticks.

Intented for SVG, since the generated elements are `<line>`, `<path>` and `<text>`.

```pseudo
d3
  .axisTop
  .axisBottom
  .axisLeft
  .axisRight
```

At minimum reference a scale.

```js
const xAxis = d3.axisBottom(xScale);
```

Call the function on a group element.

```js
svg.append("g").call(xAxis);
```

By calling the function D3 takes the current selection — `<g>` — and passes it to the input function — `xAxis`. In so doing inject the elements for the axis.

Equivalent to the following.

```js
const xAxisGroup = svg.append("g");
xAxis(xAxisGroup);
```

Position the axis by translating the group element.

```js
svg.append("g").attr("transform", `translate(0 ${height})`).call(xAxis);
```

Customize the axis on the axis function.

```js
d3.axisTop(xScale).ticks(5);
```

Refer to the [`d3-axis`](https://github.com/d3/d3-axis) module for the available methods.

Manually handle the tick values with `tickValues()`

```js
d3.axisTop(xScale).tickValues([]);
```

Format tick labels with `tickFormat()`. Similarly to `d3.timeFormat()` use `d3.format()` to customize the number output.

```js
.tickFormat(d => d3.format(".1%")(d))
```
