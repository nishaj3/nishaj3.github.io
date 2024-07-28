export function initializeScene1(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#data1-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the data
    const parsedData = data.map(d => ({
        year: +d.Year,
        female_unemployment: +d.female_unemployment,
        male_unemployment: +d.male_unemployment
    })).filter(d => !isNaN(d.female_unemployment) && !isNaN(d.male_unemployment));

    console.log('Parsed Data for Scene 1:', parsedData); // Debugging line

    // Set up scales
    const x = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => Math.max(d.female_unemployment, d.male_unemployment))])
        .nice()
        .range([height, 0]);

    // Add axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Define the line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.female_unemployment));

    const line2 = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.male_unemployment));

    // Add the lines
    svg.append("path")
        .datum(parsedData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    svg.append("path")
        .datum(parsedData)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", line2);

    // Create tooltips
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

    // Add points for tooltip functionality
    svg.selectAll("dot")
        .data(parsedData)
        .enter().append("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.female_unemployment))
        .attr("r", 5)
        .attr("fill", "red")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Year: ${d.year}<br/>Female Unemployment: ${d.female_unemployment}%`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    svg.selectAll("dot2")
        .data(parsedData)
        .enter().append("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.male_unemployment))
        .attr("r", 5)
        .attr("fill", "blue")
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Year: ${d.year}<br/>Male Unemployment: ${d.male_unemployment}%`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Add labels and titles
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .text("Unemployment Rate (Men vs Women)");

    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 5})`)
        .attr("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -height / 2)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .text("Unemployment Rate (%)");

    // Add legend
    svg.append("circle").attr("cx", 800).attr("cy", 10).attr("r", 6).style("fill", "red");
    svg.append("circle").attr("cx", 800).attr("cy", 30).attr("r", 6).style("fill", "blue");
    svg.append("text").attr("x", 820).attr("y", 10).text("Female Unemployment").style("font-size", "15px").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 820).attr("y", 30).text("Male Unemployment").style("font-size", "15px").attr("alignment-baseline","middle");
}
