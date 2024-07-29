d3.csv('data/gender-wage-gap-vs-gdp-per-capita.csv').then(function(data) {
  // Filter data for the year 2015
  const filteredData = data.filter(d => d.Year === '2015');

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select('#plot3')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => +d[' GDP_per_capita']))
      .range([0, width]);

  svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

  const y = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => +d[' gender_wage_gap']))
      .range([height, 0]);

  svg.append('g')
      .call(d3.axisLeft(y));

  const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

  svg.append('g')
      .selectAll('dot')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('cx', d => x(+d[' GDP_per_capita']))
      .attr('cy', d => y(+d[' gender_wage_gap']))
      .attr('r', 3)
      .style('fill', '#69b3a2')
      .on('mouseover', function(event, d) {
          tooltip.transition()
              .duration(200)
              .style('opacity', .9);
          tooltip.html(`Country: ${d.Entity}<br>GDP per capita: ${d[' GDP_per_capita']}<br>Wage gap: ${d[' gender_wage_gap']}`)
              .style('left', (event.pageX + 5) + 'px')
              .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
          tooltip.transition()
              .duration(500)
              .style('opacity', 0);
      });
});
