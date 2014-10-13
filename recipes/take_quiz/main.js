require('./routes/root');
require('./routes/show');
require('./routes/course');
require('./routes/quizzes/quiz');
require('./routes/quizzes/quiz/show');
require('./routes/quizzes/quiz/take');

function TakeQuizRecipe() {
}

TakeQuizRecipe.setup = function(match) {
  match('/').to('takeQuizRecipeShow');
  match('/courses/:course_id').to('course', function(match) {
    match('/quizzes/:quiz_id').to('quiz', function(match) {
      match('/').to('quizShow');
      match('/take').to('takeQuiz');
    });
  });
};

module.exports = TakeQuizRecipe;