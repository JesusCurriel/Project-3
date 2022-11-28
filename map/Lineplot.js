
		//Read the data
		d3.csv("https://raw.githubusercontent.com/dbarto9/proj3/main/df_multilines2(2).csv").then(function(data) {

			// List of groups (here I have one group per column)
			const allGroup = [1,2,3,4,5,6,7,8,9,10,11,12]

			// Reformat the data: we need an array of arrays of {x, y} tuples
			const MonthYearTaxi = data.map(d=> ({
				Month: d['Month'],
				Day: parseInt(d['Day']),
				n_taxi: parseInt(d['n_taxi'])
			  }))

			  // Reformat the data: we need an array of arrays of {x, y} tuples
			const dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
				return {
				name: (grpName),
				values: MonthYearTaxi.filter(d=>d.Month==grpName)
					.map(function(d) {
					return {Day: (d.Day), n_taxi: d.n_taxi};
				})
				};
			});

			
				const margin = ({top: 10, right: 10, bottom: 50, left: 175});
				const visHeight = 400
				const visWidth = 650

				// A color scale: one color for each group
				const myColor = d3.scaleOrdinal()
				.domain(allGroup)
				.range(d3.schemeSet2);

				const month_set = Array.from(new Set(MonthYearTaxi.map(d=> d.Month)))
				const month_color = d3.scaleOrdinal().domain(month_set).range(d3.schemePaired );

				
				// Add X axis --> it is a date format
				const x = d3.scaleLinear()
				.domain(d3.extent(MonthYearTaxi, d => d.Day)).nice()
				.range([0, visWidth])
				// linear scale from linear values to linear values 
				// extent will return the extenction of the element inside 

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
				
				// set up
				var nData = dataReady
				console.log(d3.select('#line'))
				// append the svg object to the body of the page
				var svg = d3.select("#line")
					.append("svg")
						.attr("width", visWidth + margin.left + margin.right)
						.attr("height", visHeight + margin.top + margin.bottom)

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
				drawData(nData)


				var months = [1,2,3,4,5,6,7,8,9,10,11,12]
					const legend = svg.append('g')
					.attr('transform', `translate(${20})`);
					const rows = legend.selectAll('g')
					.data(months)
					.join('g')
					.attr('transform', (d, i) => `translate(20, ${i * 20})`);
				
				const Month = svg.append('g').attr('transform', `translate(${20})`);
				const label = Month.selectAll('g').data(['']).join('g').attr('transform', (d, i) => `translate(20, ${i * 20})`);

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
						dataDis = dataDis.filter(j => j.name !== d + 0)
						removeData()
						drawData(dataDis)
					}
					else
					{
					
						var newData = dataReady.filter(j => j.name == d + 0)[0]
						dataDis.push(newData)
						
						drawData(dataDis)
				}
					}
                    return svg.node()
			})

			
			