// Global variables
var innovativeMapSvg;
var innovativeGeoMapData;
var sd_map;
var sd_roads;
var sevScoreData;
var latLongData;
var reservTooltip;
var projection;
var yearValue;

var listOfCood = []
// Run when page is loaded
document.addEventListener("DOMContentLoaded", function () {
  innovativeMapSvg = d3.select("#innovativeGeoMapSvg");
  
  reservTooltip = d3
    .select("body")
    .append("div")
    .classed("myTooltip", true)
    .style("visibility", "hidden");

    // yearValue = "2000"
//   yearValue = d3.select("#year-input").property("value")
  yearValue = globalSlider.getValue()
  globalSlider.on('change', updateSeverityCircle);
  document.getElementById("yearAnimationButton").addEventListener('click', updateYearSlider)
  
  // Load all data files before processing.
  Promise.all([
    d3.json("data/geoMap-data/san_diego_boundary_datasd.geojson"),
    d3.json("data/geoMap-data/san_diego_boundary_datasd.topojson"),
    d3.json("data/geoMap-data/roads_datasd.topojson"),
    d3.csv("data/geoMap-data/severity_score.csv"),
    d3.csv("data/geoMap-data/lat_long.csv")
  ]).then(function (val) {
    innovativeGeoMapData = val[0];
    sd_map = val[1];
    // sd_roads = val[3-1];
    sevScoreData = val[3];
    latLongData = val[4];


    drawCityMap();
  });
});

function drawCityMap() {
  projection = d3
    .geoMercator()
    .scale(100000)
    .center([-117.137858, 32.812699])
    .translate([
      +innovativeMapSvg.style("width").replace("px", "") / 2,
      +innovativeMapSvg.style("height").replace("px", "") / 2,
    ]);
  var path = d3.geoPath().projection(projection);

  var mapGroup = innovativeMapSvg.append("g").attr("id", "map-group");

  const sd_borders = topojson.feature(
    sd_map,
    sd_map.objects.san_diego_boundary_datasd
  ).features;
    // const sd_road = topojson.feature(sd_roads, sd_roads.objects.roads_datasd)
    //   .features;

  mapGroup
    .selectAll("path")
    .data(sd_borders)
    .enter()
    .append("path")
    .attr("class", "san-diego-boundary")
    .attr("d", path)
    .style("fill", "#fdfaf1")
    .attr("stroke", "blue");
    
  latLongData.forEach((location) => {
    if (d3.geoContains(innovativeGeoMapData, [-+location.longitude, +location.latitude])) {
    } else {
      convertLongLang(location, projection);
    }
  });

  drawSeverityCircle(listOfCood)
}

function convertLongLang(restoLocation, projection) {
  const coordinates = projection([
    -+restoLocation.longitude,
    +restoLocation.latitude,
  ]);

  listOfCood.push([restoLocation.location, ...coordinates, restoLocation.longitude, restoLocation.latitude])
}

var xScale, yScale, radiusScale, colorScale

function drawSeverityCircle(listOfCood){

  d3.select('.city-plot-g').remove()
  colorScale = d3.scaleOrdinal().domain(["Very Low", "Low", "Medium", "High", "Very High"]).range(["lightyellow", "yellow", "orange", "red", "darkred"])

  let glyphs = innovativeMapSvg.append('g').attr("class","city-plot-g")
    .selectAll('g')
    .data(listOfCood).enter().append('g')

  let filteredData = sevScoreData.filter((d) => {
    return d.Year == yearValue
  })
    
  glyphs
    .append("circle")
    .transition().duration(700)
    .attr("r", 14)
    .attr("cx", d => d[1])
    .attr("cy", d => d[2]+18)
    .attr("fill", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      return colorScale(currLocData.length? currLocData[0].severity : "Very Low")
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .style("cursor", "pointer")


  glyphs.selectAll('circle').datum(d => d)
    .on("mouseover", function (d) {
      d3.select(this).style("stroke", "cyan")
      d3.select(this).style("stroke-width", "3px")
      reservTooltip
        .html(
            "Longitude: " + d[3] + 
            "<br/>" +
            "Latitude: " + d[4]
        )
        .style("visibility", "visible")
    })
    .on("mousemove", function () {
      reservTooltip
        .style("top", d3.event.pageY - 10 + "px")
        .style("left", d3.event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      reservTooltip.style("visibility", "hidden");
      d3.select(this).style("stroke", "black")
      d3.select(this).style("stroke-width", "1px")
    })

    
  glyphs
    .append("text")
    .transition().duration(700)
    .text(d => d[0])
    .attr('font-size',14)
    .attr('text-anchor', "middle")
    .attr("x", d => d[1])
    .attr("y", d => d[2])
}

function updateSeverityCircle(){
//   yearValue = d3.select("#year-input").property("value")
  yearValue = globalSlider.getValue()

  let filteredData = sevScoreData.filter((d) => {
    return d.Year == yearValue
  })

  let circle = innovativeMapSvg.select('.city-plot-g').selectAll("circle")

  circle.exit().remove()
  circle.enter().append("circle")

  circle.transition().duration(700)
    .attr("fill", function(d){
      let currLocData = filteredData.filter(_ => _.location == d[0])
      return colorScale(currLocData.length? currLocData[0].severity : "Very Low")
    })
}

function updateYearSlider() {
    let val1 = 1998
    let intervalId = setInterval(() => {
        globalSlider.setValue(""+val1, true, true)
        val1 += 1
        if(val1 == 2017) clearInterval(intervalId)
    }, 500)
}
