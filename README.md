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

## Updates, Transitions, and Motion

Updates: how you handle data changes.

Transition and motion: one way you facilitate the perception of change.

### Setup

The visualization plots data with a bar chart.

`d3.scaleBand()` maps a discrete domain to continuous range.

`d3.range()` returns an array from 0 up to the input value. A shortcut to have an array of indexes for the dataset.

Place the bars according to the index in the range set by the visualization's width (and padding).

Customize the scale with `padding()` to add whitespace around the bars.

Use `scale.bandwidth()` to retrieve the width of a band.

### Interaction

Use the `.on` method on a D3 selection. First argument describes the event, second argument a callback.

```js
viz
  .append("button")
  .text("Update")
  .on("click", () => {});
```

### Update

Bind the new dataset to the existing elements.

```js
const groups = dataGroup.selectAll("g").data(dataset);
```

In this instance there are already group elements.

Update the affected elements in the relevant attributes/styles/content.

```js
groups
  .select("rect")
  .attr("y", (d) => yScale(d))
  .attr("height", (d) => height - yScale(d));

groups
  .select("text")
  .attr("y", (d) => yScale(d) - 8)
  .text((d) => d);
```

### Transitions

Add the transition() method _before_ the affected properties/attributes.

```js
groups
  .select("rect")
  .transition()
  .attr("y", (d) => yScale(d))
  .attr("height", (d) => height - yScale(d));
```

D3 automatically interpolates numerical values.

The transition takes place if there is already an existing value.

```js
groups.select("rect").attr("opacity", 1).transition().attr("opacity", 0);
```

Customize the transition with the `duration()`, `delay()`, `ease()` methods.

```js
groups.select("rect").transition().duration(500);
```

Use a single value or a function, in which instance you can tap into the datum and the index of the element in the bound selection.

```js
groups
  .select("rect")
  .transition()
  .delay((_, i) => i * 25);
```

To accommodate for an unknown number of element set up a scale to avoid an excessively large delay.

### Update scales

The scales are set to map a domain to a range. In the moment the domain depends on the values of the dataset and these change you need to update the scale to match.

```js
yScale.domain([0, d3.max(dataset)]).nice();
```

### Update axes

As axes depend on scales update the visuals by calling the axis function on the existing group element.

```js
axisGroup.select(".y-axis").transition().duration(500).call(yAxis);
```

`yAxis` calls the function which in turns refers to the updated scale.

### Transition events

Use the `.on` method to tap into the phases of the transition. `start` describes the beginning of the transition, `end` opposite end.

```js
groups
  .select("rect")
  .transition()
  .on("start", () => {
    // do something
  })
  .on("end", () => {
    // do something else
  })
  .attr("y", (d) => yScale(d))
  .attr("height", (d) => height - yScale(d));
```

Be warned that D3 interpolates the values of one transition at a time, the last one. If you start a new one, it takes over existing changes.

You can have a transition on the callback at the `end` event, but D3 allows to chain transitions by adding multiple transition methods.

```js
groups
  .select("rect")
  .transition()
  .attr("y", height)
  .attr("height", 0)
  .transition()
  .attr("y", (d) => yScale(d))
  .attr("height", (d) => height - yScale(d));
```

### Clip aside

Use a `clipPath` element to have visuals clipped to a specific area — relevant if you decide to animate values out the visible area before removing them, or positioning them in the visible area after adding them outside of it.

### Update selections

> the function modifies the visualization to assign a unique identifier to the data points

Data might be variable not only in value, but in number. In this instance you may need to add/remove DOM nodes.

In this instance the data method returns a more complex update selection, one with enter and exit _subselections_.

```js
const selection = group.selectAll("g").data(dataset);
```

Choose how to handle the flow of data with the `.enter()`, `.exit()` methods.

```js
// existing elements for possibly changed values
selection.attr("transform", (d, i) => `translate(${xScale(i)} 0)`); // ...

// new elements for unbound values
selection.enter().append("g"); // ...

// old elements without a corresponding value
selection.exit().remove;
```

Merge the enter and update selection if the two share properties you want to change in the same manner.

```js
selection.enter().append("g").merge(selection).attr("x"); // ...
```

_Note_: in the demo I ultimately chose to keep the selections separate to manage the data flow. If a data point is added the function introduces the new node and only afterwards it updates the position of the previous elements, if necessary. If a data point is removed the function removes the element and, once transitioned and removed, it repeats the same kind of update.

### Data joins with keys

By default elements are bound of the basis of index.

To have data bound to specific elements introduce a key, an identifier for each data point.

Refer to the key in the second argument of the data method, a callback function which has access to the data to-be-bound.

```js
.data(dataset, ({key}) => key)
```

Once you remove a data point on the basis of key you remove the matching node, no longer the last one.

## Interactivity

As per the previous demo:

- bind event listener

- define behavior with a callback function

```js
d3.select("button").on("click", () => {});
```

The callback function receives the event as the first argument, the bound datum as the second.

```js
d3.selectAll("rect").on("mouseenter", (e, d) => {
  console.log(d);
});
```

To change the color on hover use CSS.

```css
g:hover {
  fill: tomato;
}
```

With D3 change the same property with the `mouseenter` event. In this instance you need access to the element itself. Use `d3.select(this)` in a function which does not use arrow syntax.

```js
dataGroup.selectAll("g").on("mouseenter", function (e, d) {
  d3.select(this).transition().attr("fill", "tomato");
});
```

The arrow syntax would not bind the element, so that `d3.select(this)` would refer to the window's object.

Use `mouseleave` to restore the default value.

```js
dataGroup.selectAll("g").on("mouseleave", function (d) {
  d3.select(this).attr("fill", "hsl(0, 0%, 75%)");
});
```

### Sort

Use the `.sort()` method to reorder the elements on the basis of data.

Use `d3.ascending()` — or `d3.descending()` — to delegate the sorting to the D3 library.

```js
dataGroup
  .selectAll("g")
  .sort((a, b) => d3.ascending(a, b))
  .attr("transform", (d, i) => `translate(${xScale(i)} 0)`);
```

If the datum are more complex than numbers you'd refer to the values in the sorting function.

### Named transitions

In the moment you transition the color of the rectangles on hover and transition their position when the button is clicked the change in the `x` coordinate might stop if you were to hover on the bar — only one transition at a time.

Get around this by adding a name to the transition.

```js
dataGroup.selectAll("g").on("mouseenter", function (e, d) {
  d3.select(this).transition("fill").attr("fill", "tomato");
});
```

Programmatically stop the transition referring to the transition by name.

```js
d3.selectAll("g").interrupt("fill");
```

### Tooltips

Overlays with additional information. Details.

1. browser default: `<title>` element

2. SVG: vector graphics such as `<text>` elements; handle interaction on hover, for instance creating the label on `mouseover` and destroying the element on `mouseout`

3. HTML: hidden, absolute positioned `<div>` element; handle interaction on hover, displaying and placing the node above the chart. It helps to have a `<div>` container for the tooltip and visualization, so to handle the relative-absolute position pair

For specific coordinates consider [`d3.pointer`](https://github.com/d3/d3-selection/blob/main/README.md#pointer).

Beyond mouse events, consider touch events such as `touchstart` and `touchend`.
