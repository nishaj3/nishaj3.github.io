export function initializeScene2(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#data2-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the data
    const parsedData = data.map(d => ({
        year: +d.Year,
        ratio: +d.Female_to_male_ratio
    })).filter(d => !isNaN(d.ratio));

    console.log('Parsed Data for Scene 2:', parsedData); // Debugging line

    // Set up scales
    const x = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.ratio)])
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

    // Add line
    svg.append("path")
        .datum(parsedData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.year))
            .y(d => y(d.ratio))
        );

    // Add labels and titles
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .text("Female to Male Ratio of Time Devoted to Unpaid Care Work");

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
        .text("Ratio");
}
