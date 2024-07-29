
// Add a tooltip div to display information
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background-color", "#fff")
  .style("border", "1px solid #ddd")
  .style("border-radius", "4px")
  .style("padding", "10px")
  .style("visibility", "hidden");

// Load the data
d3.csv("data/gender-wage-gap-vs-gdp-per-capita.csv").then(function(data) {
  // Data processing
  data.forEach(d => {
    d[' gender_wage_gap'] = +d[' gender_wage_gap'] || 0;
    d[' GDP_per_capita'] = +d[' GDP_per_capita'] || 0;
  });

  // Define the margins and dimensions
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.select("#plot3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d[' GDP_per_capita'])).nice()
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d[' gender_wage_gap'])).nice()
    .range([height, 0]);

  // Add X axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

  // Add dots
  svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", d => x(d[' GDP_per_capita']))
    .attr("cy", d => y(d[' gender_wage_gap']))
    .style("fill", "#69b3a2")
    .style("stroke", "black")
    .on("mouseover", function(event, d) {
      tooltip.html(`
        <strong>Country:</strong> ${d.Entity}<br/>
        <strong>Year:</strong> ${d.Year}<br/>
        <strong>Wage Gap:</strong> ${d[' gender_wage_gap']}<br/>
        <strong>GDP per Capita:</strong> ${d[' GDP_per_capita']}
      `)
      .style("visibility", "visible");
    })
    .on("mousemove", function(event) {
      tooltip.style("top", (event.pageY + 5) + "px")
        .style("left", (event.pageX + 5) + "px");
    })
    .on("mouseout", function() {
      tooltip.style("visibility", "hidden");
    });
});
