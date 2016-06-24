var SDC = {
	/*** General Options ***/
	overrideConsoleLog:         false,
	showOnLoad:                 false,

	/*** Text Area Options ***/
	hotkey:                     "126",
	backgroundColor:            "#000",
	textColor:                  "#E2B279",

	/*** Container Options ***/
	anchorH:                    "left",   // Either left or right.
	anchorV:                    "bottom", // Either bottom or top.
	width:                      "100%",
	height:                     "300px",

	/*** Command FIFO Queue ***/
	commands:                   [],
	commandIndex:               "-1",

	applyOptions: function(options) {
		for (var key in options) {
			if (!options.hasOwnProperty(key)) continue;

			SDC[key] = options[key];
		}
	},

	applyStyle: function(element, styleOptions) {
		for (var key in styleOptions) {
			if (!styleOptions.hasOwnProperty(key)) continue;

			element.style[key] = styleOptions[key];
		}
	},

	init: function(options) {
		SDC.applyOptions(options);

		if (SDC.overrideConsoleLog === true) {
			console.log = function(message) {
				SDC.log(message);	
			};
		}

		/*** Create Elements ***/
		var sdcContainer = document.createElement("div");
		sdcContainer.id  = "debug_container";

		var anchors = {
			right  : "",
			left   : "",
			top    : "",
			bottom : ""
		};
	
		if (SDC.anchorH === "right") anchors.right  = "0";
		else                         anchors.left   = "0";

		if (SDC.anchorV === "top")   anchors.top    = "0";
		else                         anchors.bottom = "0";

		SDC.applyStyle(sdcContainer, {
			flexDirection : "column",
			fontFamily    : "'Courier New', Courier, monospace",
			position      : "absolute",
			display       : (SDC.showOnLoad) ? "flex" : "none",
			height        : SDC.height,
			width         : SDC.width,
			zIndex        : "9999",
			right         : anchors.right,
			left          : anchors.left,
			top           : anchors.top,
			bottom        : anchors.bottom
		});

		var sdcHeaderBar       = document.createElement("div");
		sdcHeaderBar.innerText = "simple-debug-console";
		SDC.applyStyle(sdcHeaderBar, {
			height        : "15px",
			background    : "#646161",
			color         : "#FFF",
			border        : "1px solid #492121",
			paddingLeft   : "1%",
			fontSize      : "0.8em",
			lineHeight    : "15px",
			paddingBottom : "4px",
			paddingTop    : "4px",
		});

		var sdcExpressionContainer = document.createElement("div");
		SDC.applyStyle(sdcExpressionContainer, {
			background   : "#BCAFAF",
			paddingTop   : "3px",
			paddingRight : "3px"
		});

		var sdcExpressionLabel       = document.createElement("label");
		sdcExpressionLabel.innerHTML = "=>&nbsp";
		SDC.applyStyle(sdcExpressionLabel, { float: "left" });

		var sdcExpressionSpan = document.createElement("span");
		SDC.applyStyle(sdcExpressionSpan, {
			display  : "block",
			overflow : "hidden"
		});

		var sdcExpressionInput = document.createElement("input");
		sdcExpressionInput.id  = "debug_expression_input";
		sdcExpressionInput.setAttribute("type", "text");
		SDC.applyStyle(sdcExpressionInput, {
			width   : "100%",
			border  : "0",
			padding : "1px 0 1px 0"
		});

		var sdcTextArea = document.createElement("textarea");
		sdcTextArea.id  = "debug_text_area";
		sdcTextArea.setAttribute("readonly", "readonly");
		SDC.applyStyle(sdcTextArea, {
			boxSizing  : "border-box",
			width      : "100%",
			height     : "100%",
			border     : "0",
			padding    : "0",
			background : SDC.backgroundColor,
			color      : SDC.textColor,
			fontFamily : "inherit",
			resize     : "none"
		});

		sdcExpressionSpan.appendChild(sdcExpressionInput);
		sdcExpressionContainer.appendChild(sdcExpressionLabel);
		sdcExpressionContainer.appendChild(sdcExpressionSpan);

		sdcContainer.appendChild(sdcHeaderBar);
		sdcContainer.appendChild(sdcExpressionContainer);	
		sdcContainer.appendChild(sdcTextArea);
		document.body.appendChild(sdcContainer);

		/*** Toggle Console Visibility ***/
		document.addEventListener("keypress", function(e) {
			if (e.which == SDC.hotkey) {
				if (sdcContainer.style.display === "none") {
					sdcContainer.style.display = "flex";
					sdcExpressionInput.focus();
					SDC.scrollToBottom();
				} else {
					sdcContainer.style.display = "none";
				}

				e.preventDefault();
			}
		});

		/*** Cycle Through Command Queue ***/
		sdcExpressionInput.addEventListener("keydown", function(e) {
			if (e.which == "40") {
				if (SDC.commandIndex == -1) {
					this.value = "";
				}

				if (SDC.commandIndex >= 0) {
					this.value = SDC.commands[SDC.commandIndex--];
				}
			}

			if (e.which == "38") { 
				if (SDC.commandIndex < (SDC.commands.length - 1)) {
					this.value = SDC.commands[++SDC.commandIndex];
				}
			}
		});

		/*** Evaluate Javascript Expression ***/
		sdcExpressionInput.addEventListener("keypress", function(e) {
			if (e.which == "13") {
				if (this.value === "clear") {
					sdcTextArea.textContent = "";
				} else {
					if (SDC.commands.length === 0 || (SDC.commands[0] !== this.value && this.value !== "")) {
						SDC.commands.unshift(this.value);
					}
						
					SDC.log("Expression: '" + this.value + "'");

					try {
						var expressionEvalResult = eval(this.value);
						SDC.log("\t\t-> " + expressionEvalResult);
					} catch (e) {
						SDC.log("\t\t-> " + e.message);
					}
				}

				this.value = "";
				SDC.commandIndex = -1;
			}
		});
	},

	leftPad: function(str, padding, paddingStr) {
		var temp = "";
		while (padding-- > str.length) {
			temp += paddingStr; 
		}
		temp += str;

		return temp;
	},

	setContainerPosition: function(top, right, bottom, left, width, height) {
		var sdcContainer = document.getElementById("debug_container");
		SDC.applyStyle(sdcContainer, {
			top    : top,
			right  : right,
			bottom : bottom,
			left   : left,
			width  : width,
			height : height
		});

		var sdcTextArea = document.getElementById("debug_text_area");
		SDC.applyStyle(sdcTextArea, { height: height });

		SDC.scrollToBottom();
	},

	anchorRight: function(width, height) {
		SDC.setContainerPosition(0, 0, "", "", width, height);
	},

	anchorLeft: function(width, height) {
		SDC.setContainerPosition(0, "", "", 0, width, height);
	},

	anchorBottom: function(width, height) {
		SDC.setContainerPosition("", "", 0, 0, width, height);
	},

	anchorTop: function(width, height) {
		SDC.setContainerPosition(0, "", "", 0, width, height);
	},

	scrollToBottom: function() {
		var sdcTextArea = document.getElementById("debug_text_area");
		if (sdcTextArea.scrollTop != sdcTextArea.scrollHeight) {
			sdcTextArea.scrollTop = sdcTextArea.scrollHeight;
		}
	},

	log: function(message) {
		var maxBufferLines = 200;

		var prepend     = "> ";
		var now         = new Date();
		var timestamp   = "(" + this.leftPad(now.getHours().toString(), 2, "0") + ":" + this.leftPad(now.getMinutes().toString(), 2, "0") + ":" + this.leftPad(now.getSeconds().toString(), 2, "0") + ") | ";

		var sdcTextArea = document.getElementById("debug_text_area");

		if (sdcTextArea.textContent.split("\n").length > maxBufferLines) {
			var firstLineEnding = sdcTextArea.textContent.indexOf("\n") + 1;

			sdcTextArea.textContent = sdcTextArea.textContent.substr(firstLineEnding);
		} 

		sdcTextArea.textContent = sdcTextArea.textContent + prepend + timestamp + message + "\n";
		SDC.scrollToBottom();
	}
};
