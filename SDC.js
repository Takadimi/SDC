var SDC = {
	/*** Text Area Options ***/
	hotkey:		     "126",
	backgroundColor: "#000",
	textColor:	     "#E2B279",
	height:			 "300px",

	/*** Container Options ***/
	anchorH:         "left",   // Either left or right.
	anchorV:         "bottom", // Either bottom or top.
	width:           "100%",

	applyOptions: function(options) {
		for (var key in options) {
			if (!options.hasOwnProperty(key)) continue;

			SDC[key] = options[key];
		}
	},

	init: function(options) {
		SDC.applyOptions(options);

		/*** Create Elements ***/
		var debugContainerElement               = document.createElement("div");
		debugContainerElement.id                = "debug_container";
		debugContainerElement.style.display     = "none";
		debugContainerElement.style.width       = SDC.width;
		debugContainerElement.style.height      = SDC.height;
		debugContainerElement.style.position    = "absolute";

		switch (SDC.anchorH) {
			case "right":
				debugContainerElement.style.right = "0";
				break;
			case "left":
			default:
				debugContainerElement.style.left = "0";
				break;
		}
		switch (SDC.anchorV) {
			case "top":
				debugContainerElement.style.top = "0";
				break;
			case "bottom":
			default:
				debugContainerElement.style.bottom = "0";
				break;
		}

		debugContainerElement.style.zIndex      = "9999";

		var debugHeaderBarElement               = document.createElement("div");
		debugHeaderBarElement.style.height      = "15px";
		debugHeaderBarElement.style.background  = "#646161";
		debugHeaderBarElement.style.color       = "#FFF";
		debugHeaderBarElement.style.border      = "1px solid #492121";
		debugHeaderBarElement.style.paddingLeft = "1%";
		debugHeaderBarElement.style.fontSize    = "0.8em";
		debugHeaderBarElement.innerText         = "simple-debug-console";

		var debugTextAreaElement                = document.createElement("textarea");
		debugTextAreaElement.id                 = "debug_text_area";
		debugTextAreaElement.style.width        = "99.5%";
		debugTextAreaElement.style.height       = SDC.height;
		debugTextAreaElement.style.background   = SDC.backgroundColor;
		debugTextAreaElement.style.color        = SDC.textColor;
		debugTextAreaElement.style.resize       = "none";
		debugTextAreaElement.setAttribute("readonly", "readonly");

		debugContainerElement.appendChild(debugHeaderBarElement);
		debugContainerElement.appendChild(debugTextAreaElement);
		document.body.appendChild(debugContainerElement);

		/*** Toggle Console Visibility ***/
		document.addEventListener("keypress", function(e) {
			if (e.which == SDC.hotkey) {
				if (debugContainerElement.style.display === "none") {
					debugContainerElement.style.display = "block";
					SDC.scrollToBottom();	
				} else {
					debugContainerElement.style.display = "none";
				}
			}

			if (debugContainerElement.style.display === "block") {
				if (e.which == "119") SDC.anchorTop("100%", "200px");
				if (e.which == "97") SDC.anchorLeft("35%", "98%");
				if (e.which == "115") SDC.anchorBottom("100%", "200px");
				if (e.which == "100") SDC.anchorRight("35%", "98%");
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
		var debugContainerElement = document.getElementById("debug_container");
		debugContainerElement.style.top    = top;
		debugContainerElement.style.right  = right;
		debugContainerElement.style.bottom = bottom;
		debugContainerElement.style.left   = left;
		debugContainerElement.style.width  = width;
		debugContainerElement.style.height = height;

		var debugTextAreaElement = document.getElementById("debug_text_area");
		debugTextAreaElement.style.height  = height;

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
		var debugTextAreaElement = document.getElementById("debug_text_area");
		if (debugTextAreaElement.scrollTop != debugTextAreaElement.scrollHeight) {
			debugTextAreaElement.scrollTop = debugTextAreaElement.scrollHeight;
		}
	},

	log: function(message) {
		var maxBufferLines = 200;

		var prepend     = "> ";
		var now         = new Date();
		var timestamp   = "(" + this.leftPad(now.getHours().toString(), 2, "0") + ":" + this.leftPad(now.getMinutes().toString(), 2, "0") + ":" + this.leftPad(now.getSeconds().toString(), 2, "0") + ") | ";

		var debugTextAreaElement = document.getElementById("debug_text_area");

		if (debugTextAreaElement.textContent.split("\n").length > maxBufferLines) {
			var firstLineEnding = debugTextAreaElement.textContent.indexOf("\n") + 1;

			debugTextAreaElement.textContent = debugTextAreaElement.textContent.substr(firstLineEnding);
		} 

		debugTextAreaElement.textContent = debugTextAreaElement.textContent + prepend + timestamp + message + "\n";

		SDC.scrollToBottom();
	}
};
