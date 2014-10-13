
  var routeMap = function(match) {
    match('/recipes/take_quiz').to('takeQuizRecipe');
    match('/courses/:course_id').to('course', function(match) {
      match('/quizzes/:quiz_id').to('quiz', function(match) {
        match('/').to('quizShow');
        match('/take').to('takeQuiz');
      });
    });
  };