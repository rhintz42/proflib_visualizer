// TODO: Create Getters and Setters for this class
// TODO: Add Testing Framework: Chai & Mocha
// TODO: Zoom In
// TODO: Zoom Out
// TODO: Make Wider
// TODO: Create ViewBox Object
// TODO: Create `Focus` button that will focus on the selected node and hide
//          the others
// TODO: ParseFileLib: Pull things from Github to analyze here
// TODO: Create an actual, one page site for this

/*
 * Encapsulates all of the d3 objects for creating a tree structure
 */
function Visualizer() {
    var self = this,
        width,
        height;

    self.initializeProperties();

    height = getAdjustedHeight(self.initialHeight, self.margin.top, self.margin.bottom);
    width = getAdjustedWidth(self.initialWidth, self.margin.right, self.margin.left);

    self.initializeSVG(height, width);
    self.initializeTree();
    self.initializeDOMActions();
}

// ----------------------------------------------------------

// DOM Model
/*
 * Initialize all the actions in the DOM
 */
Visualizer.prototype.initializeDOMActions = function() {
    var self = this;

    $( ".action-type" )
        .change(function() {
            $( "select option:selected" ).each(function() {
                self.action_type = $( this ).text();
            });
        });
}

/*
 * Initialize the properties that are specific to the Visualizer Class
 */
Visualizer.prototype.initializeProperties = function() {
    var self = this;

    self.margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    };

    self.initialHeight = 450;
    self.initialWidth = 800;
    self.duration = 750;
    self.action_type = 'toggle';
}

/*
 * Initialize the SVG Object of this class
 */
Visualizer.prototype.initializeSVG = function(height, width) {
    var self = this;

    // Create the ViewBox (The container for the tree)
    self.svg = d3.select("#proflib-visualizer-container").append("svg")
       .attr('viewBox', dimensionsToViewBoxString(0, 0, width, height+50) )
       .attr("width", width)
       .attr("height", height)

    // Transate the inner d3 container to the bottom right
    self.g = self.svg.append("g")
       .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");
}

/*
 * Initialize the Tree Object of this class
 */
Visualizer.prototype.initializeTree = function() {
    var self = this;

    //self.jsonFiles = ["/static/json/func.json"];
    //self.jsonFiles = ["/static/json/anweb.json"];
    //self.jsonFiles = ["/static/json/anweb_2.json"];
    //self.jsonFiles = ["/static/json/parse_file_lib_json_files/test_2.json"];
    
    self.jsonFiles = [
                        "/static/json/proflib_json_files/test_1.json",
                        "/static/json/proflib_json_files/test_2.json",
                        "/static/json/proflib_json_files/test_3.json",
                        "/static/json/proflib_json_files/test_4.json",
                        "/static/json/proflib_json_files/test_5.json"
                    ];

    self.tree = new Tree(self, self.jsonFiles);
}


// ----------------------------------------------------------

/*
 * Change the width of the Visualizer Container
 */
Visualizer.prototype.changeWidth = function(dif) {
    var newWidth = this.getWidth() + dif;

    this.svg.attr("width", newWidth);
}

/*
 * Change the width of the ViewBox
 */
Visualizer.prototype.changeViewBoxWidth = function(dif) {
    var newWidth = this.getViewBoxWidth() + dif;
    this.svg.attr("viewBox", "0 0 " + newWidth + " " + this.getViewBoxHeight());
}

// ----------------------------------------------------------

/*
 * Get height of Visualizer Container
 */
Visualizer.prototype.getHeight = function() {
    var height = this.svg.property('height').baseVal.value;
    return height;
}

/*
 * Get width of Visualizer Container
 */
Visualizer.prototype.getWidth = function() {
    var width = this.svg.property('width').baseVal.value;
    return width;
}

/*
 * Get the height of the ViewBox
 */
Visualizer.prototype.getViewBoxHeight = function() {
    return this.svg.property('viewBox').baseVal.height;
}

/*
 * Change the width of the ViewBox
 */
Visualizer.prototype.getViewBoxWidth = function() {
    // This controls how much of the view can be seen. Does not control the area
    //  that the display covers in the browser, but will make the image smaller or
    //  bigger (Like Google Maps)
    return this.svg.property('viewBox').baseVal.width;
}

// -----------------------------------------------------------

/*
 * Get the height given the height of the container and the margin
 */
getAdjustedHeight = function(height, marginTop, marginBottom) {
    return height - marginTop - marginBottom + 5; // The 5 is half the node height
}

/*
 * Get the width given the width of the container and the margin
 */
getAdjustedWidth = function(width, marginRight, marginLeft) {
    return width - marginRight - marginLeft + 10; // The 10 is half the node height
}

/*
 * Parse parameters into a string that sets the ViewBox
 */
dimensionsToViewBoxString = function(x, y, width, height) {
    var self = this;

    return x + ' ' + y + ' ' + width + ' ' + height;
}
