// TODO: FUNCTIONNS TO ADD
//  - toggleCollapse
//  - hide (Maybe not for now)
function NodeList(tree, nodes) {
    var self = this;

    self.tree = tree;
    self.nodes = nodes;
    self.padding = 10;

    self.tooltip = d3.select("#proflib-visualizer-container")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", 0);

    self.nodeDescription = d3.select("#node-description-container")
    .append("div")
    .attr("class", "node-description")
    //.style("width", "200px")
    //.style("height", "100px")
}


// Enter any new nodes at the parent's previous position.
NodeList.prototype.createChildToParentPosition = function(parentNode, svgNodes) {
    var self = this;

    // Create Node
    var nodeEnter = svgNodes.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + parentNode.y0 + "," + parentNode.x0 + ")";
        })
        .on("click", self.click.bind(self))
        .on("mousedown", mousedown.bind(self))
        .on("mouseover", mouseover.bind(self))
        .on("mousemove", mousemove.bind(self))
        .on("mouseout", mouseout.bind(self));
    
    // Create Rectangle Representation
    var rects = nodeEnter.append("rect")
        .attr("x", function(d) {
            return 0;
        })
        .attr("y", -10)
        .attr("width", function(d, i) {
            return 0;
        })
        .attr("height", 20)
        .style("opacity", 1e-6);
    
    // Create Text Inside Rect
    var texts = nodeEnter.append("text")
        .attr("x", function(d) {
            return 0;
        })
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name || d.function_name;
        })
        .style("fill-opacity", 1e-6);
    
    
    // Resize Rects to Size of Text
    for(var i = 0; i < texts[0].length; i++) {
        if(texts[0][i] === null || rects[0][i] === null)
            continue;
        var w = texts[0][i].getBBox().width;

        rects[0][i].setAttribute("x", -self.padding);
        rects[0][i].setAttribute("width", w + (self.padding*2));
    }
    
}


// Transition nodes to their new position.
NodeList.prototype.transitionToNewPosition = function(svgNodes) {
    var self = this;

    var nodeUpdate = svgNodes.transition()
        .duration(self.tree.getDuration())
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("rect")
        .attr("r", 10)
        .style("fill", function(d) {
            return d._children && d._children.length > 0 ? "lightsteelblue" : "#fff";
        })
        .style("opacity", 1);

    nodeUpdate.select("text")
        .style("fill-opacity", 1);
}


// Transition exiting nodes to the parent's new position.
NodeList.prototype.transitionExitingToParentPosition = function(parentNode, svgNodes) {
    var self = this;

    var nodeExit = svgNodes.exit().transition()
        .duration(self.tree.getDuration())
        .attr("transform", function(d) {
            return "translate(" + parentNode.y + "," + parentNode.x + ")";
        })
        .remove();

    nodeExit.select("rect")
        .attr("r", 1e-6)
        .style("opacity", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);
}


// Get list of nodes in svg form
NodeList.prototype.getSVGList = function(nodes) {
    var self = this,
        svg = self.tree.getSVG();

    var svgNodes = svg.selectAll("g.node")
        .data(nodes, function(d) {
            return d.id || (d.id = ++self.tree.nodeCount);
        });

    return svgNodes;
}


// Normalize for fixed-depth.
NodeList.prototype.updateY = function(nodes) {
    nodes.forEach(function(d) {
        var depth = d.depth - 1; //Accomodate for root node
        d.y = depth * 180;
    });
}


// Stash the old positions for transition.
NodeList.prototype.storeOldPositions = function(nodes) {
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}


NodeList.prototype.update = function(parentNode, updatedNodes) {
    var self = this,
        svgNodes = self.getSVGList(updatedNodes);

    self.nodes = updatedNodes;

    self.updateY(self.nodes);

    self.createChildToParentPosition(parentNode, svgNodes);
    self.transitionToNewPosition(svgNodes);
    self.transitionExitingToParentPosition(parentNode, svgNodes);

    self.storeOldPositions(self.nodes);
}


// Toggle children on click.
NodeList.prototype.click = function(d) {
    var self = this;

    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    // TODO: THIS IS TEST CODE!!! 
    // This is test code to see if can increase the width and stuff
    // Turns out I needed to take off the append of 'g' on the svg object when I store it
    self.tree.visualizer.changeWidth(100);
    self.tree.visualizer.changeViewBoxWidth(100);
    self.tree.update(d);
}




function mousemove(node)
{    //Move tooltip to mouse location
    return this.tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");                            
}

function mouseout(node)
{
    //d3.select(this) 
    //    .attr("class", "dataCircle"); //Recolor circle steel blue
    
    this.tooltip.transition()
        .delay(100)
        .style("opacity", 0)    //Make tooltip invisible
    
    //svg.selectAll("circle")
    //.transition()
    //.style("opacity", 1);       //
}


//Mouseover function for circles, displays shortened tooltip and causes other circles to become opaque
function mouseover(node)
{
    var myCircle = d3.select(this);
    
    //d3.select(this).attr("class", "dataCircleSelected");    //Color circle green
    
    this.tooltip.html(    //Populate tooltip text
        "Username: " + "rhintz42" + "<br/>" +
        "Session ID: " + "42" + "<br/>" + 
        "Impact CPU: " + "huge"            
    )
    .transition()
    .duration(250)
    .style("opacity", .7);
    
    //After 1000ms, make other circle opaque
    //svg.selectAll("circle")
    //.filter(function(d, i){    //return every other circle
    //    return !d.compare(myCircle[0][0].__data__);
    //})
    //.transition().delay(1000)
    //.style("opacity", .2);
    
}

function mousedown(node)
{
    this.tooltip.transition() 
        .duration(200)
        .style("opacity", 1);

    this.setTooltipLong(node);

    this.setNodeDescription(node);
}

NodeList.prototype.setTooltipLong = function(node) {
    this.tooltip.html(
        "Username: " + "rhintz42" + "<br/>" +
        "Session ID: " + "42" + "<br/>" + 
        "Impact CPU: " + "huge" + "<br/>" +
        "Request CPU: " + "please" + "<br/>" + 
        "Request IO: " + "hello there" + "<br/>" +
        "PJI: " + "WTF?" + "<br/>" +
        "CPU Skew: " + "skewed" + "<br/>" +
        "IO Skew: " + "wowo" + "<br/>" +
        "Duration: " + "4242" + "<br/>" +
        "Timestamp: " + "341215341253" + "<br/>" +           
        "System ID: " + "7"
    );
}

NodeList.prototype.setNodeDescription = function(node) {
    var children = node.children || node._children;
    var childrenStr = '';

    for(var i in children) {
        if(children[i]) {
            childrenStr += children[i].function_name + ", ";
        }
    }

    this.nodeDescription.html(
        "Function Name: " + node.function_name + "<br/>------------------------------<br/>" +
        "Called By Function Name: " + node.called_by_function_name + "<br/>------------------------------<br/>" + 
        "Filename: " + node.filename + "<br/>------------------------------<br/>" +
        "ID: " + node.id + "<br/>------------------------------<br/>" + 
        "Local Variables: <code>" + JSON.stringify(node.local_variables) + "</code><br/>------------------------------<br/>" +
        "Position Called In: " + node.pos_called_in + "<br/>------------------------------<br/>" +
        "Time Finished: " + node.time + "<br/>------------------------------<br/>" +
        "Code: " + node.code + "<br/>------------------------------<br/>" +
        "Docstring: " + node.docstring + "<br/>------------------------------<br/>" +
        "Stack Trace: " + node.stack_trace + "<br/>------------------------------<br/>" +
        "Children: <code>" + childrenStr + "</code>"
    );
}
