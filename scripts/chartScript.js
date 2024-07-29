const marginV3 = { top: 20, right: 30, bottom: 50, left: 60 },
  widthV3 = 1100 - marginV3.left - marginV3.right,
  heightV3 = 200 - marginV3.top - marginV3.bottom;

const chartSvg = d3
  .select("#chart")
  .append("svg")
  .attr("width", widthV3 + marginV3.left + marginV3.right)
  .attr("height", heightV3 + marginV3.top + marginV3.bottom)
  .append("g")
  .attr("transform", `translate(${marginV3.left}, ${marginV3.top})`);

const chartTooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltipV3")
  .style("opacity", 0);

d3.csv("data/gender-wage-gap-vs-gdp-per-capita.csv").then((data) => {
  const countries = Array.from(new Set(data.map((d) => d.Entity))).sort();
  console.log("countries", countries);
  const select = d3.select("#countrySelect");


  select
    .selectAll("option")
    .data(countries)
    .enter()
    .append("option")
    .text((d) => d)
    .attr("value", (d) => d);

  updateChart(countries[0]);

  select.on("change", function () {
    updateChart(this.value);
  });

  function updateChart(country) {
    const countryData = data
      .filter((d) => d.Entity === country && Number(d.Year) === 2015);

    if (countryData.length === 0) {
      chartSvg.selectAll("*").remove();
      chartSvg
        .append("text")
        .attr("x", widthV3 / 2)
        .attr("y", heightV3 / 2)
        .attr("text-anchor", "middle")
        .text("No data available for this country from 2015 onward.");
      return;
    }

    const x = d3
      .scaleLinear()
      .domain(d3.extent(countryData, (d) => Number(d.Year)))
      .range([0, widthV3]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(countryData, (d) => Number(d.GDP_per_capita))])
      .range([heightV3, 0]);

    chartSvg.selectAll("g.axis").remove();
    chartSvg
      .append("g")
      .attr("transform", `translate(0,${heightV3})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .attr("class", "axis");

    chartSvg.append("g").call(d3.axisLeft(y)).attr("class", "axis");

    const line = d3
      .line()
      .x((d) => x(Number(d.Year)))
      .y((d) => y(Number(d.GDP_per_capita)));

    chartSvg.selectAll(".line").remove();
    chartSvg
      .append("path")
      .datum(countryData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line)
      .attr("class", "line");

    chartSvg.selectAll("circle").remove();
    chartSvg
      .selectAll("circle")
      .data(countryData)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", (d) => x(Number(d.Year)))
      .attr("cy", (d) => y(Number(d.GDP_per_capita)))
      .on("mouseover", (event, d) => {
        console.log("d", d);
        chartTooltip
          .style("opacity", 1)
          .html(`Year: ${d.Year}<br>GDP/Capita: ${d.GDP_per_capita || "n/a"}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px")
          .style("transition", "300ms");
        d3.select(event.currentTarget).attr("r", 20);
      })
      .on("mouseout", (event, d) => {
        chartTooltip.style("opacity", 0);
        d3.select(event.currentTarget).attr("r", 5);
      });
  }
});
