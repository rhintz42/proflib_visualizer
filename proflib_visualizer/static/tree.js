function Tree(visualizer, jsonFile) {
    var self = this;

    self.visualizer = visualizer;
    self.root;
    self.nodeCount = 0;

    self.tree = d3.layout.tree()
        .size([self.visualizer.height, self.visualizer.width]);


    d3.json(self.visualizer.jsonFile, function(error, flare) {
        self.root = flare;
        self.root.x0 = self.visualizer.height / 2;
        self.root.y0 = 0;

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }
        self.root.children.forEach(collapse);

        self.links = self.createLinks();
        self.nodes = self.createNodes();
        self.update(self.root);

        return self.root;
    });
}


Tree.prototype.getDuration = function() {
    var self = this;

    return self.visualizer.duration;
}


Tree.prototype.getSVG = function() {
    var self = this;

    return self.visualizer.svg;
}


Tree.prototype.createLinks = function() {
    var self = this,
        nodes = self.tree.nodes(self.root).reverse(),
        links = self.tree.links(nodes);

    return new LinkList(self, links);
}


Tree.prototype.createNodes = function() {
    var self = this,
        nodes = self.tree.nodes(self.root).reverse();

    return new NodeList(self, nodes);
}

// Compute the new tree layout.
Tree.prototype.update = function(parentNode) {
    var self = this,
        nodes = self.tree.nodes(self.root).reverse(),
        links = self.tree.links(nodes);

    self.nodes.update(parentNode, nodes);
    self.links.update(parentNode, links);
}
