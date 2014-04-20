function NodeList(tree, nodes) {
    var self = this;

    self.tree = tree;
    self.nodes = nodes;
}


// Enter any new nodes at the parent's previous position.
NodeList.prototype.createChildToParentPosition = function(parentNode, svgNodes) {
    var self = this;

    var nodeEnter = svgNodes.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + parentNode.y0 + "," + parentNode.x0 + ")";
        })
        .on("click", self.click.bind(self));

    nodeEnter.append("rect")
        .attr("x", -30)
        .attr("y", -10)
        .attr("width", 60)
        .attr("height", 20);

    nodeEnter.append("text")
        .attr("x", function(d) {
            return d.children || d._children ? -35 : 35;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.name;
        })
        .style("fill-opacity", 1e-6);
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
        .attr("r", 4.5)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

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
        .attr("r", 1e-6);

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
        d.y = d.depth * 180;
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
    self.tree.update(d);
}
