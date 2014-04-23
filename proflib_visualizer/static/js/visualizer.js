function Visualizer() {
    var self = this,
        width,
        height,
        adjustedWidth,
        adjustedHeight;

    self.margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    };

    width = 800 - self.margin.right - self.margin.left;
    height = 450 - self.margin.top - self.margin.bottom;

    adjustedWidth = width + self.margin.right + self.margin.left;
    adjustedHeight = height + self.margin.top + self.margin.bottom;

    //self.jsonFile = "/static/json/flare.json";
    self.jsonFile = "/static/json/func.json";
    //self.jsonFile = "/static/json/anweb.json";
    //self.jsonFile = "/static/json/anweb_2.json";

    self.duration = 750;

    self.action_type = 'toggle';

    self.svg = d3.select("#proflib-visualizer-container").append("svg")
        .attr('viewBox', self.dimensionsToViewBoxString(0, 0, adjustedWidth, adjustedHeight) )
        .attr("width", adjustedWidth)
        .attr("height", adjustedHeight)
    
    self.g = self.svg.append("g")
        .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    self.tree = new Tree(self, self.jsonFile);

    d3.select(self.frameElement).style("height", adjustedHeight+"px");
    
    // Put into a function for specific actions
    $( ".action-type" )
        .change(function() {
            $( "select option:selected" ).each(function() {
                self.action_type = $( this ).text();
            });
        });
}

Visualizer.prototype.getHeight = function() {
    var height = this.svg.property('height').baseVal.value;
    return height;
}

Visualizer.prototype.getWidth = function() {
    var width = this.svg.property('width').baseVal.value;
    return width;
}

Visualizer.prototype.changeWidth = function(dif) {
    var newWidth = this.getWidth() + dif;

    this.svg.attr("width", newWidth);
}

Visualizer.prototype.dimensionsToViewBoxString = function(x, y, width, height) {
    var self = this;

    return x + ' ' + y + ' ' + width + ' ' + height;
}

// This controls how much of the view can be seen. Does not control the area
//  that the display covers in the browser, but will make the image smaller or
//  bigger (Like Google Maps)
Visualizer.prototype.viewBoxGetWidth = function() {
    return this.svg.property('viewBox').baseVal.width;
}

Visualizer.prototype.viewBoxGetHeight = function() {
    return this.svg.property('viewBox').baseVal.height;
}

Visualizer.prototype.changeViewBoxWidth = function(dif) {
    var newWidth = this.viewBoxGetWidth() + dif;
    this.svg.attr("viewBox", "0 0 " + newWidth + " " + this.viewBoxGetHeight());
}
