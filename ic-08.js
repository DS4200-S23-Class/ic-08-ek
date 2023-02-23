// set the dimensions of the canvas
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand().range([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);

// create the svg canvas
var svg = d3.select("#bar-chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// read the data from CSV file
d3.csv("bar-data.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.Value = +d.Value;
  });

  // set the domains of x and y
  x.domain(data.map(function(d) { return d.Category; }));
  y.domain([0, d3.max(data, function(d) { return d.Value; })]);

  // draw the x axis
  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));

  // draw the y axis
  svg.append("g")
     .call(d3.axisLeft(y));

  // draw the bars
  var bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.Category); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d.Value); })
                .attr("height", function(d) { return height - y(d.Value); })
                .on("mouseover", function(d) { // highlight the bar on hover
                  d3.select(this).classed("highlight", true);
                  // show the tooltip with the bar's values
                  d3.select("#tooltip")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .html("<strong>" + d.Category + "</strong><br>" + d.Value);
                  d3.select("#tooltip").classed("hidden", false);
                })
                .on("mouseout", function(d) { // unhighlight the bar on mouseout
                  d3.select(this).classed("highlight", false);
                  d3.select("#tooltip").classed("hidden", true);
                });
});

// create the tooltip
var tooltip = d3.select("#bar-chart")
                .append("div")
                .attr("id", "tooltip")
                .attr("class", "hidden")
                .html("");
