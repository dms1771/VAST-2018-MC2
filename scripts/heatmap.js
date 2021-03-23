window.a = 1998;
window.b = 2016;
var data;
var tickVals = ["Jan-98", "Jan-99", "Jan-00", "Jan-01", "Jan-02", "Jan-03", "Jan-04", "Jan-05", "Jan-06", "Jan-07", "Jan-08", "Jan-09", "Jan-10", "Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16"];
// This runs when the page is loaded

var margin = { top: 30, right: 30, bottom: 60, left: 130};
var width = 800;
  var height = 850;
var svg = d3.select("#heatmap_main")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  
var inner_width = width-margin.left-margin.right;
var inner_height = height-margin.top-margin.bottom;
  
	document.addEventListener('DOMContentLoaded', function() {
		
	var myGroups = [];
console.log("TRYING TO CHANGE");
console.log(height);
console.log(width);
// append the svg object to the body of the page

		
var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", inner_width )
      .attr("height", inner_height )
      .attr("x", 0)
      .attr("y", 0);
	  
var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [inner_width,inner_height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart);
	  
	  
var scatter = svg.append('g')
    .attr("clip-path", "url(#clip)")
  var arr = [];
  var x;
  var xAxis;
  var y;
  Promise.all([d3.csv('data/heatmap-data/heatmap_sorted.csv')]).then(function(values){
   console.log("****************");
  data = values[0];
  console.log(data);
  var keys1 = [];
  var values1 = [];
  console.log(data.length);
  for(var k = 0;k<data.length;k++)
  {
	  x = data[k];
	  keys1.push(x.Index);
	  values1.push(x.Chemical);
  }
  console.log(keys1);
  myGroups = keys1
  var myVars = values1
 x = d3.scaleBand()
    .range([ 0, inner_width ])
    .domain(myGroups)
    .padding(0.05);


xgen = d3.axisBottom(x);

xAxis = svg.append("g")
    .style("font-size", 8)
    .attr("transform", "translate(0," + inner_height + ")")
    .call(d3.axisBottom(x).tickValues(tickVals))
    
y = d3.scaleBand()
	.range([ inner_height, 0 ])
	.domain(myVars)
	.padding(0.05);

svg.append("g")
    .style("font-size", 8)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()
	
var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1,62])


var tooltip = d3.select("body")
	.append("div")
	.attr("class", "tool")
	.style("background-color", "#FFFFE0")
	
	.style("opacity",0.8)
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");
	
  // Three function that change the tooltip when user hover / move / leave a cell
  
scatter.selectAll()
    .data(data, function(d) {return d.Index+':'+d.Chemical;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Index) })
      .attr("y", function(d) { return y(d.Chemical) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", 5 )
      .attr("height", 5 )
      .style("fill", function(d) { return myColor(d.Count)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
	  .on("mouseover", function(d){
		//var country = d.properties.name;
		//console.log(country.toString());
		//console.log(yearData[d.properties.name]);
		
		console.log("GETTING UPDATED");
		return tooltip.style("visibility", "visible")
		              
					  .html("<div style=&quot;background-color:#FFFFE0&quot;><b>"+"Time: "+d.Index+"</b>"+"<p>Chemical:"+d.Chemical+"</p>"+"<p>Number of recordings:"+d.Count+"</p></div>");
					  
		})
	  .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
	.on("mouseout", function(){
		console.log("outing+++++++++++++++++++++++++++++++++++");
		//lineSvg.selectAll("*").remove();
		return tooltip.style("visibility", "hidden");})
		
		scatter
    .append("g")
      .attr("class", "brush")
      .call(brush)
	  .on("dblclick", dblclicked);;

  // A function that set idleTimeOut to null
  

  
  svg.append("text")
        .attr("x", 350)
        .attr("y", 800)
        .attr("text-anchor", "left")
        .style("font-size", "10px")
        .style("fill","gray")
        .text("Year");	
		
svg.append("text")
	.attr("transform", "rotate(-90)")
      .attr("y", -130)
      .attr("x",-35 - (height / 2))
	  .style("font-size", "10px")
	.attr("dy", "1em")
    .style("text-anchor", "middle")
	.style("fill","gray")
    .text("Location");

		
	
  });
  function dblclicked() {
	  console.log("&$&*#*$&#*#()@**$*$%&*$*#");
    x.domain(myGroups);
	console.log(x.domain());
    xAxis.transition().duration(1000).call(d3.axisBottom(x).tickValues(tickVals))
    scatter
      .selectAll("rect")
      .transition().duration(1000)
      .attr("x", function (d) { return x(d.Index); } )
      .attr("y", function (d) { return y(d.Chemical); } )
	window.a = 1998;
	window.b = 2016;
	drawMap();
	loadChart();

	
  }
  
  function updateChart() {
	  var index1;
	  var index2;
	  console.log("INSIDE UPDATE");
	  var idleTimeout
  function idled() {console.log("hhahdhsjkhsjakdhhfjskak"); idleTimeout = null; }

    extent = d3.event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain(myGroups)
	  
    }else{
		console.log("INSIDE else");
		x.invert = function(x1) {
    var domain = this.domain();
    var range = this.range()
    var scale = d3.scaleQuantize().domain(range).range(domain)
    return scale(x1)
};
		
		window.a = x.invert(extent[0]);
		window.b = x.invert(extent[1]);
		index1 = myGroups.indexOf(x.invert(extent[0]));
		index2 = myGroups.indexOf(x.invert(extent[1]));
		var new_domain = myGroups.slice(index1, index2);
      console.log(new_domain);
	  x.domain(new_domain);
      scatter.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
	console.log(x.domain());
	
	window.a = window.a.split("-")[1];
	window.b = window.b.split("-")[1];
	var left = "Jan-"+window.a;
	var right = "Jan-"+window.b;
	console.log(left);
	console.log(right);
	var i1 = tickVals.indexOf(left);
	var i2 = tickVals.indexOf(right);
	var new_tickvals = tickVals.slice(i1, i2);
    xAxis.transition().duration(1000).call(d3.axisBottom(x).tickValues(new_tickvals));
    scatter
      .selectAll("rect")
      .transition().duration(1000)
      .attr("x", function (d) { return x(d.Index); } )
      .attr("y", function (d) { return y(d.Chemical); } )
	let yearMap = new Map();
	i = 98;
	for(var i  = 1998;i<=2016;i++)
	{
		var yx = i.toString();
		var y1 = yx.substr(2,4);
		yearMap[y1] = yx; 
	}
	console.log(yearMap["98"]);
	window.a = parseInt(yearMap[window.a]);
	window.b = parseInt(yearMap[window.b]);
	
	drawMap();
	loadChart();
	
	

    }
  
  
	});