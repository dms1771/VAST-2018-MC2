
    var promiseAllData;
	  var data_1, data_2, data_3, data_4, data_5, data_6, data_7, data_8;
      document.addEventListener('DOMContentLoaded', function() {
		  var chem = document.getElementById("chemical-input").value;
        Promise.all([
          d3.csv("data/horizon-data/aluminum_data.csv"),
          d3.csv("data/horizon-data/ammonium_data.csv"),
          d3.csv("data/horizon-data/Arsenic_data.csv"),
          d3.csv("data/horizon-data/barium_data.csv"),
          d3.csv("data/horizon-data/cadmium_data.csv"),
          d3.csv("data/horizon-data/chromium_data.csv"),
          d3.csv("data/horizon-data/copper_data.csv"),
          d3.csv("data/horizon-data/mercury_data.csv")
        ]).then(function (promiseAllData) {
			data_1 = promiseAllData[0],
			data_2 = promiseAllData[1],
			data_3 = promiseAllData[2],
			data_4 = promiseAllData[3],
			data_5 = promiseAllData[4],
			data_6 = promiseAllData[5],
			data_7 = promiseAllData[6],
			data_8 = promiseAllData[7];
			
    
	        loadChart();
          // loadChart(promiseAllData[1], "Ammonium")
          
		  
        });
      })
    function loadChart() {
		
		
		console.log(data_1);
		var val;
		
		var chem = document.getElementById("chemical-input").value;
		console.log(chem);
		if(chem == "Aluminium") val = data_1
    else if(chem == "Ammonium") val = data_2
    else if(chem == "Arsenic") val = data_3
    else if(chem == "Barium") val = data_4
    else if(chem == "Cadmium") val = data_5
    else if(chem == "Chromium") val = data_6
    else if(chem == "Copper") val = data_7
    else if(chem == "Mercury") val = data_8
	  
	  
	  var val_filtered=[];
	  for(var i = 0;i<val.length;i++)
	  {
      var x = val[i].Year;
      var year_int  = parseInt(x);
      console.log(year_int);
      if(window.a<=year_int && year_int<=window.b)
      {
      val_filtered.push(val[i])
      }
	  }
	  console.log(val_filtered);
	  console.log(typeof(val_filtered));
          const width = window.innerWidth;
          const height = window.innerHeight;
        let multiSeriesData = populateTimeSeriesData(val_filtered);
		
        HorizonTSChart({useCanvas: false})(document.getElementById('horizon-chart'))
          .data(multiSeriesData)
          .width(width/3.2)
          .height(height/1.8)
          .series('series')
          .yNormalize(true)
          .tooltipContent(({ series, ts, val, points }) =>{
            let year = new Date(ts).getFullYear() + 1
            return `
            <div>
              <h3>${series}</h3>
              <p>Value: <b>${val}</b></p>
              <span>Year: ${year}</span>
              <span>Chemical: ${chem}</span>
            </div>`
          });
      }

    function populateTimeSeriesData(values){
	  var yearIndexMap = new Map()
      let ind = 0
      for(let i = window.a; i<=window.b; i++) {
        yearIndexMap.set(i.toString(), ind)
        ind++
      }
          let locations = Object.keys(values[0]).filter(key => key !== "Year" && key !== "measure")
          let currData = Array.from(values)
          currData.unshift(new Object())
          currData = currData.reduce((obj, row) => {
            obj[row.Year] = row
            return obj
          })

          let ansData = []
          locations.forEach(loc => {
            yearIndexMap.forEach((value, year) => {
              let obj = new Object()
              obj.series = loc
              obj.ts = new Date(year.toString())
              obj.val = 0
              if(currData.hasOwnProperty(year)){
                obj.val = +currData[year][loc]
              }
              ansData.push(obj)
            })
          })
          return ansData
      }