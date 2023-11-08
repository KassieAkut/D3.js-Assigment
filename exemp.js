// Set width and height of SVG container
var width = 1000;
var height = 870;

// Create an SVG element 

var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('stroke-width', '10px');

// Define the projection for the map

var projection = d3.geoNaturalEarth1()
  .translate([width / 2, height / 2])
  .scale(4000)
  .center([-7, 55]);

// Create a path for the map

var path = d3.geoPath(projection);

// Creating new elements city slider and count in refernce to html element 

var citySlider = document.getElementById('citySlider');
var city_Count = document.getElementById('cityCount');


// Update towns loaded
function updateCityCount() {
  var cityCount = parseInt(citySlider.value);
  city_Count.textContent = cityCount;

// Create a tooltip element and styling it
  
  function createTooltip() {
    var tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', '#ffff')
      .style('border-radius', '5px')
      .style('box-shadow', '0 2px 4px rgba(0, 0, 0, 0.2)')
      .style('opacity', 0.8)
      .style('border', '1px solid #000')
      .style('padding', '12px')
      .style('display', 'none');

    return tooltip;
  }


  // Load the data to display the map
  d3.json('https://yamu.pro/gb.json', function (error, mapData) {
    if (error) {
      console.error(error);
      return;
    }

    // Display the map paths
    svg.selectAll('.country')
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .style('fill', 'rgb(43, 129, 38)')
      .style('stroke', '#020008')
      .style('stroke-width', '0.5px');

    // Load the data to display towns

    d3.json('http://34.38.72.236/Circles/Towns/' + cityCount, function (error, data) {
      if (error) {
        console.error(error);
        return;
      }

      svg.selectAll('.towns').remove(); // Remove existing circles

      const tooltip = createTooltip();

      // Append circles for towns
svg.selectAll('.towns')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'towns')
  // Output circle size based on city population
  .attr('r', function (d) { return d.Population / 10000 })
  .style('opacity', 0.6)
  .style('fill', 'rgb(0, 0, 128)')
  .style('stroke', 'black')
  .style('stroke-width', '0.7px')
  //use 'projection([d.lng, d.lat])' to get coordinates for circles.
  .attr('cx', function (d) {
    var coords = projection([d.lng, d.lat]);
    return coords[0];
  })
  .attr('cy', function (d) {
    var coords = projection([d.lng, d.lat]);
    return coords[1];
  })
  .on('mouseover', function (d) {
    // Show the tooltip when hovering over a circle
    d3.select('.tooltip')                                             
      .style('display', 'block')
      .html(
        'Town: ' + d.Town + '<br>' +
        'Population: ' + d.Population + '<br>' +
        'Longitude: ' + d.lng + '<br>' +
        'Latitude: ' + d.lat
      )
      .style('left', (d3.event.pageX + 10) + 'px')
      .style('top', (d3.event.pageY - 10) + 'px');
  })
  .on('mousemove', function () {
    // Position the tooltip near the mouse
    d3.select('.tooltip')
      .style('left', (d3.event.pageX + 10) + 'px')
      .style('top', (d3.event.pageY - 10) + 'px');
  })
  .on('mouseout', function () {
    // Hide the tooltip when the mouse leaves the circle
    d3.select('.tooltip').style('display', 'none');
  });
    });
  });
}

// Listen for changes to the slider value
citySlider.addEventListener('input', updateCityCount);

// Initialize the city count
updateCityCount();

