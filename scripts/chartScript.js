const margin = { top: 10, right: 30, bottom: 50, left: 50 },
  width = 1100 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#visualization")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/gender-wage-gap-vs-gdp-per-capita.csv").then((data) => {
  const x = d3.scaleLinear().domain([4000, 100000]).range([0, width]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  const y = d3.scaleLinear().domain([-20, 40]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  const z = d3.scaleSqrt().domain([200000, 1400000000]).range([4, 50]);

  const myColor = d3
    .scaleOrdinal()
    .domain([
      "Africa",
      "Asia",
      "Europe",
      "North America",
      "Oceania",
      "South America",
    ])
    .range(d3.schemeSet2);

  const tooltip = d3
    .select("#visualization")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute");

  const mouseover = function (event, d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
  };
  const mousemove = function (event, d) {
    tooltip
      .html(
        `Country: ${d.country}<br>GDP Per Capita: ${d.GDP_per_capita}%<br>Gender Wage Gap: ${d.gender_wage_gap}%`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 30 + "px");
  };
  const mouseleave = function (event, d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("class", "bubbles")
    .attr("cx", (d) => x(d.GDP_per_capita))
    .attr("cy", (d) => y(d.gender_wage_gap))
    .attr("r", 0)
    .style("fill", (d) => myColor(d.continent))
    .style("opacity", "0.7")
    .attr("stroke", "white")
    .attr("margin", "10px")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .transition()
    .duration(1000)
    .attr("r", (d) => z(d.population));

  // Add country names
  svg
    .append("g")
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", (d) => x(d.GDP_per_capita))
    .attr("y", (d) => y(d.gender_wage_gap))
    .text((d) => d.country)
    .attr("font-size", "8px")
    .attr("fill", (d) => myColor(d.continent))
    .attr("text-anchor", "top")
    .attr("dy", ".35em")
    .style("pointer-events", "none");
});
