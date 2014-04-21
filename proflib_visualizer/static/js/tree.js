function Tree(visualizer, jsonFile) {
    var self = this;

    self.visualizer = visualizer;
    self.root;
    self.nodeCount = 0;

    self.tree = d3.layout.tree()
        .size([self.visualizer.getHeight(), self.visualizer.getWidth()]);

    self.createNodesAndLinks(self.visualizer.jsonFile);
}


Tree.prototype.collapseChildren = function() {
    var self = this;

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    self.root.children.forEach(collapse);
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


Tree.prototype.createNodesAndLinks = function(jsonFile) {
    var self = this;

    d3.json(jsonFile, function(error, obj) {
        // This makes it so can have more children functions and more than 1
        //  actual root
        self.root = newDummyRoot();
        
        // Add each root node from the jsonFile to the children of the dummy root
        obj.forEach(function(d) {
          self.root.children.push(d)
        });

        self.collapseChildren();

        self.links = self.createLinks();
        self.nodes = self.createNodes();
        self.update(self.root);

        return self.root;
    });
}

Tree.prototype.getAllLinksForNodes = function(nodes) {
    var self = this;

    return self.tree.links(nodes);
}

Tree.prototype.getAllNodes = function() {
    var self = this,
        nodes = self.tree.nodes(self.root).reverse(),
        i;

    //removes the dummy root node from the array
    for(i = nodes.length - 1; i >= 0; i--) {
        if(nodes[i].dummy) {
            nodes.splice(i, 1);
            break;
        }
    }

    return nodes;
}


Tree.prototype.getDuration = function() {
    var self = this;

    return self.visualizer.duration;
}


Tree.prototype.getSVG = function() {
    var self = this;

    return self.visualizer.g;
}

// Compute the new tree layout.
Tree.prototype.update = function(parentNode) {
    var self = this,
        nodes = self.getAllNodes(),
        links = self.getAllLinksForNodes(nodes);

    self.nodes.update(parentNode, nodes);
    self.links.update(parentNode, links);
}

//---------------------------------- Functions -----------------------------
function newDummyRoot() {
    return {
        'name': 'root',
        'dummy': true,
        'children': []
    }
}
