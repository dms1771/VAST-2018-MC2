var mapSvg;
var lineSvg;
var lineWidth;
var lineHeight;
var lineInnerHeight;
var lineInnerWidth;
var lineMargin = { top: 30, right: 90, bottom: 60, left: 0 };

var mapData;
var timeData;
let chemicalMapUrl = {
  Arsenic : "data/barchart-data/Arsenic_data.csv",
  Aluminum : "data/barchart-data/aluminum_data.csv",
  Ammonium : "data/barchart-data/ammonium_data.csv",
  Barium : "data/barchart-data/barium_data.csv",
  Cadmium : "data/barchart-data/cadmium_data.csv",
  Chromium : "data/barchart-data/chromium_data.csv",
  Copper : "data/barchart-data/copper_data.csv",
  Lead : "data/barchart-data/lead_data.csv",
  Mercury :"data/barchart-data/mercury_data.csv",
}
var filenames;
var new_f = [];
var datas=[];

// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    mapSvg = d3.select('#map');
    lineSvg = d3.select('#linechart');
    lineWidth = +lineSvg.style('width').replace('px','');
    lineHeight = +lineSvg.style('height').replace('px','');;
    lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
    lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;    
	  filenames = ['data/barchart-data/lineChartData/Aluminium_Busarakhan.csv', 'data/barchart-data/lineChartData/Aluminium_Chai.csv', 'data/barchart-data/lineChartData/Aluminium_Kannika.csv', 'data/barchart-data/lineChartData/Aluminium_Sakda.csv', 'data/barchart-data/lineChartData/Aluminium_Somchair.csv', 'data/barchart-data/lineChartData/Ammonium_Achara.csv', 'data/barchart-data/lineChartData/Ammonium_Boonsri.csv', 'data/barchart-data/lineChartData/Ammonium_Busarakhan.csv', 'data/barchart-data/lineChartData/Ammonium_Chai.csv', 'data/barchart-data/lineChartData/Ammonium_Decha.csv', 'data/barchart-data/lineChartData/Ammonium_Kannika.csv', 'data/barchart-data/lineChartData/Ammonium_Kohsoom.csv', 'data/barchart-data/lineChartData/Ammonium_Sakda.csv', 'data/barchart-data/lineChartData/Ammonium_Somchair.csv', 'data/barchart-data/lineChartData/Ammonium_Tansanee.csv', 'data/barchart-data/lineChartData/Arsenic_Achara.csv', 'data/barchart-data/lineChartData/Arsenic_Boonsri.csv', 'data/barchart-data/lineChartData/Arsenic_Busarakhan.csv', 'data/barchart-data/lineChartData/Arsenic_Chai.csv', 'data/barchart-data/lineChartData/Arsenic_Decha.csv', 'data/barchart-data/lineChartData/Arsenic_Kannika.csv', 'data/barchart-data/lineChartData/Arsenic_Kohsoom.csv', 'data/barchart-data/lineChartData/Arsenic_Sakda.csv', 'data/barchart-data/lineChartData/Arsenic_Somchair.csv', 'data/barchart-data/lineChartData/Arsenic_Tansanee.csv', 'data/barchart-data/lineChartData/Barium_Busarakhan.csv', 'data/barchart-data/lineChartData/Barium_Chai.csv', 'data/barchart-data/lineChartData/Barium_Kannika.csv', 'data/barchart-data/lineChartData/Barium_Sakda.csv', 'data/barchart-data/lineChartData/Barium_Somchair.csv', 'data/barchart-data/lineChartData/Cadmium_Achara.csv', 'data/barchart-data/lineChartData/Cadmium_Boonsri.csv', 'data/barchart-data/lineChartData/Cadmium_Busarakhan.csv', 'data/barchart-data/lineChartData/Cadmium_Chai.csv', 'data/barchart-data/lineChartData/Cadmium_Decha.csv', 'data/barchart-data/lineChartData/Cadmium_Kannika.csv', 'data/barchart-data/lineChartData/Cadmium_Kohsoom.csv', 'data/barchart-data/lineChartData/Cadmium_Sakda.csv', 'data/barchart-data/lineChartData/Cadmium_Somchair.csv', 'data/barchart-data/lineChartData/Cadmium_Tansanee.csv', 'data/barchart-data/lineChartData/Chromium_Achara.csv', 'data/barchart-data/lineChartData/Chromium_Boonsri.csv', 'data/barchart-data/lineChartData/Chromium_Busarakhan.csv', 'data/barchart-data/lineChartData/Chromium_Chai.csv', 'data/barchart-data/lineChartData/Chromium_Decha.csv', 'data/barchart-data/lineChartData/Chromium_Kannika.csv', 'data/barchart-data/lineChartData/Chromium_Kohsoom.csv', 'data/barchart-data/lineChartData/Chromium_Sakda.csv', 'data/barchart-data/lineChartData/Chromium_Somchair.csv', 'data/barchart-data/lineChartData/Chromium_Tansanee.csv', 'data/barchart-data/lineChartData/Copper_Achara.csv', 'data/barchart-data/lineChartData/Copper_Boonsri.csv', 'data/barchart-data/lineChartData/Copper_Busarakhan.csv', 'data/barchart-data/lineChartData/Copper_Chai.csv', 'data/barchart-data/lineChartData/Copper_Decha.csv', 'data/barchart-data/lineChartData/Copper_Kannika.csv', 'data/barchart-data/lineChartData/Copper_Kohsoom.csv', 'data/barchart-data/lineChartData/Copper_Sakda.csv', 'data/barchart-data/lineChartData/Copper_Somchair.csv', 'data/barchart-data/lineChartData/Copper_Tansanee.csv', 'data/barchart-data/lineChartData/Lead_Achara.csv', 'data/barchart-data/lineChartData/Lead_Boonsri.csv', 'data/barchart-data/lineChartData/Lead_Busarakhan.csv', 'data/barchart-data/lineChartData/Lead_Chai.csv', 'data/barchart-data/lineChartData/Lead_Decha.csv', 'data/barchart-data/lineChartData/Lead_Kannika.csv', 'data/barchart-data/lineChartData/Lead_Kohsoom.csv', 'data/barchart-data/lineChartData/Lead_Sakda.csv', 'data/barchart-data/lineChartData/Lead_Somchair.csv', 'data/barchart-data/lineChartData/Lead_Tansanee.csv', 'data/barchart-data/lineChartData/Mercury_Achara.csv', 'data/barchart-data/lineChartData/Mercury_Boonsri.csv', 'data/barchart-data/lineChartData/Mercury_Busarakhan.csv', 'data/barchart-data/lineChartData/Mercury_Chai.csv', 'data/barchart-data/lineChartData/Mercury_Decha.csv', 'data/barchart-data/lineChartData/Mercury_Kannika.csv', 'data/barchart-data/lineChartData/Mercury_Kohsoom.csv', 'data/barchart-data/lineChartData/Mercury_Sakda.csv', 'data/barchart-data/lineChartData/Mercury_Somchair.csv', 'data/barchart-data/lineChartData/Mercury_Tansanee.csv', 'data/barchart-data/lineChartData/Nitrite_Achara.csv', 'data/barchart-data/lineChartData/Nitrite_Boonsri.csv', 'data/barchart-data/lineChartData/Nitrite_Busarakhan.csv', 'data/barchart-data/lineChartData/Nitrite_Chai.csv', 'data/barchart-data/lineChartData/Nitrite_Decha.csv', 'data/barchart-data/lineChartData/Nitrite_Kannika.csv', 'data/barchart-data/lineChartData/Nitrite_Kohsoom.csv', 'data/barchart-data/lineChartData/Nitrite_Sakda.csv', 'data/barchart-data/lineChartData/Nitrite_Somchair.csv', 'data/barchart-data/lineChartData/Nitrite_Tansanee.csv']
	
	for(var f = 0;f<filenames.length;f++)
	{
		new_f.push(d3.csv(filenames[f]));
	}
	Promise.all(new_f)
            .then(function(values){
				mapData = values[81];
        data_1=values[0];data_2=values[1];data_3=values[2];data_4=values[3];data_5=values[4];data_6=values[5];data_7=values[6];data_8=values[7];data_9=values[8];data_10=values[9];data_11=values[10];data_12=values[11];data_13=values[12];data_14=values[13];data_15=values[14];data_16=values[15];data_17=values[16];data_18=values[17];data_19=values[18];data_20=values[19];data_21=values[20];data_22=values[21];data_23=values[22];data_24=values[23];data_25=values[24];data_26=values[25];data_27=values[26];data_28=values[27];data_29=values[28];data_30=values[29];data_31=values[30];data_32=values[31];data_33=values[32];data_34=values[33];data_35=values[34];data_36=values[35];data_37=values[36];data_38=values[37];data_39=values[38];data_40=values[39];data_41=values[40];data_42=values[41];data_43=values[42];data_44=values[43];data_45=values[44];data_46=values[45];data_47=values[46];data_48=values[47];data_49=values[48];data_50=values[49];data_51=values[50];data_52=values[51];data_53=values[52];data_54=values[53];data_55=values[54];data_56=values[55];data_57=values[56];data_58=values[57];data_59=values[58];data_60=values[59];data_61=values[60];data_62=values[61];data_63=values[62];data_64=values[63];data_65=values[64];data_66=values[65];data_67=values[66];data_68=values[67];data_69=values[68];data_70=values[69];data_71=values[70];data_72=values[71];data_73=values[72];data_74=values[73];data_75=values[74];data_76=values[75];data_77=values[76];data_78=values[77];data_79=values[78];data_80=values[79];data_81=values[80];data_82=values[81];data_83=values[82];data_84=values[83];data_85=values[84];data_86=values[85];data_87=values[86];data_88=values[87];data_89=values[88];data_90=values[89];
        datas.push(data_1);datas.push(data_2);datas.push(data_3);datas.push(data_4);datas.push(data_5);datas.push(data_6);datas.push(data_7);datas.push(data_8);datas.push(data_9);datas.push(data_10);datas.push(data_11);datas.push(data_12);datas.push(data_13);datas.push(data_14);datas.push(data_15);datas.push(data_16);datas.push(data_17);datas.push(data_18);datas.push(data_19);datas.push(data_20);datas.push(data_21);datas.push(data_22);datas.push(data_23);datas.push(data_24);datas.push(data_25);datas.push(data_26);datas.push(data_27);datas.push(data_28);datas.push(data_29);datas.push(data_30);datas.push(data_31);datas.push(data_32);datas.push(data_33);datas.push(data_34);datas.push(data_35);datas.push(data_36);datas.push(data_37);datas.push(data_38);datas.push(data_39);datas.push(data_40);datas.push(data_41);datas.push(data_42);datas.push(data_43);datas.push(data_44);datas.push(data_45);datas.push(data_46);datas.push(data_47);datas.push(data_48);datas.push(data_49);datas.push(data_50);datas.push(data_51);datas.push(data_52);datas.push(data_53);datas.push(data_54);datas.push(data_55);datas.push(data_56);datas.push(data_57);datas.push(data_58);datas.push(data_59);datas.push(data_60);datas.push(data_61);datas.push(data_62);datas.push(data_63);datas.push(data_64);datas.push(data_65);datas.push(data_66);datas.push(data_67);datas.push(data_68);datas.push(data_69);datas.push(data_70);datas.push(data_71);datas.push(data_72);datas.push(data_73);datas.push(data_74);datas.push(data_75);datas.push(data_76);datas.push(data_77);datas.push(data_78);datas.push(data_79);datas.push(data_80);datas.push(data_81);datas.push(data_82);datas.push(data_83);datas.push(data_84);datas.push(data_85);datas.push(data_86);datas.push(data_87);datas.push(data_88);datas.push(data_89);datas.push(data_90);	
		drawMap();
        $("#slider").on("change", function(){
        drawMap();})
    });
});

function drawMap () {
    var margin = { top: 30, right: 90, bottom: 60, left: 0 };
    lineWidth = +lineSvg.style('width').replace('px','');
    lineHeight = +lineSvg.style('height').replace('px','');;
    lineInnerWidth = lineWidth - lineMargin.left - lineMargin.right;
    lineInnerHeight = lineHeight - lineMargin.top - lineMargin.bottom;
    var x0 = d3.scaleBand().range([70, lineInnerWidth]);
    var x1 = d3.scaleBand();

    var y = d3.scaleLinear()
    .range([lineInnerHeight, 10]);

    var xAxis = d3.axisBottom()
    .scale(x0)

    var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(d3.format(".2s"));
    var color = d3.scaleOrdinal().range(
    ["b33040", "#d25c4d", "#f2b447", "#d9d574","DE711B","#0DBB7C","#1D82DC","#D3B0C6","#A1AD12","#9B5E9B"]);
    var yBegin;
    var innerColumns = {
    "column1" : ["Achara", "Boonsri", "Busarakhan", "Chai","Decha","Kannika","Kohsoom", "Sakda", "Somchair", "Tansanee"]
    }
  mapSvg.selectAll("*").remove();
  
  var chemical = document.getElementById('chemical-input').value;
  // if(chemical.localeCompare("")==0)
  // {
	//   chemical = "Arsenic";
  // }
  d3.csv(chemicalMapUrl[chemical]).then(
    function(data) {
    console.log(data);

    var columnHeaders = d3.keys(data[0]).filter(function(key) { return key !== "Year" && key!=="measure"; });
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"&& key!=="measure"; }));

    data.forEach(function(d) {
    var yColumn = new Array();
        d.columnDetails = columnHeaders.map(function(name) {
        for (ic in innerColumns) {
            if($.inArray(name, innerColumns[ic]) >= 0){
            if (!yColumn[ic]){
                yColumn[ic] = 0;
            }
            yBegin = yColumn[ic];
            yColumn[ic] += +d[name];
            return {name: name, column: ic, yBegin: yBegin, yEnd: +d[name] + yBegin,year:d.Year};
            }
        }
    });
    console.log("Col details- ",d.columnDetails);
    d.total = d3.max(d.columnDetails, function(d) { 
    return d.yEnd; 
    });
    });


	  var val_filtered=[];
	  for(var i = 0;i<data.length;i++)
	  {
	  var x = data[i].Year;
	  var year_int  = parseInt(x);
	  if(a<=year_int && year_int<=b)
	  {
	  val_filtered.push(data[i])
	  }	  
	  }
x0.domain(val_filtered.map(function(d) { return d.Year; }));
x1.domain(d3.keys(innerColumns)).range([0, x0.bandwidth()]);
y.domain([0, d3.max(val_filtered, function(d) { 
return d.total; 
})]);

mapSvg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + lineInnerHeight + ")")
  .call(xAxis);


mapSvg.append("text")             
.attr("transform",
      "translate(" + (lineInnerWidth/2) + " ," + 
                      (lineInnerHeight + margin.top+9) + ")")
.style("text-anchor", "middle")
.style("font-size", "10px")
.style("fill","gray")
.text("Years");

mapSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 10)
    .attr("x",-35 - (lineInnerHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill","gray")
    .text("Measurement");


y_axis = mapSvg.append("g")
    .attr('class', 'y axis')
    .attr("transform", "translate(70" + ", 0" + ")")
	
    .call(yAxis);

var project_stackedbar = mapSvg.selectAll(".project_stackedbar")
  .data(val_filtered)
  .enter().append("g")
  .attr("class", "g")
  .attr("transform", function(d) { return "translate(" + x0(d.Year) + ",0)"; });

project_stackedbar.selectAll("rect")
  .data(function(d) { return d.columnDetails; })
  .enter().append("rect")
  .attr("width", x0.bandwidth()-4)
  .attr("x", function(d) { 
    return x1(d.column);
     })
  .attr("y", function(d) { 
    return y(d.yEnd); 
  })
  .attr("height", function(d) { 
    return y(d.yBegin) - y(d.yEnd); 
  })
  .on("click", function(d){
	drawLineChart(d.year, d.name)})
  .style("fill", function(d) {
      return color(d.name);
  });

var legend = mapSvg.selectAll(".legend")
  .data(columnHeaders.slice().reverse())
  .enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
  .attr("x", lineWidth - 30)
  .attr("y",10)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", color);

legend.append("text")
  .attr("x", lineWidth - 40)
  .attr("y", 19)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) { return d; });
});
}

// draw Line chart 

function drawLineChart(year,log) {	

  lineSvg.selectAll("*").remove();
  var myArr = [];
  var chem = document.getElementById("chemical-input").value;
  var n = "data/barchart-data/lineChartData/"+chem+"_"+log+".csv";
  var index = filenames.indexOf(n);
  
  var data = datas[index];
 
  console.log("%%%%%%%%%%%%%%%%%%%%%%");
  console.log(index);
  console.log("PPPPPPPPPPPPPPPPPPPPPPPP");
   console.log(data);
  data.forEach(function(d) {
	  console.log(d);
	  if(year.localeCompare(d.Year) == 0){
	  myArr.push({
                    "month": d.MonthName,
                    "value": d.value_final
	  });}
  });
  console.log(myArr);
  myArr.forEach(function(d) {
    d.value = +d.value;
   }); 

  var x = d3.scaleBand()
          .domain(["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November","December"])
          .range([70,lineInnerWidth]);
var tickVals = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  x_axis = lineSvg.append("g")
  .attr("transform", "translate(0," + lineInnerHeight + ")")
  .attr("class" , "axis")
  .call(d3.axisBottom(x).tickFormat((d, i) => tickVals[i]));
    x_axis.selectAll(".tick text").attr("fill", "gray");
	x_axis.selectAll(".tick line").attr("stroke", "gray").attr("fill","gray");
    

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(myArr, function(d) { return +d.value; })]).nice()
      .range([ lineInnerHeight, 100 ]);
	const yAxis = d3.axisLeft(y);
    
	y_axis = lineSvg.append("g")
    .attr('class', 'axis axis--y')
    .attr("transform", "translate(70" + ", 0" + ")")
	
    .call(yAxis);
	
    y_axis.selectAll(".tick text").attr("fill", "gray");
	
	var bisect = d3.bisector(function(d) { return d.month; }).left;
	var focus = lineSvg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 10)
			.style("fill", "none")
      .attr("stroke", "black");

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 150)
            .attr("height", 50)
			
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4)
			.style("fill","#FFFFE0")
			.style("opacity", 0.8)
			
			;

        focus.append("text")
            
            .attr("x", 18)
            .attr("y", -2)
			.text("Month:");

        focus.append("text")
            .attr("x", 18)
            .attr("y", 18)
            .text("Measurement:");
			
		focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 90)
            .attr("y", -2);

        focus.append("text")
            .attr("class", "tooltip-likes")
            .attr("x", 90)
            .attr("y", 18);
		var monthMap = {};
		monthMap["January"] = 1;
		monthMap["February"] = 2;
		monthMap["March"] = 3;
		monthMap["April"] = 4;
		monthMap["May"] = 5;
		monthMap["June"] = 6;
		monthMap["July"] = 7;
		monthMap["August"] = 8;
		monthMap["September"] = 9;
		monthMap["October"] = 10;
		monthMap["November"] = 11;
		monthMap["December"] = 12;
		
		
        lineSvg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', lineInnerWidth)
    .attr('height', lineInnerHeight)
    .on('mouseover', function() { focus.style("display", null); })
    .on('mousemove', mousemove)
    .on('mouseout', function() { focus.style("display", "none"); });
x.invert = function(x1) {
    var domain = this.domain();
    var range = this.range()
    var scale = d3.scaleQuantize().domain(range).range(domain)
    return scale(x1)
};

        function mousemove() {
			var t = x.invert(d3.mouse(this)[0]);
			var ti = bisect(myArr, x0, 1);
			console.log("**********************");
			console.log(ti);
            var x0 = x.invert(d3.mouse(this)[0]);
			console.log(x0);
                i = monthMap[x0];
                d = myArr[i];
                console.log(i);
				
				console.log(d);
				console.log(d == null);
				var txt1, txt2;
				var x_c,y_c;
				if(d==null)
				{
					txt1 = "record absent";
					txt2 = "value not recorded";
					x_c = d3.mouse(this)[0];
					y_c = d3.mouse(this)[1];
				}
				else{
					txt1 = d.month;
					txt2 = d.value.toFixed(2);
					x_c = x(d.month);
					y_c = y(d.value);
				}
            focus.attr("transform", "translate(" + x(d.month) + "," + y(d.value) + ")");
            focus.select(".tooltip-date").text(d.month);
            focus.select(".tooltip-likes").text(d.value);
        }

    lineSvg.append("path")
      .datum(myArr)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) {console.log(d.month); return x(d.month) })
        .y(function(d) { return y(d.value) })
        )
      .attr("class", "lineclass");
    
	lineSvg.append("text")
    .attr("class", "axisLabel")
    .attr("x", (lineInnerWidth/2)+20)
    .attr("y", lineHeight-50)
    .style("text-anchor", "middle")
	.style("fill","gray")
    .text("Years");
	
	lineSvg.append("text")
	.attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("x",-35 - (lineInnerHeight / 2))
	.attr("dy", "1em")
    .style("text-anchor", "middle")
	.style("fill","gray")
    .text("Measurement");
}