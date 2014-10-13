/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/recipes/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*************************************************************************!*\
  !*** /home/kandie/Workspace/Projects/Quizard/recipes/take_quiz/main.js ***!
  \*************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Quiz = __webpack_require__(/*! ./models/quiz */ 1);
	
	var routeMap = function(match) {
	  match('/recipes/take_quiz').to('takeQuizRecipe');
	  match('/courses/:course_id').to('course', function(match) {
	    match('/quizzes/:quiz_id').to('quiz', function(match) {
	      match('/').to('quizShow');
	      match('/take').to('takeQuiz');
	    });
	  });
	};
	
	var Recipe = function() {};
	
	module.exports = Recipe;

/***/ },
/* 1 */
/*!********************************************************************************!*\
  !*** /home/kandie/Workspace/Projects/Quizard/recipes/take_quiz/models/quiz.js ***!
  \********************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var Pixy = __webpack_require__(/*! pixy */ 2);
	var BaseQuiz = __webpack_require__(/*! models/quiz */ 4);
	var QuizQuestion = __webpack_require__(/*! ./quiz_question */ 3);
	var Collection = Pixy.Collection;
	
	var Quiz = BaseQuiz.extend({
	  initialize: function() {
	    var quiz = this;
	
	    this.questions = new Collection([], {
	      comparator: function(model) {
	        return model.get('position');
	      },
	
	      url: function() {
	        return quiz.url() + '/questions?page=' + (this.meta.currentPage || 1);
	      },
	
	      model: QuizQuestion
	    });
	
	    return BaseQuiz.prototype.initialize.apply(this, arguments);
	  },
	
	
	  toProps: function() {
	    var props = BaseQuiz.prototype.toProps.call(this);
	
	    props.questions = this.questions.toProps().filter(function(question) {
	      return question.type !== 'text_only_question';
	    });
	
	    return props;
	  }
	})

/***/ },
/* 2 */
/*!***********************!*\
  !*** external "pixy" ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = pixy;

/***/ },
/* 3 */
/*!*****************************************************************************************!*\
  !*** /home/kandie/Workspace/Projects/Quizard/recipes/take_quiz/models/quiz_question.js ***!
  \*****************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	  var Pixy = __webpack_require__(/*! pixy */ 2);
	  var K = __webpack_require__(/*! constants */ 6);
	  var _ = __webpack_require__(/*! underscore */ 5);
	  var pluck = _.pluck;
	  var where = _.where;
	  var uniq = _.uniq;
	  var extend = _.extend;
	  var contains = _.contains;
	  var uniqueId = _.uniqueId;
	  var remove = _.remove;
	  var sample = _.sample;
	  var I = function() {};
	
	  var AnswerDecorators = {
	    numericalQuestion: function(answer) {
	      var type = answer.numerical_answer_type || 'auto';
	
	      if (type === K.QUESTION_NUMERICAL_EXACT_ANSWER) {
	        answer.text = answer.exact;
	      }
	      else if (type === K.QUESTION_NUMERICAL_RANGE_ANSWER) {
	        answer.text = answer.start + '..' + answer.end;
	      }
	
	      delete answer.numerical_answer_type;
	      answer.type = type;
	    },
	    // We gon' trick the answer picker into treating this just like a numerical
	    // question by extracing the number found in the "answer" property, and
	    // renaming it to "exact" so it gets treated the same way
	    calculatedQuestion: function(answer) {
	      if (answer.answer) {
	        answer.type = K.QUESTION_NUMERICAL_EXACT_ANSWER;
	        answer.text = answer.exact = answer.answer;
	      } else {
	        answer.type = 'auto';
	      }
	    },
	
	    matchingQuestion: function(answer) {
	      answer.matchId = ''+answer.match_id;
	      delete answer.right;
	      delete answer.match_id;
	    }
	  };
	
	  var extractBlanks = function(answers) {
	    return uniq(pluck(answers, 'blank_id'));
	  };
	
	  var mkUnknownAnswer = function(id, attrs) {
	    return extend({
	      id: [ K.QUESTION_UNKNOWN_ANSWER, id ].join('_'),
	      text: K.QUESTION_UNKNOWN_ANSWER_TEXT,
	      unknown: true
	    }, attrs);
	  };
	
	  var mkMissingAnswer = function(id, attrs) {
	    return extend({
	      id: [ K.QUESTION_MISSING_ANSWER, id ].join('_'),
	      text: K.QUESTION_MISSING_ANSWER_TEXT,
	      missing: true
	    }, attrs);
	  };
	
	  var buildVariant = function() {
	    return {
	      id: uniqueId(),
	      responseRatio: 0,
	      remainingRespondents: 0,
	      answerIds: []
	    };
	  };
	
	  var QuizQuestion = Pixy.Model.extend({
	    name: 'QuizQuestion',
	
	    urlRoot: function() {
	      return this.collection.url(true);
	    },
	
	    parse: function(payload) {
	      var attrs = {};
	      var id = ''+payload.id;
	      var type = payload.question_type;
	      var answers = payload.answers || [];
	      var answerSets = [];
	      var answerDecorator = I;
	
	      if (type) {
	        answerDecorator = AnswerDecorators[type.camelize(true)] || I;
	      }
	
	      // Wrap all answers in "answerSets" to normalize access between
	      // question types that have multiple sets (like blanks) and those that
	      // don't
	      if (contains(K.QUESTIONS_WITH_ANSWER_SETS, type)) {
	        answerSets = extractBlanks(answers).map(function(blankId) {
	          return {
	            id: blankId,
	            answers: where(answers, { blank_id: blankId })
	          };
	        });
	      } else {
	        answerSets.push({
	          id: 'auto',
	          answers: answers
	        });
	      }
	
	      // Generate answers for students who should skip the question, and those
	      // who should answer randomly for free-form input questions
	      if (contains(K.FREE_FORM_INPUT_QUESTIONS, type)) {
	        answerSets.forEach(function(set) {
	          set.answers.push(mkUnknownAnswer(id + '_' + set.id));
	        });
	      }
	
	      // Now we stringify ids and decorate answers
	      answerSets.forEach(function(set) {
	        var responseRatioDistributed = false;
	
	        set.answers.push(mkMissingAnswer(id + '_' + set.id));
	        set.answers.forEach(function(answer) {
	          answer.id = ''+answer.id;
	          answer.correct = answer.weight === 100;
	          answer.remainingRespondents = 0;
	          answer.responseRatio = 0;
	
	          if (answer.correct && !responseRatioDistributed) {
	            responseRatioDistributed = true;
	            answer.responseRatio = 100;
	          }
	
	          delete answer.weight;
	          delete answer.comments;
	          delete answer.html;
	
	          answerDecorator(answer);
	        });
	
	        // If the question does not have a correct answer, e.g Essay, then
	        // choose an answer at random and give it the initial response ratio
	        if (!responseRatioDistributed && set.answers.length) {
	          sample(set.answers).responseRatio = 100;
	        }
	      });
	
	      attrs.id = id;
	      attrs.type = payload.question_type;
	      attrs.text = payload.question_text;
	      attrs.answerType = 'random';
	      attrs.answerSets = answerSets;
	      attrs.autoGradable = contains(K.MANUALLY_GRADED_QUESTIONS, type);
	      attrs.pointsPossible = payload.points_possible;
	
	      if (contains(K.QUESTIONS_WITH_VARIANTS, type)) {
	        // Start out with a default empty variant
	        attrs.variants = [ buildVariant() ];
	        attrs.variants[0].responseRatio = 100;
	
	        remove(attrs.answerSets[0].answers, {
	          id: [ K.QUESTION_MISSING_ANSWER, id, 'auto' ].join('_')
	        });
	      }
	
	      if (type === 'matching_question') {
	        attrs.matches = payload.matches.map(function(match) {
	          return {
	            id: ''+match.match_id,
	            text: match.text
	          };
	        }).concat(mkMissingAnswer(id));
	      }
	
	      return attrs;
	    },
	
	    toProps: function() {
	      var props = this.pick([
	        'id',
	        'type',
	        'text',
	        'answerType',
	        'answerSets',
	        'variants',
	        'position',
	        'matches'
	      ]);
	
	      // which is basically everything.. duh
	
	      return props;
	    },
	
	    addVariant: function() {
	      this.get('variants').push(buildVariant());
	    },
	
	    removeVariant: function(variantId) {
	      var variants = this.get('variants');
	
	      if (variants.length === 1) {
	        return false;
	      }
	
	      remove(variants, { id: variantId });
	
	      if (variants.length === 1) {
	        variants[0].responseRatio = 100;
	      }
	
	      this.set('variants', variants);
	    },
	
	    getResponsePool: function() {
	      if (contains(K.QUESTIONS_WITH_VARIANTS, this.get('type'))) {
	        return this.get('variants');
	      }
	      else {
	        return this.get('answerSets').reduce(function(answers, set) {
	          return answers.concat(set.answers);
	        }, []);
	      }
	    }
	  });
	
	  return QuizQuestion;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/*!************************!*\
  !*** ./models/quiz.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function(require) {
	  var Pixy = __webpack_require__(/*! pixy */ 2);
	  var Model = Pixy.Model;
	
	  /**
	   * @class Models.Quiz
	   */
	  return Model.extend({
	    name: 'Quiz',
	
	    urlRoot: function() {
	      return this.collection.url(true);
	    },
	
	    parse: function(payload) {
	      if (payload.title) {
	        payload.name = payload.title;
	        delete payload.title;
	      }
	
	      return payload;
	    },
	
	    toProps: function() {
	      var props = {};
	
	      props.id = this.get('id') + '';
	      props.name = this.get('name');
	      props.url = this.url();
	
	      return props;
	    }
	  });
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/*!*****************************!*\
  !*** external "underscore" ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = underscore;

/***/ },
/* 6 */
/*!**********************!*\
  !*** ./constants.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	  return {
	    MODEL_EVENTS: 'change sync',
	    COLLECTION_EVENTS: 'add change remove reset fetch',
	
	    ACCESS_POLICY_PUBLIC: 'public',
	    ACCESS_POLICY_PRIVATE: 'private',
	
	    APP_PRIMARY_LAYER: 'APP_PRIMARY_LAYER',
	    APP_SECONDARY_LAYER: 'APP_SECONDARY_LAYER',
	    APP_TRACK_ROUTE: 'APP_TRACK_ROUTE',
	
	    ERROR_ACCESS_UNAUTHORIZED: 'Unauthorized',
	    ERROR_ACCESS_OVERAUTHORIZED: 'Overauthorized',
	    ERROR_NOT_FOUND: 'NOT_FOUND',
	
	    ACCOUNT_REQUIRED: 'ACCOUNT_REQUIRED',
	    COURSE_REQUIRED: 'COURSE_REQUIRED',
	
	    SESSION_CREATE: 'SESSION_CREATE',
	    SESSION_DESTROY: 'SESSION_DESTROY',
	
	    USER_CREATE: 'USER_CREATE',
	    USER_LOAD: 'USER_LOAD',
	    USER_MAX_PER_PAGE: 50,
	    USER_MASS_ENROLL: 'USER_MASS_ENROLL',
	    USER_MIN_ENROLL: 1,
	    USER_MAX_ENROLL: 5000,
	    USER_STUDENT_ENROLLMENT: 'StudentEnrollment',
	
	    // Status codes for mass user enrollment
	    USER_ENROLLMENT_COUNT_TOO_LOW: 'USER_ENROLLMENT_COUNT_TOO_LOW',
	    USER_ENROLLMENT_COUNT_TOO_HIGH: 'USER_ENROLLMENT_COUNT_TOO_HIGH',
	
	    USER_REGISTERING: 'USER_REGISTERING',
	    USER_ENROLLING: 'USER_ENROLLING',
	    USER_LOADING: 'USER_LOADING',
	
	    ACCOUNT_ACTIVATE: 'ACCOUNT_ACTIVATE',
	    COURSE_ACTIVATE: 'COURSE_ACTIVATE',
	
	    QUIZ_ACTIVATE: 'QUIZ_ACTIVATE',
	
	    RECIPE_ENROLL_STUDENTS: '/recipes/enroll_students',
	    RECIPE_ENROLL_STUDENTS_PROGRESS: '/recipes/enroll_students/progress',
	    RECIPE_LOAD_STUDENTS: '/recipes/load_students',
	    RECIPE_TAKE_QUIZ: '/recipes/take_quiz',
	
	    ROUTE_GO_TO_QUIZ: 'ROUTE_GO_TO_QUIZ',
	
	    QUIZ_TAKING_SET: 'QUIZ_TAKING_SET',
	    QUIZ_TAKING_SET_RESPONSE_RATIO: 'QUIZ_TAKING_SET_RESPONSE_RATIO',
	    QUIZ_TAKING_SET_RESPONSE_COUNT: 'QUIZ_TAKING_SET_RESPONSE_COUNT',
	    QUIZ_TAKING_RANDOMIZE_RESPONSE_RATIOS: 'QUIZ_TAKING_RANDOMIZE_RESPONSE_RATIOS',
	    QUIZ_TAKING_TAKE: 'QUIZ_TAKING_TAKE',
	    QUIZ_TAKING_ADD_ANSWER_TO_VARIANT: 'QUIZ_TAKING_ADD_ANSWER_TO_VARIANT',
	    QUIZ_TAKING_ADD_VARIANT: 'QUIZ_TAKING_ADD_VARIANT',
	    QUIZ_TAKING_REMOVE_VARIANT: 'QUIZ_TAKING_REMOVE_VARIANT',
	
	    QUIZ_TAKING_RESPONSE_COUNT_REQUIRED: 'QUIZ_TAKING_RESPONSE_COUNT_REQUIRED',
	    QUIZ_TAKING_NOT_ENOUGH_STUDENTS: 'QUIZ_TAKING_NOT_ENOUGH_STUDENTS',
	    QUIZ_TAKING_RESPONSE_GENERATION_FAILED: 'QUIZ_TAKING_RESPONSE_GENERATION_FAILED',
	
	    // Preparing the submission.
	    QUIZ_TAKING_PREPARING: 'QUIZ_TAKING_PREPARING',
	    QUIZ_TAKING_PREPARATION_FAILED: 'QUIZ_TAKING_PREPARATION_FAILED',
	
	    // Answering it using the QuizTaker.
	    QUIZ_TAKING_ANSWERING: 'QUIZ_TAKING_ANSWERING',
	    QUIZ_TAKING_ANSWERING_FAILED: 'QUIZ_TAKING_ANSWERING_FAILED',
	
	    // Turning it in.
	    QUIZ_TAKING_TURNING_IN: 'QUIZ_TAKING_TURNING_IN',
	    QUIZ_TAKING_TURNING_IN_FAILED: 'QUIZ_TAKING_TURNING_IN_FAILED',
	
	    QUIZ_TAKING_LOADING_STUDENTS: 'quizTakingStatusLoadingStudents',
	
	    FREE_FORM_INPUT_QUESTIONS: [
	      'fill_in_multiple_blanks_question',
	      'essay_question',
	      'short_answer_question',
	      'numerical_question',
	      'calculated_question',
	    ],
	
	    QUESTIONS_WITH_ANSWER_SETS: [
	      'fill_in_multiple_blanks_question',
	      'multiple_dropdowns_question',
	      // 'matching_question',
	    ],
	
	    QUESTIONS_WITH_VARIANTS: [
	      'multiple_answers_question',
	      'matching_question',
	    ],
	
	    MANUALLY_GRADED_QUESTIONS: [
	      'essay_question',
	      'file_upload_question'
	    ],
	
	    QUESTION_MISSING_ANSWER: 'none',
	    QUESTION_MISSING_ANSWER_TEXT: 'No Answer',
	    QUESTION_UNKNOWN_ANSWER: 'other',
	    QUESTION_UNKNOWN_ANSWER_TEXT: 'Something Else',
	    QUESTION_NUMERICAL_EXACT_ANSWER: 'exact_answer',
	    QUESTION_NUMERICAL_RANGE_ANSWER: 'range_answer',
	
	    DEFAULT_ID_PREFIX: 'quizard',
	    STUDENT_EMAIL_DOMAIN: 'quizard.com',
	    STUDENT_PASSWORD: 'quizard_student_password',
	
	    OPERATION_ACTIVE: 'OPERATION_ACTIVE',
	    OPERATION_ABORT: 'OPERATION_ABORT',
	    OPERATION_ABORTED: 'OPERATION_ABORTED',
	    OPERATION_FAILED: 'OPERATION_FAILED',
	    OPERATION_COMPLETE: 'OPERATION_COMPLETE',
	    OPERATION_BOX_MINIMIZE: 'OPERATION_BOX_MINIMIZE',
	    OPERATION_BOX_RESTORE: 'OPERATION_BOX_RESTORE',
	
	    SETTINGS_SAVE: 'SETTINGS_SAVE',
	  };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])
//# sourceMappingURL=take_quiz.js.map