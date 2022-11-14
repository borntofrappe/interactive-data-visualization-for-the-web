# Interactive Data Visualization for the Web

Notes jotted down, data visualization created, while reading [Interactive Data Visualization for the Web](https://www.oreilly.com/library/view/interactive-data-visualization/9781491921296/).

## Introduction

In a visualization you map information to visuals — think mapping larger values to taller bars.

Why interactive? Why data? Why visualizations? Why the web? Reasons, reasons, reasons, reasons!

In essence because data visualizations for the web are a great medium able to convey information with an incredible degree of effectiveness.

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

JSON, JavaScript object notation. GeoJSON, geographic JavaScript object notation.

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

- download D3 from [d3js.org](https://d3js.org/)

- reference the library from an `.html` document

To work around CORS issues you might need a server. [`live-server`](https://www.npmjs.com/package/live-server) works as a quick workaround.

## 01 - Data

Data: structured information with potential for meaning. Text-based data in different formats: `.txt`, `.csv`, `.json`.

### Generate page elements

```js
d3.select("body").append("p").text("Hello world");
```

Creates a paragraph element and appends the element to the body of the page.

Chain functions:

- point to the d3 library and object

- use the `select` method to target the body element — D3 supports any CSS selector with which you are familiar

- use the `append` method to create the DOM element and add it to the current selection — the body

- add text in the element behind the current selection

`append` returns the new element so that the current selection refers to the paragraph.

```js
const paragraph = d3.select("body").append("p");

paragraph.text("I said hello!");
```

### Bind data

Data visualizations, as noted above, focus on mapping data to visuals.

Bind data to DOM elements with `.data()`.

Data, like an array of numbers.

```js
const dataset = [5, 8, 13, 4, 7];
```

- select the desired HTML elements

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

  `enter` looks at the current — empty — selection and the data values. With more values than DOM elements, the function creates placeholder elements.

- add the desired HTML element

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

---

Debugging notes:

- `d3.selectAll("p")` returns an object with a `_groups` and `_parents` array

- `_groups` contains a `NodeList` array

- the `NodeList` array contains the bound DOM nodes

- the nodes each have a `__data__` attribute with the data values

---

### Data sources

Beyond a simple array retrieve the data from a `.csv`, `.tsv`, `.json` files.

`d3.csv`, `d3.tsv`, `d3.json` return a promise so that you instruct what to do with the data once the data is fetched.

```js
d3.csv("dataset.csv").then((dataset) => {
  console.log(dataset);
});
```

With a `.csv` file the first row is treated as the key's row. What is more, values are also included as string.

It is possible to customize the conversion, for instance passing a function as a second argument.

```js
d3.csv("dataset.csv", (d) => ({
  name: d.name,
  age: parseInt(d.age, 10),
})).then((dataset) => {
  console.log(dataset);
});
```

## 02 - Drawing with data

### HTML

Draw bars with `<div>` elements and the `style` method.

```js
// bound data
  .append("div")
  .style("width", "20px")
  .style("height", (d) => `${20 + d}px`)
  .style("display", "inline-block")
```

With the `attr` method assign a class to style the bars with CSS.

```js
// bound data
.append("div")
  .attr("class", "bar")
```

Use D3 for the properties which depend on the data.

```js
// bound data
.append("div")
  .style("height", (d) => `${20 + d}px`)
```

### SVG

Use SVG elements and attributes.

The anonymous function of a bound element receives the datum as the first argument, a numeric index value as the second value.

```js
// bound rectangles
  .append("rect")
  .attr("x", (_, i) => i + margin)
```

The coordinate system with SVG works from the top left corner, with increasing x values moving the system to the right, increasing y values to the bottom.

---

I use a bit of SVG trickery to size the vector graphic with the `viewBox` instead of `width` and `height` attributes. With the `viewBox` the width matches the number of data points so that you can give a width of 1 — minus the margin — on a single data point. The height matches the maximum value so that you can use the value directly to size the bars. The trickery will be less relevant once you introduce _scales_.

---

### Visualizations

Draw a bar chart with rectangles side by side. Draw a scatter plot over two dimensions and with circles. If you bind the data to the size of the circle consider updating the _area_, not the _radius_.

```js
-.attr("r", (value) => value)
+.attr("r", (value) => Math.sqrt(value))
```

Scaling the radius tends to skew the perception of change giving too much importance to large data points.

## 03 - Scales

Scales: functions which map from input domain to output range.

The problem: you don't know the values ahead of time, but you want to have them positioned/sized/styled according to known values.

D3's approach: set a domain and a range so that the unknown values are mapped to the known metrics.

Scales have no visual representation, they are just mathematical relations.

`d3.scaleLinear` maps values linearly — by default an identity scale returning the input value.

```js
d3.scaleLinear();
```

Set a domain and a range so that the values are normalized and mapped to the output values.

```js
const scale = d3.scaleLinear().domain([0, 10]).range([0, 100]);

scale(8); // 80
```

Use `d3.min`, `d3.max` and `d3.extent` to rapidly find the minimum, maximum, both values from the input data. Pass an accessor function to consider a value in the input collection instead of the index — default.

```js
d3.max(dataset, ([x]) => x);
```

Additional methods allow to customize the scale:

- `nice()`: round the ends of the input domain

- `rangeRound()`: (instead of range) round the values returned by the scale

- `clamp()`: ensure the scale function doesn't return a value outside of the input domain

Past `linearScale` there are several scaling functions.

- `scaleSqrt`: square root

- `scalePow`: power

- `scaleLog`: logarithmic

- `scaleQuantize`: continuous domain, discrete range; output values to one of the possible buckets

- `scaleQuantile`: discrete domain, discrete range; buckets to buckets

- `scaleOrdinal`: non quantitative output; such as categories

- `scaleTime`: input dates

- `schemeCategory10`, `schemeCategory20`, `schemeCategory20b`, `schemeCategory20c`: presets which output to categorical colors

The root scale helps to size the circle's radius, so to consider the area.

The time scale helps to work with scales, alongside other methods to convert string to `Date` objects and format `Date` objects with friendlier labels:

- `d3.timeParse("")`: from string to date

- `d3.timeFormat("")`: from date to string

The input string illustrates the [format](https://github.com/d3/d3-time-format#locale_format) for both functions.

## 04 - Axes

Axes are functions which do not return something, but generate visual elements. Think line, labels, ticks. They are meant for SVG, since the generated elements are `<line>`, `<path>` and `<text>`.

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

## 05 - Updates Transitions and Motion

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

Use the `.on` method on a D3 selection. The first argument describes the event, the second argument a callback.

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

Add the `transition()` method _before_ the affected properties/attributes.

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

To accommodate for an unknown number of elements set up a scale to avoid an excessively large delay.

### Update scales

The scales are set to map a domain to a range. The domain depends on the values of the dataset and these change you need to update the scale to match.

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

Use the `.on` method to tap into the phases of the transition. `start` describes the beginning of the transition, `end` its conclusion.

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

Be warned that D3 interpolates the values of one transition at a time, the last one. If you start a new one, it interrupts any existing transition.

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

### Clip

Use a `clipPath` element to have visuals clipped to a specific area — relevant if you decide to animate values out the visible area before removing them, or positioning them in the visible area after adding them outside of it.

### Update selections

> `vizUpdateSelections` modifies the visualization to assign a unique identifier to the data points

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

---

In the demo I ultimately chose to keep the selections separate to manage the data flow. If a data point is added the function introduces the new node and only afterwards it updates the position of the previous elements, if necessary. If a data point is removed the function removes the element and, once transitioned and removed, it repeats the same kind of update.

---

### Data joins with keys

By default elements are bound on the basis of index.

To have data bound to specific elements introduce a key, an identifier for each data point.

Refer to the key in the second argument of the data method, a callback function which has access to the data to-be-bound.

```js
.data(dataset, ({key}) => key)
```

Once you remove a data point on the basis of a key you remove the matching node, no longer the last one.

## 06 - Interactivity

As per the previous demo bind event listener and define behavior with a callback function.

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

In the moment you transition the color of the rectangles on hover _and_ transition their position when the button is clicked the change in the `x` coordinate might stop if you were to hover on the bar — only one transition at a time.

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

Tooltips: overlays with additional information.

You have several options:

1. browser default: `<title>` element

2. SVG: vector graphics such as `<text>` elements; handle interaction on hover, for instance creating the label on `mouseover` and destroying the element on `mouseout`

3. HTML: hidden, absolute positioned `<div>` element; handle interaction on hover, displaying and placing the node above the chart. It helps to have a `<div>` container for the tooltip and visualization, so to handle the relative-absolute position pair

For specific coordinates consider [`d3.pointer`](https://github.com/d3/d3-selection/blob/main/README.md#pointer).

Beyond mouse events, consider touch events such as `touchstart` and `touchend`.

## 07 - Paths

D3 offers helper D3 functions to generate the syntax for the `d` attribute of `<path>` elements.

### Line

Use `d3.line()` to create a function which creates the syntax for a line on the basis of input values.

Specify the horizontal and vertical coordinates with the `.x()` and `.y()` methods.

```js
d3.line()
  .x((d) => xScale(d.date))
  .y((d) => yScale(d.value));
```

Use the `.datum()` method — instead of `.data()` — to bind a single element to the array of values.

```js
dataGroup.append("path").datum(dataset).attr("d", line);
```

---

The following would draw the line, but would **not** bind the data to the element.

```js
dataGroup.append("path").attr("d", line(dataset));
```

If you were to inspect `d3.select('path')` you would not find the `__data__` property alongside the element's attributes.

---

Use the `.defined()` method to limit the values on which the function is applied.

```js
const line1 = d3
  .line()
  .defined((d) => d.value <= mean)
  .x((d) => xScale(d.date))
  .y((d) => yScale(d.value));
```

### Area

Use `d3.area()` similarly to `d3.line()`. Specify two values for the vertical — or horizontal — coordinate so that the area is drawn in the gap between the two values.

```js
const area = d3
  .area()
  .x((d) => xScale(d.date))
  .y0(height)
  .y1((d) => yScale(d.value));
```

The `.defined()` method works exactly like for the line function.

```js
const area1 = d3
  .area()
  .defined((d) => d.value <= mean)
  .x((d) => xScale(d.date))
  .y0(height)
  .y1((d) => yScale(d.value));
```

## 08 - Selections

### Properties

- each selection has a `_groups` property (among other such as `_parents` and `_proto`)

- each `_groups` describe the element(s) of the selection

  ```js
  d3.select("body"); // _groups contains the body element
  ```

- a selection is an object

  ```js
  typeof d3.select("body"); // object
  ```

- if the element is bound the element includes a `__data__` property with the bound value

  ```js
  d3.select("path"); // _groups, path, __data__
  ```

- multiple, bound elements each have a `__data__` property with the bound datum

  ```js
  d3.selectAll("circle"); // _groups, array of circles, circle, __data__
  ```

### Specificity

Select a specific node either with a stricter selector.

```js
d3.selectAll("svg > g circle");
```

Or, by chaining `.select()` methods — helps if you want to modify different elements as you select them.

```js
d3.select("svg")
  .select("g")
  .attr("opacity", "1")
  .selectAll("circle")
  .attr("fill", "hotpink");
```

The `.select()`, `.selectAll()` and `.append()` methods hand off the new selection to the methods which follow. Other methods such as `.attr()` and `.text()` do not.

### Storing selections

Selections are immutable. You can however override the value of a variable with a new selection.

```js
let groups = svg.selectAll("g");

groups = svg.select("g").selectAll("g");
```

If stored in a variable the reference is to the _last_ selection in the chain.

### Data join

When you bind data the selection object contains _subselections_.

```js
svg.selectAll("rect"); // empty selection
svg.selectAll("rect").data(dataset); // _enter, _exit subselections
```

The subselections have an array of a certain length.

Consider the enter selection.

```js
svg.selectAll("rect").data(dataset).enter();
```

When the visualization is first initialized the array contains a list of objects. These are placeholders with a `__data__` property.

Once you append the elements and bind the data to said elements the selection is an array of elements. No longer placeholders, but each with a `__data__` property

```js
svg.selectAll("rect").data(dataset).enter().append("rect");
```

When you rebind the data _without_ changing the number of values the enter subselection is always an array, but an array of empty slots. This is how D3 knows the number of existing and new elements.

```js
svg.selectAll("rect").data(dataset).enter();
```

When you increase the number of values the enter selection contains the empty slots _and_ new objects. In this manner you add elements only for the placeholder nodes.

```js
dataset.push(value);
svg.selectAll("rect").data(dataset).enter();
```

Consider now the exit selection. When the dataset doesn't change in number or else increases the array has only empty slots.

```js
svg.selectAll("rect").data(dataset).exit();
```

When removing a value the array lists the elements to-be-removed.

```js
dataset = dataset.slice(0, -2);
svg.selectAll("rect").data(dataset).exit();
```

Remove the elements and the `.remove()` method returns the affected elements.

```js
svg.selectAll("rect").data(dataset).exit().remove(); // rect
```

Finally, consider the `merge()` method used to unite the new elements from the enter selection with the existing values.

```js
const bars = svg.selectAll("rect").data(dataset);

bars.enter().append("rect").attr("...", "...").merge(bars);
```

The collection lists all the now-bound elements.

### Filter

Filter selection on the basis of data.

The condition works just like those used to style the elements differently.

```js
groups
  .selectAll("rect")
  .filter((d) => d > 40)
  .attr("stroke", "currentColor")
  .attr("stroke-width", "2")
  .attr("stroke-dasharray", "10 5");
```

Helps to avoid repeating the same condition in multiple methods.

### Each

Use the _.each_ method to run a function on each node of the current selection.

```js
groups.selectAll("rect").each((d) => {
  // do something
});
```

## 09 - Layouts

D3 maps, transforms data for you to lay out. As with the line function, D3 does not draw the line, but gives you the syntax for the `d` attribute of the `<path>` element.

### Pie

- use the `pie` function to compute the start and end angle of the slices

- use the `arc` function to take a start and end angle, as well inner and outer radius, to produce the syntax for the `d` attribute of `<path>` elements

With the bound data invoke the arc function for the `d` attribute.

```js
.data(pieDataset)
.enter()
.append('path')
.attr('d', arc)
```

The data is passed automatically so that the following lines achieve the same goal.

```js
.attr('d', arc)
.attr('d', d => arc(d))
```

Set an inner radius greater than zero for a doughnut chart.

Position labels with `arc.centroid(d)`. The function computes the center point of any shape for the specific arc function.

The actual data is stored in the `d.value` field.

```js
.text(d => d.value)
```

---

Pay attention to the _order_ of the slices: the pie-d data computes the start and end angle so that the larger value starts at angle 0 and moves clockwise. It does **not** modify the order of the values in the array.

```js
console.log(dataset);
console.log(pie(dataset));
```

The two arrays list the values in the same order.

If you assign colors on the basis of index and want to ensure the first color goes to the largest slice you need to sort the original dataset as well.

```js
dataset.sort((a, b) => b - a);
```

---

### Colors

D3 provides arrays of colors such as `d3.schemeCategory10`.

Include the values in an ordinal scale to map index values to one of the colors from the array.

```js
const scaleColor = d3.scaleOrdinal(d3.schemeCategory10);
```

### Stack

The stack function converts 2D data to stacked data. D3 adds a baseline so you can draw columns, areas.

Assume an array of objects, each describing the values with a series of properties, keys.

```js
const data = [
  { Year: "2010", Germany: 259, Sweden: 395, France: 205 },
  { Year: "2011", Germany: 284, Sweden: 286, France: 261 },
  // ...
];
```

Describe the keys on which to stack the data with the keys method.

```js
const stack = d3.stack().keys(["Germany", "Sweden", "France"]);
```

D3 transforms the data into a two dimensional array, with the baseline and value added to said baseline. Use the two to draw visuals.

```js
[
  [0, 259, data: { Year: '2010', Germany: 259, Sweden: 395, France: 205}],
  [0, 284, data: { Year: '2011', Germany: 284, Sweden: 286, France: 261}],
],
[
  [259, 654, data: { Year: '2010', Germany: 259, Sweden: 395, France: 205}],
  [284, 570, data: { Year: '2011', Germany: 284, Sweden: 286, France: 261}],
],
```

The challenge is mapping the values with the horizontal and vertical scale/dimension.

For the stacked columns bind the stacked data to group elements. The first set of arrays refer to the values for each category, so it is safe to set a fill color, shared by all visuals with the same key.

```js
const dataGroups = dataGroup
  .selectAll("g")
  .data(stackDataset)
  .enter()
  .append("g")
  .attr("fill", (_, i) => scaleColor(i));
```

Bind a portion of the bound data to rectangle elements.

```js
dataGroups
  .selectAll("rect")
  .data((d) => d)
  .enter()
  .append("rect");
```

In this instance `d` refers to the 2D array with the cumulative values (and the `data` property with the values for the keys).

For the area the process is similar, but here you need to map the values through the area function `.x()` and `.y()` methods.

---

The demo leans on the year value for the horizontal coordinate, the two cumulative values for the vertical coordinates.

```js
const area = d3
  .area()
  .x((d) => xScale(timeParse(d.data["Year"])))
  .y0((d) => yScale(d[0]))
  .y1((d) => yScale(d[1]));
```

In this instance pass the stacked data directly to the path elements.

```js
const dataGroups = dataGroup
  .selectAll("path")
  .data(stackDataset)
  .enter()
  .append("path")
  .attr("fill", (_, i) => scaleColor(i))
  .attr("d", area);
```

In this manner the area function receives the array of values for the separate categories.

---

By default data is stacked per the keys array. Use a different logic with the order method and functions such as _d3.stackOrderAscending_, placing the values from smaller to larger (changing the order might have undesired effects if you were to color the stacks on the basis of index).

### Force

Set up a force simulation to display network (graph) data. Assume data described in _nodes_ and _links_, connections.

```js
const nodes = [
  { body: "Sun" },
  { body: "Mars" },
  { body: "Deimos" },
  { body: "Phobos" },
];

const links = [
  { source: "Sun", target: "Mars" },
  { source: "Mars", target: "Deimos" },
  { source: "Mars", target: "Phobos" },
];
```

The goal is to plot the nodes and connections, for instance with circles and lines. This is achieved in two steps:

1. draw the necessary visuals

2. run a simulation to update the elements' position

For the simulation use `d3.forceSimulation()`.

```js
const force = d3.forceSimulation(nodes);
```

Add forces to change the nodes position.

Forces are connected to D3 functions from the _d3-force_ module. Forces such as:

- charge: push nodes away from (-) or toward (+) each other

- link: connect nodes together (consider the links array)

- center: push the nodes toward a specific x and y coordinate

```js
const force = d3
  .forceSimulation(nodes)
  .force("charge", d3.forceManyBody().strength(-200))
  .force(
    "link",
    d3.forceLink(links).id((d) => d.body)
  )
  .force(
    "center",
    d3
      .forceCenter()
      .x(size / 2)
      .y(size / 2)
  );
```

Once the simulation is set up the data is modified, `nodes` and `links`, so that the nodes have a velocity (`vx` and `vy`) and a position (`x` and `y`).

```js
{
    "body": "Mars",
    "index": 1,
    "x": 169.15673121265638,
    "y": 349.79798252634413,
    "vy": 0.00046444094003472296,
    "vx": -0.001414957059110836
}
```

The links have a `source` and `target` key, each with a similar structure.

```js
// source
{
    "body": "Mars",
    "index": 1,
    "x": 169.15673121265638,
    "y": 349.79798252634413,
    "vy": 0.00046444094003472296,
    "vx": -0.001414957059110836
}
// target
{
    "body": "Deimos",
    "index": 2,
    "x": 152.14695784173583,
    "y": 402.4101640753646,
    "vy": 0.0005742405884061712,
    "vx": -0.001837542543293243
}
```

Listen to the `tick` event to consider the updated values.

```js
force.on("tick", () => {
  nodesGroups.attr("transform", (d) => `translate(${d.x} ${d.y})`);
});
```

Once the simulation has run its course, the nodes and edges stop moving. It is however possible to resume the simulation on interaction such as when dragging nodes.

```js
nodesGroups.style("cursor", "grab").call(drag);
```

As repeated later in the geomapping section, `call` executes the input function — in this instance `drag` — passing the current selection — the group elements storing the nodes — as argument.

Importantly, call the drag function **on the same** element which you update following the `tick` event — `nodesGroups`. In a previous version I called the function on circle element which I superimposed on the node.

```js
nodesGroups.append("circle").attr("r", 20).attr("opacity", "0").call(drag);
```

But this solution results in a stutter (D3 would update the position of the circle, then the position of the wrapping group element).

For the dragging feature use `d3.drag` and listen to specific events, such as `start`, `end`, `drag`.

```js
const drag = d3
  .drag()
  .on("start", () => {})
  .on("end", () => {})
  .on("drag", () => {});
```

The functions each receive the event as the first argument, the bound datum as the second argument:

- when the drag action starts restart the animation and set an `alphaTarget` greater than 0 (see below)

  ```js
  if (e.active === 0) force.alphaTarget(0.1).restart();
  ```

  `e.active` is 0 when the drag operation has not started, 1 when it is indeed ongoing

- when the drag action ends set the `alphaTarget` to 0

  ```js
  if (e.active === 0) force.alphaTarget(0);
  ```

- when the drag action continues update the node in its `fx` and `fy` field — the two describe a force applied on the individual element

  ```js
  .on("drag", (e, d) => {
    const { x, y } = e;
    d.fx = x;
    d.fy = y;
  })
  ```

---

About `alphaTarget`: D3 runs the simulation on the basis of an alpha value. This value decreases over time toward `alphaTarget` and stops when the value is smaller than or equal to `alphaMin`. Therefore, if `alphaTarget` is greater than `alphaMin` the simulation continues indefinitely.

When the drag action starts you increase `alphaTarget` _and_ restart the animation so that the nodes and edges can move. When the action ends you set it back to 0 to eventually end the simulation.

---

## 10 - Geomapping

Use GeoJSON, a specific format of JSON syntax which summarizes geographical data — think map coordinates.

### Map

Use `d3.geoPath()` with a specific projection.

```js
const path = d3.geoPath().projection(projection);
```

The function transforms map coordinates to the `d` attribute of `<path>` elements.

```js
dataGroup
  .selectAll("path")
  .data(json.features)
  .enter()
  .append("path")
  .attr("d", path);
```

With the projection describe how to plot the coordinates in the 2D space.

```js
const projection = d3.geoAlbersUsa();
```

### Choropleth

Color areas according to a value.

For the colors use `d3.scaleQuantize`. With the function map a continuous domain, from the minimum to the maximum value of the dataset, to a _discrete_ range, picking one of the input colors.

```js
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
```

The data is retrieved from `us-ag-productivity.csv` and added, where possible, to the features in the `json` object.

When drawing the state color the shape per the state's value, or a fallback value if one is not provided (not all states are represented in the csv dataset).

```js
.attr("fill", (d) =>
  d.properties.value ? scaleColor(d.properties.value) : "hsl(0, 0%, 30%)"
)
```

### Points

Given a dataset describing large cities as well as the population and coordinates (longitude and latitude), use the projection to position circles in the appropriate spot.

```js
const [x, y] = projection([d.lon, d.lat]);
```

The projection function receives an array with the longitude and latitude. Based on the two input values the function returns the x and y coordinates.

### Pan

One way to move the map is to translate the projection.

```js
projection.translate([x, y]);
```

Once you update the projection update the visuals and the attributes which rely on said function, for instance the countries.

```js
dataGroup.selectAll("path").transition().attr("d", path);
```

### Drag

Instead of translating the map by fixed measures allow to drag the map with the `d3.drag()` function.

Superimpose a rectangle to track mouse interaction anywhere on the vector.

```js
svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("opacity", "0")
  .style("cursor", "pointer");
```

On the rectangle use the `call` method to pass a drag function - see past the snippet. As with the axis function `call` executes the input function with the current selection - the rectangle.

```js
svg.append("rect").call(drag);
```

For the dragging feature d3.drag allows to set up the behavior by listening to different events: `start`, `end`, `drag`.

```js
const drag = d3.drag().on("drag", (e) => {});
```

The event passed through the function provides dragging details, among which dx and dy for the change in either direction

```js
const drag = d3.drag().on("drag", (e) => {
  const { dx, dy } = e;
});
```

Use these values to translate the elements.

### Zoom

Use` d3.zoom` in place of `d3.drag`.

```js
svg.append("rect").call(zoom);
```

With the function listen to events such as `start`, `end` and `zoom`.

```js
const zoom = d3.zoom().on("zoom", function (e) {});
```

The event provides `x` and `y` coordinates, so you can re-implement the panning feature of the previous section, as well as `k`, a scale factor. The values are available in the `transform` property.

```js
const zoom = d3.zoom().on("zoom", function (e) {
  const { x, y, k } = e.transform;
});
```

Unlike the dragging feature, `d3.zoom` stores the zoom value _in_ the node. Consider how there might be different sections of the visualization at different levels of depth.

Retrieve the zoom value of a node with `d3.zoomTransform()` passing the node as argument (the property itself is stored in the `__zoom` field).

```js
const zoom = d3.zoom().on("zoom", function (e) {
  console.log(d3.zoomTransform(d3.select(this).node()));
});
```

Back to the demo, multiply `k`, the scaling factor, by the initial scale set on the projection.

```js
const initialScale = projection.scale();
```

Update the scale similarly to how you update the translate portion of the same projection function.

```js
projection.translate([x, y]).scale(k * initialScale);
```

Regarding the translated values: the projection has initial values for the `x` and `y` coordinates, meaning the map would immediately jump to the top left corner as the projection contemplates `e.transform.x` and `e.transform.y` as starting from 0. To compensate for this, and on the basis of the desired, initial translation, invoke an additional function to update the values.

```js
const [initialX, initialY] = projection.translate();

svg
  .append("rect")
  .call(zoom)
  .call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY));
```

In this manner `e.transform.x` and `e.transform.y` start from the same coordinate set on the first projection.

`d3.zoomIdentity` creates an identity transform object. one where the scaling factor `k` is 1 and the two coordinates are 0. Consider it a default, a basis transform on top of which you set the desired scale and translate values.

Listening to the `zoom` covers mouse and touch interaction. To reproduce the buttons from the pan section, which update the position by an arbitrary amount, update the zoom directly with the `.translateBy()` method.

```js
svg.select("rect").transition().call(zoom.translateBy, x, y);
```

Manually updating the projection would create a disconnect with the zoom values bound to the element, meaning a following interaction would have the visualization stutter.

To scale by an arbitrary amount use the `.scaleBy()` method.

```js
svg.select("rect").transition().call(zoom.scaleBy, 1.5);
```

To reset the projection apply the same identity matrix used when first calling the `zoom()` function.

```js
svg
  .select("rect")
  .transition()
  .call(zoom.transform, d3.zoomIdentity.translate(initialX, initialY));
```

Finally, constrain the scale and translate values on the `zoom` function itself and through the `.scaleExtent()` and `.translateExtent()` methods.

```js
const zoom = d3
  .zoom()
  .scaleExtent([0.5, 3])
  .translateExtent([
    [width * -1, height * -1],
    [width, height],
  ])
  .on("zoom", function (e) {});
```

### Geographical data

- you need shapefiles with coordinates data; consider [Natural Earth](https://www.naturalearthdata.com/) or more specific sources like the [US states census](https://www.census.gov/geographies/mapping-files.html)

- pick an appropriate resolution

- simplify shapes; consider tools such as [mapshaper](https://mapshaper.org/)

- convert shapefiles to GeoJSON or [TopoJSON](https://github.com/topojson/topojson)

  TopoJSON stores topologies, not geometries, and makes for a more efficient format. If you do choose the format know that ultimately you need the `topojson` library to turn the syntax into the GeoJSON values which D3 understands.

- choose a [projection](https://github.com/d3/d3-geo#projections); different maps require different projects. `geoAlbersUS` might be perfect to highlight the US states, but `geoMercator` might be a better fit for the world's countries

## 11 - Project walk-through

The last chapter focuses on an interactive, stacked area chart. The end result is a visualization highlighting electric cars by type. Click on one of the few types to have the other collapse, and the chosen type broken down in car model.

Instead of creating the same plot, I prefer to practice with a different dataset and overall structure.

For the dataset `dataset.csv` keeps a record of the most 100 frequent names for French babies, males, as documented by the [national institute of statistics and economic studies](https://www.insee.fr/fr/statistiques/3532172)(INSEE).

The script plots a stacked area chart looking at the first letter of the names through the years. Click on a curve to have the other collapse and highlight the names beginning with the specific letter.
