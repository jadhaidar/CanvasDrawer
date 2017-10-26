var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var x, y, width, height;
var panels = [], panelTitles = [], panelElements = [];
var mouseDown = false, dblClick = false, newPanel = false;
var mouseDown2 = false;

// Constructor
function Panel() {
    return {
        'x': '',
        'y': '',
        'width': '',
        'height': '',
        'elements': []
    };
}

        
// Updates the canvas width and height in case the window is resized
function updateCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw();
}

// Updates cursor whenever mouse is over any of the panels, and enables dragging
function mouseOverPanels(e) {
    var mouseX = e.clientX, mouseY = e.clientY;
    
    // loop through all panels
    for (var i = 0; i < panels.length; i++) {
        // if cursor is within panel, set cursor to "pointer"
        if ((mouseX >= panels[i].x && mouseX <= panels[i].x + panels[i].width) && (mouseY >= panels[i].y && mouseY <= panels[i].y + panels[i].height)) {
            var mouseDown = false, isWithinPanelBanner = false;
            
            // if cursor is within panel banner, set cursor to "move", enable panel repositioning
            if (mouseY >= panels[i].y && mouseY <= panels[i].y + (panels[i].height / 4)) {
                isWithinPanelBanner = true;
                canvas.style.cursor = "move";
                canvas.addEventListener("mousedown", function (e) {
                    if (isWithinPanelBanner) {
                        console.log(isWithinPanelBanner);
                        mouseDown = true;
                        var dragoffx = mouseX - panels[i].x;
                        var dragoffy = mouseY - panels[i].y;
                        canvas.addEventListener("mousemove", function (e) {
                            if (mouseDown) {
                                var mouseX = e.clientX, mouseY = e.clientY;
                                panels[i].x = mouseX - dragoffx;
                                panels[i].y = mouseY - dragoffy;
                                
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                redraw();
                                
                                canvas.addEventListener("mouseup", function (e) {
                                    isWithinPanelBanner = false;
                                    mouseDown = false;
                                });
                            }
                        });
                    }
                });
                break;
            } 
            // if cursor is not within panel banner
            else {
                canvas.style.cursor = "pointer";
                mouseDown = false;
                isWithinPanelBanner = false;
                console.log(isWithinPanelBanner);
                break;
            }
        }
        // if cursor is not within panel
        else canvas.style.cursor = "crosshair";   
    }
}

// mousedown x and y
function getStartingPosition(e) {
    mouseDown = true;
    x = e.clientX, y = e.clientY;

    if (isWithinPanel(e)) {
        mouseDown = false;
    }

    canvas.addEventListener("dblclick", addElements);
    canvas.addEventListener("mousemove", selection);
}

// checks whether cursor is over a panel
function isWithinPanel(e) {
    var mouseX = e.clientX, mouseY = e.clientY;
    var isWithinPanel = false;
    
    // loop through all panels
    for (var i = 0; i < panels.length; i++) {
        // if cursor is within panel, return true
        if ((mouseX >= panels[i].x && mouseX <= panels[i].x + panels[i].width) && (mouseY >= panels[i].y && mouseY <= panels[i].y + panels[i].height)) {
            isWithinPanel = true;
            break;
        }
    } return isWithinPanel;
}

// mousemove width and height
function selection(e) {
    var newX = e.clientX, newY = e.clientY;
    if (newX == x && newY == y) { mouseDown = false; return; } // mouse haven't moved, enables double click

    if (mouseDown) {
        width = e.clientX - x;
        height = e.clientY - y;

        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
            
        // Selection box
        ctx.fillStyle = "rgba(170, 140, 197, 0.25)";
        ctx.fillRect(x, y, width, height);

        redraw();
                
        // Get width and height, then draw rectangle
        canvas.addEventListener("mouseup", getEndingPosition);
    }
}

// creates panel with x, y, width, height and pushes it to array
function getEndingPosition(e) {
    if (mouseDown) {
        mouseDown = false;

        var newX = e.clientX, newY = e.clientY;
        if (newX == x && newY == y) { mouseDown = false; return; } // mouse haven't moved, enables double click

        var panel = Panel();

        if (height < 250) height = 250;
        if (width < 200) width = 200;

        panel.x = x, panel.y = y, panel.width = width, panel.height = height;
        panels.push(panel);

        do {
            var title = window.prompt("Please enter the name of the table:");
        } while (title == null || title.length == 0);
        
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        panelTitles.push(title.charAt(0).toUpperCase() + title.substring(1));
        redraw();
    }
}

// adds elements to existing panels on double click
function addElements(e) {
    dblClick = true;
    var mouseX = e.clientX, mouseY = e.clientY;
    var element;
    
    for (var i = 0; i < panels.length; i++) {
        if ((mouseX >= panels[i].x && mouseX <= panels[i].x + panels[i].width) && (mouseY >= panels[i].y && mouseY <= panels[i].y + panels[i].height)) {
            do {
                for (var k = 0; k < panels[i].elements.length; k++) {
                    if ((panels[i].y + (panels[i].height / 4) + (k * 30)) >= panels[i].height) {
                        window.alert("This panel cannot hold any more elements, please create a larger one");
                        return;
                    }
                }
                
                element = window.prompt("Please enter the element to be inserted");
            } while (element == null || element.length == 0);

            panels[i].elements.push(element);
            redraw();
        }
    }
}

// utility function to draw all canvas elements
function redraw() {
    for (var i = 0; i < panels.length; i++) {
        // Panel
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(panels[i].x, panels[i].y, panels[i].width, panels[i].height);
        ctx.rect(panels[i].x, panels[i].y, panels[i].width, panels[i].height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(panels[i].x, panels[i].y, panels[i].width, panels[i].height);
            
        // Banner
        ctx.fillStyle = "#002e5d";
        ctx.fillRect(panels[i].x, panels[i].y, panels[i].width, panels[i].height / 4);
        
        // Title text
        ctx.font = "20px Verdana";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(panelTitles[i], panels[i].x + (panels[i].width / 2), panels[i].y + (panels[i].height / 7));
        
        // Element text
        ctx.font = "16px Verdana";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        for (var k = 0; k < panels[i].elements.length; k++) {
            ctx.fillText(panels[i].elements[k], panels[i].x + (panels[i].width / 2), panels[i].y + (panels[i].height / 4) + 30 + (k * 30));
        }
    }
}


// Initiate
window.onload = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", updateCanvas);
    canvas.addEventListener("mousedown", getStartingPosition);
    canvas.addEventListener("mousemove", mouseOverPanels);
}