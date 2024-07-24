// First Slide
async function createFirstChart() {
    const margin = {top: 10, right: 20, bottom: 30, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
    const data = await d3.csv("https://raw.githubusercontent.com/nishaj3/nishaj3.github.io/Test/data/gender-wage-gap-vs-gdp-per-capita.csv");
    const year = 2014
    const filteredData = data.filter(function (d) {
        return d.Year == year && d.Population != "" && d.gender_wage_gap != "" && d.GDP_per_capita != "";
    });

    let svg = d3.select("#chart-1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleLinear()
        .domain([5000, 120000])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => "$" + d ));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([-20, 30])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + "%"));

    // Add a scale for bubble size
    const z = getBubbleSizeScale()

    // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
        .domain(getContinentKeys())
        .range(d3.schemeSet2);

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#slide-1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "50px")

    // Add dots
    svg.append('g')
        .selectAll("scatterplot-dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
            return x(Number(d.GDP_per_capita));
        })
        .attr("cy", function (d) {
            return y(Number(d.gender_wage_gap));
        })
        .attr("id", function (d) {
            return "bubble-" + d.Code;
        })
        .attr("r", function (d) {
            return z(Number(d.Population));
        })
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(firstChartTooltipHTML(d));
            tooltip.style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .style("fill", function (d) {
            return myColor(d.Continent);
        });
    createLegend(svg, getContinentKeys(), width, myColor);
    countryCodesToAnnotate().forEach(function () {
        for (let i = 0; i < filteredData.length; i++) {
            if (filteredData[i].code === countryCode) {
                const countryData = filteredData[i];
                createFirstChartAnno(countryData, x(Number(countryData.GDP_per_capita)), y(Number(countryData.gender_wage_gap)), margin);
            }
        }
    })
}

function createFirstChartAnno(d, x, y, margin) {
    const computedDX = d.Entity == "France" ? -30 : 30;
    const computedDY = d.Entity == "France" ? 30 : -30;
    const annotations = [
        {
            note: {
                label: "$" + Math.round(d.GDP_per_capita) + "/year, " + Math.round(d.gender_wage_gap) + "%",
                lineType: "none",
                bgPadding: {"top": 15, "left": 10, "right": 10, "bottom": 10},
                title: d.Entity,
                orientation: "leftRight",
                "align": "middle"
            },
            type: d3.annotationCallout,
            subject: {radius: 30},
            x: x,
            y: y,
            dx: computedDX,
            dy: computedDY
        },
    ];
    const createAnnos = d3.annotation().annotations(annotations);

    d3.select("svg")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "annotation-group")
        .call(createAnnos)
}

function createSecondChartAnnos(d, x, y, margin) {
    const computedDX = d.Entity == "France" ? -30 : 30;
    const computedDY = d.Entity == "France" ? 30 : -30;
    const annotations = [
        {
            note: {
                label: " Male Unemployment: " + Math.round(d.female_unemployment) + "% , Female Unemployment: " + Math.round(d.female_unemployment) + "%",
                lineType: "none",
                bgPadding: {"top": 15, "left": 10, "right": 10, "bottom": 10},
                title: d.Entity,
                orientation: "leftRight",
                "align": "middle"
            },
            type: d3.annotationCallout,
            subject: {radius: 30},
            x: x,
            y: y,
            dx: computedDX,
            dy: computedDY
        },
    ];
    const createAnnos = d3.annotation().annotations(annotations);

    d3.select("svg")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "annotation-group")
        .call(createAnnos)
}


function firstChartTooltipHTML(object) {
    return "<div>" + object.Entity + "</div><div>$" + Math.round(object.GDP_per_capita) + "/year</div><div>" + "</div><div>Unadjusted Gender Wage Gap" + Math.round(object.gender_wage_gap) + "%</div>" + Math.round(object.Population) + "million people</div>";
}

function countryCodesToAnnotate() {
    return ["KOR", "DEU", "USA"]
}

// Second Slide
async function createSecondChart() {
    const margin = {top: 10, right: 20, bottom: 30, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
    const data = await d3.csv("https://nishaj3.github.io/data/unemployment-rate-men-vs-women.csv");
    const year = 2014
    const filteredData = data.filter(function (d) {
        return d.Year == year && d.Population != "" && d.female_unemployment != "" && d.male_unemployment != "";
    });

    let svg = d3.select("#chart-2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 30])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => d + "%"));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 35])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => d + "%"));
    const z = getBubbleSizeScale();

    // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
        .domain(getContinentKeys())
        .range(d3.schemeSet2);

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#chart-2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "50px")

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("id", function (d) {
            return "bubble-" + d.Code;
        })
        .attr("cx", function (d) {
            return x(Number(d.male_unemployment));
        })
        .attr("cy", function (d) {
            return y(Number(d.female_unemployment));
        })
        .attr("r", function (d) {
            return z(Number(d.Population));
        })
        .style("fill", function (d) {
            return myColor(d.Continent);
        })
        // -3- Trigger the functions
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(secondChartTooltipHTML(d));
            tooltip.style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .style("fill", function (d) {
            return myColor(d.Continent);
        });
    createLegend(svg, getContinentKeys(), width, myColor);
    countryCodesToAnnotate().forEach(function (countryCode) {
        for (let i = 0; i < filteredData.length; i++) {
            if (filteredData[i].code === countryCode) {
                const countryData = filteredData[i];
                createSecondChartAnnos(countryData, x(Number(countryData.male_unemployment)), y(Number(countryData.female_unemployment)), margin);
            }
        }
    })
}

function secondChartTooltipHTML(object) {
    return "<div>" + object.Entity + "</div><div> Male Unemployment:" + Math.round(object.male_unemployment) + "\%</div><div> Female Unemployment:" + Math.round(object.female_unemployment) + "%</div>";
}


// Fourth slide
function createFourthChart() {
    // The svg
    const svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

// Map and projection
    const projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([width / 2, height / 2]);

    const tooltip = d3.select("#slide-4")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10")
        .style("color", "white")
        .style("width", "150px")
        .style("height", "50px")

// Data and color scale
    let data = new Map()
    const colorScale = d3.scaleOrdinal()
        .domain(getContinentKeys())
        .range(d3.schemeSet2);

// Load external data and boot
    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        d3.csv("https://nishaj3.github.io/data/female-to-male-ratio-of-time-devoted-to-unpaid-care-work.csv", function (d) {
            if (d.year == 2014) {
                data.set(d.Code,
                    {
                        year: d.Year,
                        Female_to_male_ratio: Number(d.Female_to_male_ratio),
                        name: d.Entity,
                    });
            }
        })
    ]).then(function (loadData) {
        let topo = loadData[0]

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(fourthChartTooltipHTML(data.get(d.id)));
                tooltip.style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px")
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    })

    //createLegend(d3.select("#chart-4"), getContinentKeys(), width, colorScale);

}

function fourthChartTooltipHTML(object) {
    return "<div>" + object.Entity + "</div><div>" + object.Female_to_male_ratio + " </div><div>";
}

// Common functions
function getBubbleSizeScale() {
    // Add a scale for bubble size
    const z = d3.scaleLog()
        .domain([200000, 1310000000])
        .range([1, 30]);
    return z;
}

function createLegend(svg, continentKeys, width, myColor) {
    // Add one dot in the legend for each name.
    svg.selectAll("legend-dots")
        .data(continentKeys)
        .enter()
        .append("circle")
        .attr("cx", width - 100)
        .attr("cy", function (d, i) {
            return 50 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 2)
        .style("fill", function (d) {
            return myColor(d)
        })

    svg.selectAll("legend-labels")
        .data(continentKeys)
        .enter()
        .append("text")
        .attr("x", width + 8 - 100)
        .attr("y", function (d, i) {
            return 50 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d) {
            return myColor(d)
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}

function getContinentKeys() {
    return ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];
}

function getEntities() {
    return ["Argentina", "Australia", "Austria", "Bangladesh", "Barbados", "Belgium", "Brazil", "Bulgaria", "Cambodia", "Canada", "Chile", "China",
        "Colombia", "Costa Rica", "Croatia", "Cyprus", "Czechia", "Denmark", "Ecuador", "Estonia", "Finland", "France", "Germany", "Greece", "Hong Kong",
        "Hungary", "Iceland", "India", "Indonesia", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Latvia", "Lithuania", "Luxembourg", "Malaysia", "Malta",
        "Mexico", "Myanmar", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Peru", "Philippines", "Poland", "Portugal", "Romania", "Russia",
        "Saint Lucia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka",
        "Sweden", "Switzerland", "Taiwan", "Thailand", "Trinidad and Tobago", "Turkey", "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"]
}
