function updateJSON() {
    for (var i = 0; i < inputs.length; i++) {
        var q = inputs[i].name.split("%$#^");
        setValue(obj, q, inputs[i].value);
    }

    // This is the updated JSON obj
    console.log(obj);
}
function setValue(obj, q, val) {
    var sel = q.shift();
    if (typeof obj[sel] === "object" && q.length > 0) {
        setValue(obj[sel], q, val);
    } else {
        obj[sel] = val;
    }
}

two("cities");
function myFunction() {
    var onecity = document.getElementById("choice").value;
    document.getElementById("demo").innerHTML = "Gun Deaths Info of "+onecity;
    //hideMap();
    d3.select(".features1").html("");
    two("boston");
    d3.select(".features1").html("");
    two(onecity.toLowerCase());
    //showMap();
 } 
 function reset() {
    two("cities");
    //showMap();
 } 
//Map dimensions (in pixels)
var width = 800,
    height = 467;

//Map projection
var projection = d3.geo.albersUsa()
    .scale(973.627931478762)
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

var path2 = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

var features1 = svg.append("g")
  .attr("class","features1");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

var tooltip = d3.select(".map").append("div").attr("class","tooltip");
var info = d3.select(".info").append("div");

var radius = d3.scale.sqrt()
    .domain([0, 408])
    .range([0, 50]);

var color = d3.scale.linear()
    .domain([1,5,10,100,408])
    .range(["#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"]);


svg.call(zoom);

function two(city){
queue()
  .defer(d3.json, "states.geojson")
  .defer(d3.json, "out/"+city+".geojson")
  .await(theMap);
}


function theMap(error, states, cities) {
  if (error) return console.log(error);
  features.selectAll("path")
    .data(states.features)
    .attr("id", "sta")
    .enter()
    .append("path")
    .attr("d",path)
    .attr("fill", "#d9d9d9")
    .on("click",clicked);
  features1.selectAll("path2")
    .attr("class", "city")
    .data(cities.features)
    .enter()
    .append("path")
    .attr("d", path2.pointRadius(function(d) { return radius(d.properties.NumberofDeaths); }))
    .attr("fill", function(d) { return (typeof color(d.properties.NumberofDeaths) == "string" ? color(d.properties.NumberofDeaths) : ""); })
    .on("mouseover",showTooltip)
    .on("mousemove",moveTooltip)
    .on("mouseout",hideTooltip)
    .on("click",showInfo);

}

function showTooltip(d) {
  moveTooltip();

  tooltip.style("display","block")
    .text(d.properties.City+', '+d.properties.State+'\n'+"Death Number: "+d.properties.NumberofDeaths+'\n'+"M: "+d.properties.NumberofMale+"   F: "+d.properties.NumberofFemale);
}

function showInfo(d) {
  var tHtml = d.properties.City+",    Matched Death: "+d.properties.NumberofDeaths+",    Average Age: "+d.properties.Age+",    Male: "+d.properties.NumberofMale;+",   Female: "+ d.properties.NumberofFemale;
  var mHtml = "";
  var fHtml = "";
  for (i = 0; i < d.properties.NumberofMale; i++) { 
    mHtml += '<img src="M.png" width="20" height="30" alt="" />';
    //imageM();
  };
  for (i = 0; i < d.properties.NumberofFemale; i++) { 
    fHtml += '<img src="F.png" width="20" height="30" alt="" />';
    //imageM();
  };
  mHtml = "<div><span class='mnumber' style='color:#0698ff'>" +  d.properties.NumberofMale + "</span>" + mHtml + "</div>";
  fHtml = "<div><span class='mnumber' style='color:#ff0677'>" +  d.properties.NumberofFemale + "</span>" + fHtml + "</div>";
  info.html(tHtml+mHtml + fHtml);
  //info.style("display","block")
  //.text(d.properties.City+', '+d.properties.State+"    Death Number: "+d.properties.NumberofDeaths+"M: "+d.properties.NumberofMale+"   F: "+d.properties.NumberofFemale+"    Average Age: "+d.properties.Age);

}



// Add optional onClick events for features here
function clicked(d,i) {

}

//Update map on zoom/pan
function zoomed() {
  features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path2").style("stroke-width", 1 / zoom.scale() + "px" );
  features1.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
      .selectAll("path2").style("stroke-width", 1 / zoom.scale() + "px" );
}



//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
function showTooltip(d) {
  moveTooltip();

  tooltip.style("display","block")
    .text(d.properties.City+', '+d.properties.State+'\n'+"Death Number: "+d.properties.NumberofDeaths+'\n'+"M: "+d.properties.NumberofMale+"   F: "+d.properties.NumberofFemale);
}

//Move the tooltip to track the mouse
function moveTooltip() {
  tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
      .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
  tooltip.style("display","none");
}
function hideMap(){
  features1.style("display","none");
}
function showMap(){
  features1.style("display","block");
}
