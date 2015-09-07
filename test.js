var QUnit =  require("steal-qunit");
var compute = require("can/compute/");
var observe = require("can-observe");
var stache = require("can/view/stache/");


QUnit.test("basics with object", function(){
	var person = observe({});
	person.first = "Justin";
	person.last = "Meyer";
	
	var fullName = can.compute(function(){
	  return person.first+" "+person.last;
	});
	
	QUnit.stop();
	
	fullName.bind("change", function(ev, newVal, oldVal){
		QUnit.start();
		QUnit.equal(newVal, "Vyacheslav Egorov");
		QUnit.equal(oldVal, "Justin Meyer");
	});
	
	// causes change event above
	can.batch.start();
	person.first = "Vyacheslav";
	person.last = "Egorov";
	can.batch.stop();
});

// nested properties?
QUnit.test("basics with array", function(){
	var hobbies = observe(["basketball","programming"]);
	
	var hobbiesList = can.compute(function(){
	  return hobbies.join(",");
	});
	
	
	hobbiesList.bind("change", function(ev, newVal, oldVal){
		QUnit.equal(newVal, "basketball");
		QUnit.equal(oldVal, "basketball,programming");
	});
	
	// causes change event above
	hobbies.pop();
});


QUnit.test("compose to stache", function(){
	var person = observe({first: "Marshall", last: "Thompson"});
	var hobbies = observe(["music","programming"]);
	
	
	var fullName = function(){
		return person.first + " " + person.last;
	};
	var hobbiesList = function(){
		return hobbies.join(",");
	};
	
	var info = function(){
		return fullName() + " likes: "+hobbiesList();
	};
	
	var frag = can.stache("<span>{{info}}</span>")({info: info});
	
	QUnit.equal(frag.firstChild.innerHTML, "Marshall Thompson likes: music,programming");
	
	hobbies.pop();
	person.first = "Justin";
	person.last = "Meyer";
	
	QUnit.equal(frag.firstChild.innerHTML, "Justin Meyer likes: music");
	
	
})



