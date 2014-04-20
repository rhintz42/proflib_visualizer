function Visualizer() {
    var self = this;

    self.margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    };

    self.width = 300 - self.margin.right - self.margin.left;
    self.height = 800 - self.margin.top - self.margin.bottom;

    //self.jsonFile = "/static/flare.json";
    self.jsonFile = "/static/func.json";

    self.duration = 750;

    self.svg = d3.select("#proflib-visualizer-container").append("svg")
        .attr('viewBox', '0 0 '+ ( self.width + self.margin.right + self.margin.left ) + ' ' + ( self.height + self.margin.top + self.margin.bottom ) )
        .attr("width", self.width + self.margin.right + self.margin.left)
        .attr("height", self.height + self.margin.top + self.margin.bottom)
    
    self.svg.append("g")
        .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

    self.tree = new Tree(self, self.jsonFile);

    d3.select(self.frameElement).style("height", "800px");
}
