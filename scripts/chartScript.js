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
  // Filter data for the year 2015
  const data2015 = data.filter((d) => Number(d.Year) === 2015);

  // Set up x and y scales
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data2015, (d) => +d.GDP_per_capita)])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data2015, (d) => +d.gender_wage_gap)])
    .range([height, 0]);

  // Add axes
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(10));

  svg.append("g").call(d3.axisLeft(y));

  // Define color scale based on continent
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

  // Tooltip setup
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
        `Country: ${d.Entity}<br>GDP/Capita: ${d.GDP_per_capita}<br>Gender Wage Gap: ${d.gender_wage_gap}%`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 30 + "px");
  };

  const mouseleave = function (event, d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
  };

  // Draw the scatter plot circles
  svg
    .append("g")
    .selectAll("circle")
    .data(data2015)
    .join("circle")
    .attr("class", "bubbles")
    .attr("cx", (d) => x(+d.GDP_per_capita))
    .attr("cy", (d) => y(+d.gender_wage_gap))
    .attr("r", (d) => {
      const population = +d.Population;
      return population ? Math.sqrt(population) / 1000 : 5; // Scale population for circle radius
    })
    .style("fill", (d) => myColor(d.Continent))
    .style("opacity", "0.7")
    .attr("stroke", "white")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // Add country names
  svg
    .append("g")
    .selectAll("text")
    .data(data2015)
    .join("text")
    .attr("x", (d) => x(+d.GDP_per_capita))
    .attr("y", (d) => y(+d.gender_wage_gap))
    .text((d) => d.Entity)
    .attr("font-size", "8px")
    .attr("fill", (d) => myColor(d.Continent))
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .style("pointer-events", "none");
});
