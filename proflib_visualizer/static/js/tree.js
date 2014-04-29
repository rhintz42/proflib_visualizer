//function Tree(visualizer, jsonFile) {
function Tree(visualizer, jsonFiles) {
    var self = this;

    self.visualizer = visualizer;
    self.root;
    self.nodeCount = 0;

    self.tree = d3.layout.tree()
        .size([self.visualizer.getHeight(), self.visualizer.getWidth()]);

    //self.createNodesAndLinks(self.visualizer.jsonFile);
    self.createNodesAndLinks(self.visualizer.jsonFiles, 0);
    
    // Put in function like initialize buttons
    $( "#node-add" )
        .click( function () {
            var nodes = self.getNodeList();
            var selectedNode = nodes.selected;

            if(selectedNode === null)
                selectedNode = self.root;

            // Toggle Children
            if(selectedNode.children === undefined || selectedNode.children === null) {
                selectedNode.children = selectedNode._children;
                selectedNode._children = null;
            }

            // Add to Node
            selectedNode.children.push({
                'function_name': 'test1',
                'called_by_function_name': selectedNode.function_name
            });
            self.update(selectedNode);
        });
    $( "#node-delete" )
        .click( function () {
            var nodes = self.getNodeList();
            var selectedNode = nodes.selected;

            if(selectedNode == null)
                return;

            var parentNode = selectedNode.parent;
            for(var i = 0; i < parentNode.children.length; i++) {
                if(parentNode.children[i].id == selectedNode.id) {
                    parentNode.children.splice(i, 1);
                    break;
                }
            }
            
            self.update(parentNode);
        });
    $( "#node-edit" )
        .click( function () {
            alert("EDIT clicked");
        });
    $( "#node-organize-up" )
        .click( function () {
            var nodes = self.getNodeList();
            var selectedNode = nodes.selected;

            if(selectedNode == null)
                return;

            var parentNode = selectedNode.parent;
            for(var i = parentNode.children.length-1; i > 0; i--) {
                if(parentNode.children[i].id == selectedNode.id) {
                    parentNode.children.splice(i, 1);
                    parentNode.children.splice(i-1, 0, selectedNode);
                    break;
                }
            }
            
            self.update(selectedNode);
        });
    $( "#node-organize-down" )
        .click( function () {
            var nodes = self.getNodeList();
            var selectedNode = nodes.selected;

            if(selectedNode == null)
                return;

            var parentNode = selectedNode.parent;
            for(var i = 0; i < parentNode.children.length-1; i++) {
                if(parentNode.children[i].id == selectedNode.id) {
                    parentNode.children.splice(i, 1);
                    parentNode.children.splice(i+1, 0, selectedNode);
                    break;
                }
            }
            
            self.update(selectedNode);
        });
}


Tree.prototype.collapseChildren = function() {
    var self = this;

    function collapse(d) {
        if (d && d.children) {
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

/*
    This function was created to keep the starting nodes in the correct order
    that they were given in
*/
Tree.prototype.recCreateNodesAndLinks = function(jsonFiles, index) {

    var self = this,
        f = jsonFiles[index]

    d3.json(f, function(error, obj) {
        // This makes it so can have more children functions and more than 1
        //  actual root
        
        // Add each root node from the jsonFile to the children of the dummy root
        obj.forEach(function(d) {
          if (d !== null) {
              self.root.children.push(d)
          }
        });

        if((index+1) < jsonFiles.length) {
            self.recCreateNodesAndLinks(jsonFiles, index + 1)
        } else {
            // Call this only when no more children to call
            self.collapseChildren();

            self.links = self.createLinks();
            self.nodes = self.createNodes();

            self.recFormatChildren(self.root);
            self.update(self.root);
        }

    });
}

Tree.prototype.recFormatChildren = function(root) {
    var self = this,
        i = 0;

    if(root.children) {
        while(i < root.children.length) {
            if(root.children[i] === null) {
                root.children.splice(i, 1);
                i--;
            }
            i++
        }

        for(var j in root.children) {
            self.recFormatChildren(root.children[j]);
        }
    } else if (root._children) {
        while(i < root._children.length) {
            if(root._children[i] === null) {
                root._children.splice(i, 1);
                i--;
            }
            i++
        }

        for(var j in root._children) {
            self.recFormatChildren(root._children[j]);
        }
    }
}

Tree.prototype.createNodesAndLinks = function(jsonFiles, index) {
    var self = this;
    
    self.root = newDummyRoot();

    self.recCreateNodesAndLinks(jsonFiles, index = 0)

    return self.root;
}

Tree.prototype.getAllLinksForNodes = function(nodes) {
    var self = this;

    return self.tree.links(nodes);
}

Tree.prototype.getNodeList = function() {
    return this.nodes;
}

Tree.prototype.getAllNodes = function() {
    var self = this,
        nodes = this.tree.nodes(this.root).reverse(),
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
