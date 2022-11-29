


Payments = ["Credit Card", "Mobile", "Cash"]
//Payments array for legend

data_columns = ["Fare","Tips","Extras"]
//array to for matrix
width = 900
padding = 28
size = (width - (data_columns.length + 1) * padding) / data_columns.length + padding


  function compareTime( a, b ) {
    if ( a.Extras < b.Extras ){
      return -1;
    }
    if ( a.Extras > b.Extras ){
      return 1;
    }
    return 0;
  }

  function compareTips( a, b ) {
    if ( a.Tips < b.Tips ){
      return -1;
    }
    if ( a.Tips > b.Tips ){
      return 1;
    }
    return 0;
  }

  function compareFare( a, b ) {
    if ( a.Fare > b.Fare ){
      return -1;
    }
    if ( a.Fare < b.Fare ){
      return 1;
    }
    return 0;
  }


  function filterData(data){
    var d = data.map(d => ({
      ID : d["Trip ID"],
      Time : d["Trip Seconds"],
      Tips : d["Tips"],
      Miles : d["Trip Miles"],
      Extras : d['Extras'],
      Fare: d["Fare"],
      Payment: d["Payment Type"],
      Company: d["Company"],
      Total: d["Trip Total"]
      
    })).filter(d => d.ID !== null && d.Time !== null && Number(d.Time) !== 0 && d.Miles !== null && Number(d.Miles) !== 0 && d.Fare !== null && Number(d.Fare) !== 0 && d.Payment !== "Unknown" && d.Payment !== "Prcard" && d.Payment !== "No Charge" && d.Payment !== "Dispute" );
    


    var data_sorted = d.sort(compareTime);
    var l = data_sorted.length;
    var low = Math.round(l * 0.1);
    var high = l - low;
    var data2 = data_sorted.slice(low,high);
    
    var data_sorted2 = data2.sort(compareTips);
    var l2 = data_sorted2.length;
    var low2 = Math.round(l2 * 0.1);
    var high2 = l2 - low2;
    var data3 = data_sorted2.slice(low2,high2);
    
    var data_sorted3 = data3.sort(compareFare);
    var l3 = data_sorted3.length;
    var low3 = Math.round(l3 * 0.1);
    var high3 = l3 - low3;
    var data3 = data_sorted3.slice(low3,high3);
    
    return data3
    }


data = filterData(TripsData)
console.log(data.length)




x = data_columns.map(c => d3.scaleLinear()
    .domain(d3.extent(data, d => d[c]))
    .rangeRound([padding / 2, size - padding / 2]))

y = x.map(x => x.copy().range([size - padding / 2, padding / 2]))


z = d3.scaleOrdinal().domain(Payments).range(d3.schemeCategory10);//color for graph


    //function for brush function 
function brush(cell, circle, svg) {
    const brush = d3.brush()
        .extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]])
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);
  
    cell.call(brush);
  
    let brushCell;
  
    // Clear the previously-active brush, if any.
    function brushstarted() {
      if (brushCell !== this) {
        d3.select(brushCell).call(brush.move, null);
        brushCell = this;
      }
    }
  
    // Highlight the selected circles.
    function brushed({selection}, [i, j]) {
      let selected = [];
      if (selection) {
        const [[x0, y0], [x1, y1]] = selection; 
        circle.classed("hidden",
          d => x0 > x[i](d[data_columns[i]])
            || x1 < x[i](d[data_columns[i]])
            || y0 > y[j](d[data_columns[j]])
            || y1 < y[j](d[data_columns[j]]));
        selected = data.filter(
          d => x0 < x[i](d[data_columns[i]])
            && x1 > x[i](d[data_columns[i]])
            && y0 < y[j](d[data_columns[j]])
            && y1 > y[j](d[data_columns[j]]));
      }
      svg.property("value", selected).dispatch("input");
    }
  
    // If the brush is empty, select all circles.
    function brushended({selection}) {
      if (selection) return;
      svg.property("value", []).dispatch("input");
      circle.classed("hidden", false);
    }
  }


//xAxis 
function xAxis(g){
    const axis = d3.axisBottom()
        .ticks(6)
        .tickSize(size * data_columns.length);
    return g => g.selectAll("g").data(x).join("g")
        .attr("transform", (d, i) => `translate(${i * size},0)`)
        .each(function(d) { return d3.select(this).call(axis.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
  }


//y Axis
function yAxis(g){
    const axis = d3.axisLeft()
        .ticks(6)
        .tickSize(-size * data_columns.length);
    return g => g.selectAll("g").data(y).join("g")
        .attr("transform", (d, i) => `translate(0,${i * size})`)
        .each(function(d) { return d3.select(this).call(axis.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));
  }


  function Scatter(){
    //Creating the dimension of the SVG
    

  
    console.log(d3.select("#scatter"))
    console.log(d3.select("*"))
    console.log(d3.select("body"))
    var svg = d3.select("body").append('svg')
      .attr("viewBox", [-padding -600, -100, 2200, 2200]);
  
    svg.append("style")
        .text(`circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }`);
  
    svg.append("g")
        .call(xAxis(this));
  
    svg.append("g")
        .call((yAxis(this)));
    

    
  //Data consistent with data columns ['Tips','Fare','Extras']
  //[0,0] = ['Tips','Tips']
  //These would be the two axes in that scatter plot
  //each scatterplot will be placed on it's own cell determined by i and j 
    const g = svg.append("g")
      .selectAll("g")
      .data([[0,0],[1,1],[2,2],[0,1],[1,2],[2,0],[1,0],[2,1],[0,2]])
      .join("g")
        .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);
  
    g.append("rect")
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("x", padding / 2 + 0.5)
        .attr("y", padding / 2 + 0.5)
        .attr("width", size - padding)
        .attr("height", size - padding);
  //function to draw all the points, going through all cells and drawing the circles in the corresponding cells
  function drawPoints(data) {
      g.each(function([i, j]) {
      d3.select(this).selectAll("circle")
        .data(data.filter(d => !isNaN(d[data_columns[i]]) && !isNaN(d[data_columns[j]])))
        .join("circle")
          .attr("cx", d => x[i](d[data_columns[i]]))
          .attr("cy", d => y[j](d[data_columns[j]]));
      });
      const circle = g.selectAll("circle")
        .attr("r", 3.5)
        .attr("fill-opacity", 1)
        .attr("fill", d => z(d.Payment));
  
    g.call(brush, circle, svg);
  
    }
  
    
    drawPoints(data);
  
  
  
    //Code for legend and text
    
    const legend = svg.append('g')
        .attr('transform', `translate(${20})`);
  
    const labels = legend.selectAll('g')
      .data([''])
      .join('g')
        .attr('transform', (d, i) => `translate(20, ${i * 20})`);
  
    var q = 3
    
   
    labels.append('text')
        .attr('font-size', 25)
        .attr('x', -120)
        .attr('y', 145)
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text('Fare')
    labels.append('text')
        .attr('font-size', 25)
        .attr('x', -120)
        .attr('y', 145*q)
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text('Tips')
  
    labels.append('text')
        .attr('font-size', 25)
        .attr('x', -120)
        .attr('y', 145*(q+2))
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text('Extras')
  
      labels.append('text')
        .attr('font-size', 25)
        .attr('x', 100)
        .attr('y', -30)
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text('Fare')
    labels.append('text')
        .attr('font-size', 25)
        .attr('x', 400)
        .attr('y', -30)
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text('Tips')
  
    labels.append('text')
        .attr('font-size', 25)
        .attr('x', 700)
        .attr('y', -30)
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text('Extras')
    
    const rows = legend.selectAll('g')
      .data(Payments)
      .join('g')
        .attr('transform', (d, i) => `translate(20, ${i * 20})`);
    
    rows.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('x', -120)
        .attr('stroke-width', 2)
        .attr('stroke', d => z(d))
        .attr('fill', d => z(d))
        .on('click', onclick);
    
    rows.append('text')
        .attr('font-size', 15)
        .attr('x', -100)
        .attr('y', 7.5)
        .attr('font-family', 'sans-serif')
        .attr('dominant-baseline', 'middle')
        .text(d => d)
    
    const selected = new Map(Payments.map(d => [d, true]));
    //Function to make legend interactive and filter data
    function onclick(event, d) {
      const isSelected = selected.get(d);
      
      // select the square and toggle it
      const square = d3.select(this);
      square.attr('fill', d => isSelected ? 'white' : z(d));
      selected.set(d, !isSelected);
      
      // redraw the points
      drawPoints(data.filter(d => selected.get(d.Payment)));
    }
    

    console.log(svg.node())
    return svg.node();
    
  }

window.onload = Scatter();