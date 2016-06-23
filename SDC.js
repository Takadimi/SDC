document.addEventListener("DOMContentLoaded", function() {
	// SDC.init();
});

document.onreadystatechange = function() {
	var state = document.readyState;

	if (state == "complete") {
		SDC.init();
	}
};

var SDC = {
	init: function() {
		var debugContainerElement               = document.createElement("div");
		debugContainerElement.id                = "debug_container";
		debugContainerElement.style.display     = "none";
		debugContainerElement.style.width       = "100%";
		debugContainerElement.style.position    = "absolute";
		debugContainerElement.style.bottom      = "0";
		debugContainerElement.style.left        = "0";
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
		debugTextAreaElement.style.height       = "300px";
		debugTextAreaElement.style.background   = "#000";
		debugTextAreaElement.style.color        = "#E2B279";
		debugTextAreaElement.style.resize       = "none";
		debugTextAreaElement.setAttribute("readonly", "readonly");

		debugContainerElement.appendChild(debugHeaderBarElement);
		debugContainerElement.appendChild(debugTextAreaElement);
		document.body.appendChild(debugContainerElement);

		document.addEventListener("keypress", function(e) {
			SDC.log(e.which);
			if (e.which == "96") {
				if (debugContainerElement.style.display === "none") {
					debugContainerElement.style.display = "block";
				} else {
					debugContainerElement.style.display = "none";
				}
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

		debugTextAreaElement.scrollTop = debugTextAreaElement.scrollHeight;
	}
};

function testLog() {
	var test_obj = {
		one: "ONE",
		two: 2,
		three: [ 1, 2, 3 ]
	}

	SDC.log(JSON.stringify(test_obj));
}
