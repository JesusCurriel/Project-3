const df_line = FileAttachment("df_multilines2.csv").csv({typed: true})
const allGroup = [1,2,3,4,5,6,7,8,9,10,11,12]
const MonthYearTaxi = df_line.map(d=> ({
  Month: d['Month'],
  Day: parseInt(d['Day']),
  n_taxi: parseInt(d['n_taxi'])
}))
const // Reformat the data: we need an array of arrays of {x, y} tuples
dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
  return {
    name: (grpName),
    values: MonthYearTaxi.filter(d=>d.Month==grpName)
      .map(function(d) {
        return {Day: (d.Day), n_taxi: d.n_taxi};
    })
  };
});
const margin = ({top: 10, right: 20, bottom: 50, left: 105});
const visHeight = 800
const visWidth = 1000
const month_set = Array.from(new Set(MonthYearTaxi.map(d=> d.Month)))
const month_color = d3.scaleOrdinal().domain(month_set).range(d3.schemePaired );
const x = d3.scaleLinear()
      .domain(d3.extent(MonthYearTaxi, d => d.Day)).nice()
      .range([0, visWidth])
const y = d3.scaleLinear()
      .domain(d3.extent(MonthYearTaxi, d => d.n_taxi)).nice()
      .range([visHeight,0])
const xAxis = (g, scale, label) =>
  g.attr('transform', `translate(0, ${visHeight})`)
      // add axis
      .call(d3.axisBottom(scale))
      // remove baselineMonth_num2020
      .call(g => g.select('.domain').remove())
      // add grid lines
      // references https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
          .attr('stroke', '#d3d3d3')
          .attr('y1', -visHeight)
          .attr('y2', 0))
    // add label
    .append('text')
      .attr('x', visWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text(label)
const yAxis = (g, scale, label) => 
  // add axis
  g.call(d3.axisLeft(scale))
      // remove baseline
      .call(g => g.select('.domain').remove())
      // add grid lines
      // refernces https://observablehq.com/@d3/connected-scatterplot
      .call(g => g.selectAll('.tick line')
        .clone()
          .attr('stroke', '#d3d3d3')
          .attr('x1', 0)
          .attr('x2', visWidth))
    // add label
    .append('text')
      .attr('x', -60)
      .attr('y', visHeight / 2)
      .attr('fill', 'black')
      .attr('dominant-baseline', 'middle')
      .text(label)
  
  lineplot2()
  
  function lineplot2() {
  // set up
  var nData = dataReady

  // hold everything in our plot 
  var svg = d3.select('#line')
      .append('svg')
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom);
    
  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // axes appending elements under 'g' 
  g.append("g").call(xAxis, x, 'Day Of the Month');
  g.append("g").call(yAxis, y, 'Num Taxi');

      // Add the lines
  const line = d3.line()
      .x(d => x(+d.Day))
      .y(d => y(+d.n_taxi))

  function drawData(data){
  g.selectAll("myLines")
      .data(data)
      .join("path")
        .attr("class", d => d.name)
        .attr("d", d => line(d.values))
        .attr("stroke", d => month_color(d.name))
        .style("stroke-width", 4)
        .attr("opacity", 1)
        .style("fill", "none")

  //draw the dots for each datapoint
  g.selectAll("myDots")
    .data(data)    
    .join('g')
      .style("fill", d => month_color(d.name))
      .attr("class", d => d.name)
    .selectAll("myPoints")
      .data(d => d.values)
      .enter()
      .append("circle")
        .attr('opacity', 1)
        .attr("cx", d => x(d.Day))
        .attr("cy", d => y(d.n_taxi))
        .attr("r", 4)
  }
  function removeData()
  {
    d3.select("g").selectAll("*").remove();
    g.append("g").call(xAxis, x, 'Day Of the Month');
    g.append("g").call(yAxis, y, 'Num Taxi');

      // Add the lines
    const line = d3.line()
      .x(d => x(+d.Day))
      .y(d => y(+d.n_taxi))
    
  }
 
  //Definition of legends, squares and months
  label.append('text')
      .attr('font-size', 15)
      .attr('x', -20)
      .attr('y', 40)
      .attr('font-family', 'sans-serif')
      .attr('dominant-baseline', 'middle')
      .text('Months')
  

  
  rows.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('x', 0)
      .attr('y', 60)
      .attr('stroke-width', 2)
      .attr('stroke', d => month_color(d))
      .attr('fill', d => month_color(d))
      .text('0')
      .on('click', onclick);
  
  rows.append('text')
      .attr('font-size', 15)
      .attr('x', -20)
      .attr('y', 70)
      .attr('font-family', 'sans-serif')
      .attr('dominant-baseline', 'middle')
      .text(d => d)

  var dataDis = nData
  var selected = new Map(months.map(d => [d, false]));

  //Definition of interaction on squares
  
  function onclick(event, d) {
    const isSelected = selected.get(d);
    
    // select the square and toggle it
    const square = d3.select(this);
    square.attr('fill', d => isSelected ? month_color(d) :  'white');
    selected.set(d, !isSelected);
  
    // redraw the points
    
    
    
    if(!isSelected)
    {
      dataDis = dataDis.filter(j => j.name !== d + 1)
      removeData()
      drawData(dataDis)
    }
    else
    {
      
      var newData = dataReady.filter(j => j.name == d + 1)[0]
      dataDis.push(newData)
      
      drawData(dataDis)
    }

    
  }


    return svg.node();
}
