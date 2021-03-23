var boxMargin = { top: 30, right: 10, bottom: 60, left: 0 };
var width_box = 30;
var boxplotSvg;
var boxInnerWidth;
let  chemicalUrl = {
  Arsenic : "data/boxplot-data/arsenic_data.csv",
  Aluminum : "data/boxplot-data/aluminium_data.csv",
  Ammonium : "data/boxplot-data/ammonium_data.csv",
  Barium : "data/boxplot-data/barium_data.csv",
  Cadmium : "data/boxplot-data/cadmium_data.csv",
  Chromium : "data/boxplot-data/chromium_data.csv",
  Copper : "data/boxplot-data/copper_data.csv",
  Lead : "data/boxplot-data/lead_data.csv",
  Mercury :"data/boxplot-data/mercury_data.csv",
    }
// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    boxplotSvg= d3.select("#box");
    boxWidth = +boxplotSvg.style('width').replace('px','');
    boxHeight = +boxplotSvg.style('height').replace('px','');
    boxInnerWidth = boxWidth - boxMargin.left - boxMargin.right;
    boxInnerHeight = boxHeight - boxMargin.top - boxMargin.bottom;
    console.log(boxInnerHeight);
	  console.log(boxInnerWidth);
    drawBoxPlot();
    document.getElementById("chemical-input").addEventListener("change", function() {
        drawBoxPlot();
    });
});

function drawBoxPlot() {
    boxplotSvg.selectAll("*").remove();
    var chemical = document.getElementById('chemical-input').value;
    console.log("Chemical- " + chemical);
    d3.csv(chemicalUrl[chemical]).then(function(data) {
     console.log(data);
      var boxes_data = d3.nest() 
        .key(function(d) { return d.location;})
        .rollup(function(d) {
          q3 = d3.quantile(d.map(function(i) { return i.value;}).sort(d3.ascending),.75)
          q1 = d3.quantile(d.map(function(i) { return i.value;}).sort(d3.ascending),.25)
          median = d3.quantile(d.map(function(i) { return i.value;}).sort(d3.ascending),.5)
          interQuantileRange = q3 - q1
          max = d3.max(d.map(function(i) { return i.value;}).sort(d3.ascending))
          min = d3.min(d.map(function(i) { return i.value;}).sort(d3.ascending))
          return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(data)
		console.log("IN BOX PLOT DATA");
		console.log(boxes_data);
        var x = d3.scaleBand()
        .range([ 50, boxInnerWidth ])
        .domain(['Boonsri', 'Kannika', 'Chai', 'Kohsoom', 'Somchair', 'Sakda','Busarakhan', 'Tansanee', 'Achara', 'Decha'])
        .paddingInner(1)
        .paddingOuter(.5)
      boxplotSvg.append("g")
        .attr("transform", "translate(0," + boxInnerHeight + ")")
        .call(d3.axisBottom(x))
    
        var color = d3.scaleOrdinal().range(["b33040", "#d25c4d", "#f2b447", "#d9d574","DE711B","#0DBB7C","#1D82DC","#D3B0C6","#A1AD12","#9B5E9B"]);
      console.log("BOX DEBUG");
      console.log(boxInnerWidth);
      console.log(boxInnerHeight);
	
        var y = d3.scaleLinear()
        .domain([d3.min(data,function(d){return d.value}),d3.max(data,function(d){return d.value})])
        .range([boxInnerHeight, 10])
		var a = 30;
        boxplotSvg.append("g").attr("transform", "translate("+ 50+",0)" ).call(d3.axisLeft(y));
    
        boxplotSvg.selectAll("vertLines")
        .data(boxes_data)
        .enter()
        .append("line")
          .attr("stroke", "grey")
          .attr("y1", function(d){return(y(d.value.min))})
          .attr("y2", function(d){return(y(d.value.max))})
          .attr("x1", function(d){return(x(d.key))})
          .attr("x2", function(d){return(x(d.key))})
          .style("width", 20)
     
      var boxplot_tooltipDiv = d3.select("body").append("div")
          .attr("class","tooltip-boxplot")
          .style("opacity",0);

      boxplotSvg
        .selectAll("box")
        .data(boxes_data)
        .enter()
        .append("rect")
            .attr("stroke", "grey")
            .attr("y", function(d){return(y(d.value.q3))})
            .attr("x", function(d){return(x(d.key)-width_box/2)})
            .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
            .attr("width", width_box )
            .style("fill", (d,i) => color(i))
        .on("mouseover",function(d){
          boxplot_tooltipDiv.transition()
              .duration(200)
              .style("opacity",0.9);
              boxplot_tooltipDiv.html("Max: "+ d.value.max+"<br/>"+"Q3: "+d.value.q3+"<br/>"+"Min: "+d.value.min+"<br/>"+"Median: "+d.value.median+"<br/>"+"Q1: "+d.value.q1)
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
        })
      .on("mouseout", function(d) {		
        boxplot_tooltipDiv.transition()		
              .duration(500)		
              .style("opacity", 0);	
        });
    
      boxplotSvg
        .selectAll("medianLines")
        .data(boxes_data)
        .enter()
        .append("line")
          .attr("x1", function(d){return(x(d.key)-width_box/2) })
          .attr("x2", function(d){return(x(d.key)+width_box/2) })
          .attr("y1", function(d){return(y(d.value.median))})
          .attr("y2", function(d){return(y(d.value.median))})
          .attr("stroke", "grey")
          .style("width", 20)
		  
	boxplotSvg.append("text")
    .attr("class", "axisLabel")
    .attr("x", (boxInnerWidth/2)+20)
    .attr("y", boxHeight-50)
    .style("text-anchor", "middle")
	.style("fill","gray")
    .text("Location");
	
	boxplotSvg.append("text")
	.attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("x",-35 - (boxInnerHeight / 2))
	.attr("dy", "1em")
    .style("text-anchor", "middle")
	.style("fill","gray")
    .text("Measurement");
        
    })
}
