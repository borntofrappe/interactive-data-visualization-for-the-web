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
