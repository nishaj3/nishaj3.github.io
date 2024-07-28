const marginLine = { top: 20, right: 30, bottom: 80, left: 60 },
  widthLine = 1100 - marginLine.left - marginLine.right,
  heightLine = 500 - marginLine.top - marginLine.bottom;

const svgLine = d3
  .select("#lineGraph")
  .append("svg")
  .attr("width", widthLine + marginLine.left + marginLine.right)
  .attr("height", heightLine + marginLine.top + marginLine.bottom)
  .append("g")
  .attr("transform", `translate(${marginLine.left}, ${marginLine.top})`);

d3.csv(
  "data/female-to-male-ratio-of-time-devoted-to-unpaid-care-work.csv"
).then(function (data) {
  data.forEach(function (d) {
    d.Female_to_male_ratio = +d.Female_to_male_ratio;
  });

  const xLine = d3
    .scalePoint()
    .domain(data.map((d) => d.Entity))
    .range([0, widthLine])
    .padding(1);

  const yLine = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Female_to_male_ratio)])
    .range([heightLine, 0]);

  svgLine
    .append("g")
    .attr("transform", `translate(0,${heightLine})`)
    .call(d3.axisBottom(xLine).tickSizeOuter(0));

  svgLine.append("g").call(d3.axisLeft(yLine));

  const line = d3
    .line()
    .x((d) => xLine(d.Entity))
    .y((d) => yLine(d.Female_to_male_ratio));

  svgLine
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("width", "120px")
    .style("height", "28px")
    .style("padding", "2px")
    .style("font", "12px sans-serif")
    .style("background", "lightsteelblue")
    .style("border", "0px")
    .style("border-radius", "8px")
    .style("pointer-events", "none");

  svgLine
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", (d) => xLine(d.Entity))
    .attr("cy", (d) => yLine(d.Female_to_male_ratio))
    .on("mouseover", function (event, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip
        .html(d.Entity + "<br/>" + d.Female_to_male_ratio)
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });
});
