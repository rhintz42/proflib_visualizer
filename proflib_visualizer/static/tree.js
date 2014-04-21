function Tree(visualizer, jsonFile) {
    var self = this;

    self.visualizer = visualizer;
    self.root;
    self.nodeCount = 0;

    self.tree = d3.layout.tree()
        .size([self.visualizer.getHeight(), self.visualizer.getWidth()]);


    d3.json(self.visualizer.jsonFile, function(error, flare) {
        // This makes it so can have more children functions and more than 1
        //  actual root
        var i = 0;
        self.root = {'name': 'root', 'dummy': true, 'children': []}
        for(; i < flare.length; i++) {
            self.root.children.push(flare[i]);
        }
        //self.root = flare;
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

    return self.visualizer.g;
}


Tree.prototype.createLinks = function() {
    var self = this,
        nodes = self.getAllNodes(),
        links = self.getAllLinksForNodes(nodes);

    return new LinkList(self, links);
}


Tree.prototype.createNodes = function() {
    var self = this,
        nodes = self.getAllNodes();

    return new NodeList(self, nodes);
}

Tree.prototype.getAllNodes = function() {
    var self = this,
        nodes = self.tree.nodes(self.root).reverse(),
        i = nodes.length - 1;

    //removes the dummy root node from the array
    for(; i >= 0; i--) {
        if(nodes[i].dummy) {
            nodes.splice(i, 1);
            break;
        }
    }

    return nodes;
}

Tree.prototype.getAllLinksForNodes = function(nodes) {
    var self = this;

    return self.tree.links(nodes);
}

// Compute the new tree layout.
Tree.prototype.update = function(parentNode) {
    var self = this,
        nodes = self.getAllNodes(),
        links = self.getAllLinksForNodes(nodes);

    self.nodes.update(parentNode, nodes);
    self.links.update(parentNode, links);
}
