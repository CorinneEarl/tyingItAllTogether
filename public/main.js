$(document).ready(function(){		//when the page loads...

	function update(){

		//$(".questions").empty()
		$.ajax({method: "GET", url: 'http://localhost:3000/api/questions'}) //uses get method from index.js
			.done(function(data){
				data.sort(function(a,b){
					return b.votes-a.votes;
				})		
				$('.questions').empty().append(data.map(function(question){	//adds ?s to question div in index.html
					return question.question + "<span><input type='button' class='vote' value='vote' questionId='" + question._id + "'>Current Votes: "+ question.votes +"<br></span>";
				}))

				$('.vote').on('click', function(){
					var id = $(this).attr("questionId");
		 			$.ajax({method: "PUT", url: "api/questions/" + id})
		 				.done(update);
				})
			})
	};
	update();

	$('#submit-button').on('click', function(){			//when submit button pressed, do this...
		var question = { question : $('#question-text').val() };	//whatever typed in box, assign to value for question
		$.ajax({method: "POST", url: 'http://localhost:3000/api/questions', data: JSON.stringify(question), contentType: 'application/json'})
			.done(function(data){						// redirects to index page
				window.location.replace("./index.html");	
			})		
	})
	$(".login").on("click", function(){
		
	})
})