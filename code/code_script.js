// Dimensions and margins
const margin = { top: 20, right: 30, bottom: 50, left: 70 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip
const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load the data
d3.csv("https://raw.githubusercontent.com/nishaj3/nishaj3.github.io/Test/data/gender-wage-gap-vs-gdp-per-capita.csv").then(data => {

  // Parse data
  data.forEach(d => {
    d.GDPPerCapita = +d['GDP per capita'];
    d.GenderWageGap = +d['Gender wage gap (%)'];
  });

  // Scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.GDPPerCapita)).nice()
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.GenderWageGap)).nice()
    .range([height, 0]);

  // Axes
  const xAxis = svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  const yAxis = svg.append("g")
    .call(d3.axisLeft(yScale));

  // Add labels
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .text("GDP per Capita (USD)");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .text("Gender Wage Gap (%)");

  // Create dots
  const dots = svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.GDPPerCapita))
    .attr("cy", d => yScale(d.GenderWageGap))
    .attr("r", 5)
    .attr("opacity", 0.7)
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", .9);
      tooltip.html(`Country: ${d['Entity']}<br>GDP Per Capita: $${d.GDPPerCapita}<br>Wage Gap: ${d.GenderWageGap}%`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  // Create the slideshow
  let currentIndex = 0;
  const entities = Array.from(new Set(data.map(d => d.Entity)));

  function updatePlot() {
    const currentCountry = entities[currentIndex];
    const filteredData = data.filter(d => d.Entity === currentCountry);

    dots.data(filteredData)
      .transition()
      .duration(1000)
      .attr("cx", d => xScale(d.GDPPerCapita))
      .attr("cy", d => yScale(d.GenderWageGap));

    currentIndex = (currentIndex + 1) % entities.length;
  }

  setInterval(updatePlot, 3000); // Change every 3 seconds
});
