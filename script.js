d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(response){
  drawBarChar(response);
});

function drawBarChar(r)
{
  var data = r.data;
  var paddings = { 
    top: 10,
    bottom: 25,
    left: 90,
    right: 25 
  };
  var height= 550,
      width = 950,
      datalength = data.length,
      barWidth = (width - paddings.left - paddings.right)/ datalength,      
      barPadding = 0;//Math.floor(barWidth /4);
   
  var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","July","Aug","Sep","Oct","Nov","Dec"]; 
  var startDate = new Date(Date.parse(data[0][0]));
  var endDate = new Date(Date.parse(data[data.length -1][0]));
  
  var xscale = d3.scaleTime()
    .domain([startDate,endDate])
    .range([paddings.left , width-paddings.right-barWidth]);
  
  var yscale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){ return d[1];})])
    .range([height-paddings.bottom,paddings.top]);
    
  var xaxis = d3.axisBottom().scale(xscale);
  var yaxis = d3.axisLeft().scale(yscale);
  
  //SVG Container
  var svg = d3.select("svg")
    .attr("height",height)
    .attr("width",width);
  
  //Create X axis   
  svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(0," + (height-paddings.bottom) + ")" )
    .call(xaxis);
  
  //Create Y axis
  svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + paddings.left + ",0)" )
    .call(yaxis)
    .append("text")
    .attr("transform","rotate(-90)")
    .attr("dy","-60")
    .attr("dx","-250")
    .attr("class","label") 
    .text("Gross Domestic Product, USA");
    
  //Create Bars
  var group = svg.append("g")
    .attr("class","bars");
  
  var bars = group.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x",function(d){ return xscale(new Date(Date.parse(d[0]))); })
    //.attr("x",function(d,i){ return i*barWidth})
    .attr("y",function(d){ return yscale(d[1])})
    .attr("height", function(d){ return yscale(0) - yscale(d[1]);})
    .attr("width", barWidth-barPadding);

   //Tooltip
  bars.on("mouseover", function(d) {
      var date = new Date(Date.parse(d[0]));
      var tooltip = d3.select("#tooltip")
        .style("left",d3.event.pageX + "px")
        .style("top",d3.event.pageY + "px")
        .transition()
        .duration(250)
        .style("opacity","0.9");
      
       tooltip.select(".xvalue").text(date.getFullYear() + " - " + month[date.getMonth()] );
       tooltip.select(".yvalue").text(d[1]);
    })
      .on("mouseout", function() {
         d3.select("#tooltip")
           .transition()
           .duration(400)
           .style("opacity","0");
    });
  
  d3.select("#description")
    .append("text")
    .text(r.description);
}