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

	init: function(options) {
		SDC.applyOptions(options);

		if (SDC.overrideConsoleLog === true) {
			console.log = function(message) {
				SDC.log(message);	
			};
		}

		/*** Create Elements ***/
		var sdcContainer                 = document.createElement("div");
		sdcContainer.id                  = "debug_container";
		sdcContainer.style.flexDirection = "column";
		sdcContainer.style.fontFamily    = "'Courier New', Courier, monospace";
		sdcContainer.style.position      = "absolute";
		sdcContainer.style.display       = (SDC.showOnLoad) ? "flex" : "none";
		sdcContainer.style.height        = SDC.height;
		sdcContainer.style.width         = SDC.width;
		sdcContainer.style.zIndex        = "9999";

		switch (SDC.anchorH) {
			case "right":
				sdcContainer.style.right = "0";
				break;
			case "left":
			default:
				sdcContainer.style.left = "0";
				break;
		}
		switch (SDC.anchorV) {
			case "top":
				sdcContainer.style.top = "0";
				break;
			case "bottom":
			default:
				sdcContainer.style.bottom = "0";
				break;
		}

		var sdcHeaderBar                 = document.createElement("div");
		sdcHeaderBar.style.height        = "15px";
		sdcHeaderBar.style.background    = "#646161";
		sdcHeaderBar.style.color         = "#FFF";
		sdcHeaderBar.style.border        = "1px solid #492121";
		sdcHeaderBar.style.paddingLeft   = "1%";
		sdcHeaderBar.style.fontSize      = "0.8em";
		sdcHeaderBar.style.lineHeight    = "15px";
		sdcHeaderBar.style.paddingBottom = "4px";
		sdcHeaderBar.style.paddingTop    = "4px";
		sdcHeaderBar.innerText           = "simple-debug-console";

		var sdcExpressionContainer                = document.createElement("div");
		sdcExpressionContainer.style.background   = "#BCAFAF";
		sdcExpressionContainer.style.paddingTop   = "3px";
		sdcExpressionContainer.style.paddingRight = "3px";

		var sdcExpressionLabel         = document.createElement("label");
		sdcExpressionLabel.innerHTML   = "=>&nbsp";
		sdcExpressionLabel.style.float = "left";

		var sdcExpressionSpan            = document.createElement("span");
		sdcExpressionSpan.style.display  = "block";
		sdcExpressionSpan.style.overflow = "hidden";

		var sdcExpressionInput           = document.createElement("input");
		sdcExpressionInput.id            = "debug_expression_input";
		sdcExpressionInput.style.width   = "100%";
		sdcExpressionInput.style.border  = "0";
		sdcExpressionInput.style.padding = "1px 0 1px 0";
		sdcExpressionInput.setAttribute("type", "text");

		var sdcTextArea				 = document.createElement("textarea");
		sdcTextArea.id               = "debug_text_area";
		sdcTextArea.style.boxSizing  = "border-box";
		sdcTextArea.style.width      = "100%";
		sdcTextArea.style.height     = "100%";
		sdcTextArea.style.border     = "0";
		sdcTextArea.style.padding    = "0";
		sdcTextArea.style.background = SDC.backgroundColor;
		sdcTextArea.style.color      = SDC.textColor;
		sdcTextArea.style.fontFamily = "inherit";
		sdcTextArea.style.resize     = "none";
		sdcTextArea.setAttribute("readonly", "readonly");

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
		sdcContainer.style.top    = top;
		sdcContainer.style.right  = right;
		sdcContainer.style.bottom = bottom;
		sdcContainer.style.left   = left;
		sdcContainer.style.width  = width;
		sdcContainer.style.height = height;

		var sdcTextArea = document.getElementById("debug_text_area");
		sdcTextArea.style.height  = height;

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
