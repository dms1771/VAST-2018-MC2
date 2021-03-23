$(document).ready(function(){ 
    $(".nonchemical-dropdown .dropdown-menu a").click(function(){
          $("#chemical-select").text($(this).text());
          $("#chemical-select").val($(this).text());
          updateChemical();
      });

      $(".dropdown .dropdown-menu span").click(function(){
          $("#chemical-input").text($(this).text());
          $("#chemical-input").val($(this).text());
          drawMap();
          loadChart();
          drawBoxPlot($(this));
      });

      $('.nav-item').on("click", function(){
      $('.nav-item').removeClass('active');
      $(this).addClass('active');
      });

      $(".nav-tabs a").click(function(){
          $(this).tab('show');
      });

    //   $("#linechart-nonchemical").attr("width","1000");

    });
