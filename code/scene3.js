export function initializeScene3(data) {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#data3-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the data
    const parsedData = data.map(d => ({
        year: +d.Year,
        gap: +d.gender_wage_gap,
        gdp: +d.GDP_per_capita
    })).filter(d => !isNaN(d.gap) && !isNaN(d.gdp));

    console.log('Parsed Data for Scene 3:', parsedData); // Debugging line

    // Set up scales
    const x = d3.scaleLinear()
        .domain(d3.extent(parsedData, d => d.gdp))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.gap)])
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

    // Add points
    svg.selectAll("circle")
        .data(parsedData)
        .enter().append("circle")
        .attr("cx", d => x(d.gdp))
        .attr("cy", d => y(d.gap))
        .attr("r", 5)
        .attr("fill", "blue");

    // Add labels and titles
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("class", "title")
        .text("Gender Wage Gap vs GDP per Capita");

    svg.append("text")
        .attr("transform", `translate(${width / 2},${height + margin.bottom - 5})`)
        .attr("text-anchor", "middle")
        .text("GDP per Capita");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -height / 2)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .text("Gender Wage Gap (%)");
}
