var lineNonChemicalSvg;
var lineNonChemicalWidth;
var lineNonChemicalHeight;
var lineInnerHeight;
var lineInnerWidth;
var lineMargin = { top: 20, right: 60, bottom: 80, left: 100 };

var data;
var unitData;
var listOfChemicals;
var unitList;
var selectedUnitRow;
var selectedUnit;
var filterChemicalData;
var listOfLocations = ['Boonsri', 'Kannika', 'Chai', 'Kohsoom', 'Somchair', 'Sakda','Busarakhan', 'Tansanee', 'Achara', 'Decha'];

var selectedYExtent;
var xDateExtent;

var selectedChemical;

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  lineNonChemicalSvg = d3.select('#linechart-nonchemical');
  lineNonChemicalWidth = +lineNonChemicalSvg.style('width').replace('px','');
  lineNonChemicalHeight = +lineNonChemicalSvg.style('height').replace('px','');;
  console.log(lineNonChemicalHeight)
  console.log(lineNonChemicalWidth)
  lineInnerWidth = lineNonChemicalWidth - lineMargin.left - lineMargin.right;
  lineInnerHeight = lineNonChemicalHeight - lineMargin.top - lineMargin.bottom;
  Promise.all([d3.csv('data/linechart-data/Boonsong_Lekagul_waterways_readings.csv'),
               d3.csv('data/linechart-data/chemical_units_min_max.csv')])
          .then(function(values){

    data = values[0];
    unitData = values[1];
    // drawReset();

    unitData.forEach(function(d) {
        d.min = +d.min
        d.max = +d.max
    });

    listOfChemicals = unitData.map(function(d){ 
      return d['measure'];
    });
    unitList = unitData.map(function(d){ 
      return d['unit'];
    });
    // console.log(listOfChemicals)

    // 11-Jan-98, %-d-%b-%y
    var parseDate = d3.timeParse("%-d-%b-%y");
    data.forEach(function(d) {
      d.value = +d.value
      d['sample date'] = parseDate(d['sample date']);
    });

    const chemicalSelect = document.getElementById("chemical-select");
    chemicalSelect.addEventListener('change', updateChemical);
    //set default Chemical
    selectedChemical = 'Dissolved oxygen';
    // var catOptions = "";
    // for (categoryId in listOfChemicals) {
    //     catOptions += "<option>" + listOfChemicals[categoryId] + "</option>";
    // }
    // chemicalSelect.innerHTML = catOptions;

    xDateExtent = [parseDate('11-Jan-98'), parseDate('31-Dec-16')]
    console.log(xDateExtent)
  
    filterChemical();
    updateAxis();
    reDraw();
  })
});

function updateChemical() {
  selectedChemical = document.getElementById("chemical-select").value;
  console.log("new chemical selected :");
  console.log(selectedChemical);
  filterChemical();
  updateAxis();
  reDraw();
}

function filterChemical() {
  filterChemicalData = data.filter(function(d){ return  (d['measure'] == selectedChemical) });
  selectedUnitRow = unitData.filter(function(d){ return  (d['measure'] == selectedChemical) });
  console.log(selectedUnitRow)
}

function updateAxis() {
  selectedUnit = selectedUnitRow[0]['unit']
  var min = selectedUnitRow[0]['min']
  var max = selectedUnitRow[0]['max']

  console.log(selectedUnitRow[0]['max'])
  console.log(selectedUnitRow[0]['min'])
  console.log(selectedUnitRow[0]['unit'])

  selectedYExtent = [min, max];
  
}

function reDraw() {
  console.log(lineNonChemicalHeight)
  console.log(lineNonChemicalWidth)
  d3.select("#linechart-nonchemical").selectAll("g > *").remove()
  d3.select("#linechart-nonchemical").selectAll("path").remove()
  d3.select("#linechart-nonchemical").selectAll("mylabels").remove()
  d3.select("#linechart-nonchemical").selectAll("mydots").remove()

  var groupByCityData = d3.nest()
    .key(function(d) { return d.location;})
    .entries(filterChemicalData);
  var res = groupByCityData.map(function(d){ return d.key })
  var color = d3.scaleOrdinal(d3.schemeSet2)
  .domain(res);
  console.log(res);
  var x = d3.scaleTime()
    .domain(xDateExtent)
    .range([lineMargin.left, lineNonChemicalWidth - lineMargin.right]);

  var xAxis = d3.axisBottom(x)
    .ticks(d3.timeMonth.every(4))
    .tickFormat(d3.timeFormat("%b - %Y"));

  var xAxis = lineNonChemicalSvg.append("g")
    .attr("transform", "translate(0," + (lineNonChemicalHeight - lineMargin.bottom- lineMargin.top) + ")")
    .attr("color","grey")
    .attr("stroke-width",1)
    .call(xAxis)
    .call(g => g.selectAll(".tick text")
      .attr("font-size", "13px"))
    .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain(selectedYExtent)
    .range([lineNonChemicalHeight - lineMargin.top - lineMargin.bottom, lineMargin.bottom]);
  var yAxis = lineNonChemicalSvg.append("g")
    .attr("transform", `translate(${lineMargin.left},0)`)
    .attr("color","grey")
    .call(d3.axisRight(y)
      .tickSize(lineNonChemicalWidth - lineMargin.left - lineMargin.right))
    .call(g => g.select(".domain")
      .remove())
    .call(g => g.selectAll(".tick:not(:first-of-type) line")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", "3,4"))
    .call(g => g.selectAll(".tick text")
      .attr("font-size", "13px")
      .attr("text-anchor", "middle")
      .attr("text-align", "right")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dx", -22)
      .attr("dy", 4));

  lineNonChemicalSvg.selectAll(".line")
      .data(groupByCityData)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d['sample date']); })
            .y(function(d) { return y(+d.value); })
            (d.values)
        })
  
  lineNonChemicalSvg.append("g")
    .attr("transform", "translate("+(lineNonChemicalWidth/2) +"," + (lineNonChemicalHeight - lineMargin.bottom- lineMargin.top + 90) + ")")
    // .call(xAxis)
    .append("text")
    .attr("fill", "grey")
    .style("text-anchor", "middle")
    .attr("font-weight", "500")
    .attr("font-size", "18px")
    .text("Month - Year");

  lineNonChemicalSvg.append("g")
    // .call(yAxis)
    .append("text")
    .attr("fill", "grey")
    .style("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-weight", "500")
    .attr("font-size", "18px")
    .attr("transform", "translate("+(lineMargin.left-60)+","+(lineNonChemicalHeight/2- lineMargin.top) +") rotate(-90)")
    .text(selectedUnit);

  // Add one dot in the legend for each name.
  lineNonChemicalSvg.append("g").selectAll("mydots")
  .data(res)
  .enter()
  .append("circle")
    .attr("cx", 100)
    .attr("cy", function(d,i){ return 100 + i*25})
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})
    .attr("transform", "translate(10,-70)")

  // Add one dot in the legend for each name.
  lineNonChemicalSvg.append("g").selectAll("mylabels")
  .data(res)
  .enter()
  .append("text")
    .attr("x", 120)
    .attr("y", function(d,i){ return 100 + i*25})
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("transform", "translate(10,-70)")
}
