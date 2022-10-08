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

To work around CORS issues you might need a server. `live-server` works as a quick workaround.
