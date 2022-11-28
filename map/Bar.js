function createBarChart(Elements) 
{
  Test = [1,2,3,4,5]

  BarData = getData(Elements, Companies, CA)
  const map2 = new Map();

  Object.entries(BarData).forEach(entry => {
    const [key, value] = entry;

    map2.set(key, value);
  });

  var margin = {top: 20, right: 20, bottom: 40, left: 170},
    width = 460,
    height = 400;




var svg = d3.select("#bar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
    .domain([0, Math.max(1,d3.max(Object.values(BarData)))])
    .range([ 0, width]);


svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(0,0)rotate(-45)")
      .style("text-anchor", "end");
  
  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(Object.keys(AllCompanyData))
    .padding(.1);

  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars

  const tooltip = d3.select("body")
  .append("div")
  .attr("class","d3-tooltip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("padding", "15px")
  .style("background", "rgba(0,0,0,0.6)")
  .style("border-radius", "5px")
  .style("color", "#fff")
  .text("a simple tooltip");

  svg.selectAll("myRect")
    .data(map2)
    .enter()
    .append("rect")
    .on("click", function()
    {
      
    
      
      if(d3.select(this).attr("fill") != "#3f86a2" )
      {
        d3.selectAll('rect').attr("fill", "#3f86a2")
      }
      else
      {
        d3.selectAll('rect').attr("fill", "gray")
        d3.select(this).attr("fill", "#2A536E")
        Company_Name = d3.select(this)['_groups'][0][0].__data__[0]
        Data = TripsData.filter(d => d.Company == Company_Name) 
         


        

      }
      

    })
    .on("mouseover", function(d, i) {
      tooltip.html(`${i[1]}`).style("visibility", "visible");
      if(d3.select(this).attr("fill") != "gray")
      {

        d3.select(this).attr("fill", "#2A536E");
      }
      

    })
    .on("mousemove", function(){
      tooltip
        .style("top", (event.pageY-10)+"px")
        .style("left",(event.pageX+10)+"px");
    })
    .attr("x", 0)
    .attr("y", ([origin, count]) => y(origin))
    .attr("width", ([origin, count]) => x(count))
    .attr("height", y.bandwidth() )
    .attr("fill", "#3f86a2")
    .on("mouseout", function() {
      tooltip.html(``).style("visibility", "hidden");
      if(d3.select(this).attr("fill") != "gray")
      {
        
        d3.select(this).attr("fill", "#3f86a2");
      }
      
    });
  
        
  

}
function updateBars(Elements)
{
  var margin = {top: 20, right: 20, bottom: 40, left: 170},
  width = 460,
  height = 400;

  var svg =  d3.select('#bar').select('svg')
  
  const t = svg.transition()
        .ease(d3.easeLinear)
        .duration(200);

  BarData = getData(Elements, Companies, CA)
  const map2 = new Map();

  Object.entries(BarData).forEach(entry => {
    const [key, value] = entry;

    map2.set(key, value);
  });

  var x = d3.scaleLinear()
    .domain([0, Math.max(1,d3.max(Object.values(BarData)))])
    .range([ 0, width]);

  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(Object.keys(AllCompanyData))
    .padding(.1);
    



  svg.select('g').select('yAxis')
  .call(d3.axisLeft(y))
  


  svg.selectAll("rect")
      .data(map2)
      .transition(t)
      .attr("y", ([origin, count]) => y(origin))
      .attr("width", ([origin, count]) => x(count))
      .attr("height", y.bandwidth() )
      .attr("fill", "#3f86a2")




  svg.select('g').select("g")
  .transition(t)
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(0,0)rotate(-45)")
    .style("text-anchor", "end");
    


}