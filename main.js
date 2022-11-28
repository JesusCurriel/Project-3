TaxiData = TripsData

var Companies = new Set()

function getAllColumns(d,set)
{
  d.forEach(element => 
    {
      set.add(element['Company'])
    })
}

getAllColumns(TaxiData, Companies)

AllCompanyData = []

Companies.forEach(element => 
  {
    AllCompanyData[element] = 0;
})



CA = []
OLD = []



function getTotal(d, attribute, value)
{
  let count = 0
  d.forEach(element => 
    {
      if( element[attribute] == value)
      {
        count += 1
      }
    })
  return count
}



function getDensityData(Data,EmptyData)
{
  Total_Pickup = 0
  Total_Dropoff = 0
  size = 0
  for (let i =0; i < 78; i++)
  {
    Total_Pickup = 0
    Total_Dropoff = 0
    Total_Combined = 0
    Company_Count = []
    Companies.forEach(element => 
      {
        Company_Count[element] = 0;
      })
      Data.forEach(element => 
    {
      size += 1
        if( element['Pickup Community Area'] == i)
        {
          Total_Pickup += 1
        }
        if( element['Dropoff Community Area'] == i)
        {
          Total_Dropoff += 1
        }
        Companies.forEach(CompanyName =>
          {
            if( element['Company'] == CompanyName && (element['Pickup Community Area'] == i || element['Dropoff Community Area'] == i))
              {
                Company_Count[CompanyName] += i;
              }
          });
      })
    

    
    communityA = 
    {
      
      "ID": i,
      "Total_Pickup":Total_Pickup,
      "Total_Dropoff": Total_Dropoff,
      "Total_Combined": Total_Dropoff + Total_Pickup,
      "Company_Count": Company_Count


    }
    EmptyData.push(communityA);
    Company_Count = []
  }
}

getDensityData(TaxiData,CA)


var originCounts = d3.rollup(
  TaxiData,
  Group => Group.length,
  d => d.Company
);

function getData(ListOfCommunities, TaxiCompanies, Data)
{
  Company_Count = []
  Companies.forEach(element => 
    {
      Company_Count[element] = 0;
    })
  ListOfCommunities.forEach( Community=>
    {
      TaxiCompanies.forEach( Company=>
        {
          Company_Count[Company] += Data[Community]['Company_Count'][Company]
        })
    })

    return Company_Count
}

var highestVal = Math.max.apply(null, Object.values(AllCompanyData))
var colorScale = d3.scaleQuantize()
            .range(colorbrewer.GnBu[9])
            .domain([0, 1000]);
ElementsClicked = []

function createMap() {

    var map = L.map('map').setView([41.8219,-87.6407], 10);

    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19,}).addTo(map);
    var id = 0;
    function style(feature) {
        

        
        
       
        
        return {

            fillColor: colorScale(CA[feature.properties.objectid]['Total_Combined']),
            weight: 2,
            opacity: 1,
            color: "gray",
            dashArray: '1',
            fillOpacity: .6
        };
    }
    
    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
          weight: 5,
          dashArray: '',
          fillOpacity: 0.7
      });
    
        layer.bringToFront();
        if(!ElementsClicked.includes(e.target.feature.properties.objectid))
    {
        document.getElementById(e.target.feature.properties.objectid).style.backgroundColor = "#66BCF2"
        document.getElementById(e.target.feature.properties.objectid).style.color = "white"
    }
        
    }

    function resetHighlight(e) {

      if ( !ElementsClicked.includes(e.target.feature.properties.objectid))
      {
        var layer = e.target;
        layer.setStyle({
            fillColor: colorScale(CA[e.target.feature.properties.objectid]['Total_Combined']),
            weight: 1,
            opacity: 1,
            dashArray: '0',
            color: "gray",
            fillOpacity: .6
      });
       
        document.getElementById(e.target.feature.properties.objectid).style.backgroundColor = "#4CAF50"
        document.getElementById(e.target.feature.properties.objectid).style.color = "white"
        
      }
      
  }
  function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  function click(e)
  {
    var layer = e.target;
    if(!ElementsClicked.includes(e.target.feature.properties.objectid))
    {

      
      layer.setStyle({
        weight: 5,
        dashArray: '',
        fillColor: "blue",
        fillOpacity: 0.7
    });
    ElementsClicked.push(layer.feature.properties.objectid)
    document.getElementById(e.target.feature.properties.objectid).style.backgroundColor = "#417BA0"
    document.getElementById(e.target.feature.properties.objectid).style.color = "white"
 

    
      
    }
    else
    {

      removeItem(ElementsClicked, layer.feature.properties.objectid);


    }
    getData(ElementsClicked, Companies, CA)
    updateBars(ElementsClicked)
    document.getElementById(e.target.feature.properties.objectid).style.backgroundColor = "#417BA0"
    document.getElementById(e.target.feature.properties.objectid).style.color = "white"

  }

  function onEachFeature(feature, layer) {
     layer._leaflet_id = feature.properties.objectid;
     id += 1;
      layer.on({
          click: click,
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          
      });
    }

    var geojson = L.geoJson(statesData, {style: style, onEachFeature: onEachFeature}).addTo(map);
    createButtons(geojson);
    createBarChart([],geojson)


}
////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                      BAR CHART                                                 */
////////////////////////////////////////////////////////////////////////////////////////////////////


var colorScale = d3.scaleQuantize()
            .range(colorbrewer.GnBu[9])
            .domain([0, 1000]);

function createBarChart(Elements,L) 
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
      
    
      
      if(d3.select(this).attr("fill") != "#2A536E" )
      {
        for(let i = 1; i < 78; i++)
        {

          L.eachLayer(function (layer) {  
            if(layer._leaflet_id == i )
            {
                
                layer.setStyle({fillColor: colorScale(CA[i]['Total_Combined'])}) 
                
            }
           
            
          });
        }

        d3.selectAll('rect').attr("fill", "#3f86a2")
      }
      else
      {
        d3.selectAll('rect').attr("fill", "gray")
        d3.select(this).attr("fill", "#2A536E")
        Company_Name = d3.select(this)['_groups'][0][0].__data__[0]
        Data = TripsData.filter(d => d.Company == Company_Name) 
        Empty = []
        getDensityData(Data,Empty)
        OLD = CA
        max = 0
        CA = Empty
        Object.values(Empty).forEach(entry => {

          if(entry['Total_Combined'] > max)
          {
            max = entry['Total_Combined']
          }
          
            
          })
        console.log(max)

        newcolorScale = d3.scaleQuantize()
            .range(colorbrewer.PuRd[9])
            .domain([0,Math.max(1,max)]);
        for(let i = 1; i < 78; i++)
        {

          L.eachLayer(function (layer) {  
            if(layer._leaflet_id == i )
            {
                
                layer.setStyle({fillColor: newcolorScale(Empty[i]['Total_Combined'])}) 
                
            }
            if( ElementsClicked.includes(i))
            {
              layer.setStyle({fillColor: "blue"}) 
            }

           
            
          });
        }
        

         

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




function init(){
    
    createMap();
   
}

window.onload = init;