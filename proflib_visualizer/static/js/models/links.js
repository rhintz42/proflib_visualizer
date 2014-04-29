function LinkList(tree, links) {
    var self = this;

    self.tree = tree;
    self.links = links;

    self.linkDiagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });
}

LinkList.prototype.getSVGList = function(links) {
    var self = this,
        svg = self.tree.getSVG();

    var svgLinks = svg.selectAll("path.link")
        .data(links, function(d) {
            return d.target.id;
        });

    return svgLinks;
}


// Enter any new links at the parent's previous position.
LinkList.prototype.createChildrenToParent = function(parentNode, svgLinks) {
    var self = this;

    svgLinks.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            var o = {
                x: parentNode.x0,
                y: parentNode.y0
            };
            return self.linkDiagonal({
                source: o,
                target: o
            });
        });
}


LinkList.prototype.transitionToNewPosition = function(svgLinks) {
    var self = this;

    svgLinks.transition()
        .duration(self.tree.getDuration())
        .attr("d", self.linkDiagonal);
}


// Transition exiting nodes to the parent's new position.
LinkList.prototype.transitionExitingToParentPosition = function(parentNode, svgLinks) {
    var self = this;

    svgLinks.exit().transition()
        .duration(self.tree.getDuration())
        .attr("d", function(d) {
            var o = {
                x: parentNode.x,
                y: parentNode.y
            };
            return self.linkDiagonal({
                source: o,
                target: o
            });
        })
        .remove();
}

LinkList.prototype.update = function(parentNode, updatedLinks) {
    var self = this,
        svgLinks = self.getSVGList(updatedLinks);
    
    self.links = updatedLinks;

    self.createChildrenToParent(parentNode, svgLinks);
    self.transitionToNewPosition(svgLinks);
    self.transitionExitingToParentPosition(parentNode, svgLinks);
}
