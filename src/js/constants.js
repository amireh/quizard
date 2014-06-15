define([], function() {
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
    // Use strings for i18n
    ERROR_NOT_FOUND: 'NOT_FOUND',
    ERROR_ACCOUNT_REQUIRED: 'ERROR_ACCOUNT_REQUIRED',

    SESSION_CREATE: 'SESSION_CREATE',
    SESSION_DESTROY: 'SESSION_DESTROY',

    USER_CREATE: 'USER_CREATE',
    USER_LOAD: 'USER_LOAD',
    USER_MAX_PER_PAGE: 50,
    // Status code for when mass-enrollment is about to begin
    USER_MASS_ENROLLMENT_STARTED: 'USER_MASS_ENROLLMENT_STARTED',
    USER_MASS_ENROLL: 'USER_MASS_ENROLL',
    USER_MIN_ENROLL: 1,
    USER_MAX_ENROLL: 5000,
    USER_STUDENT_ENROLLMENT: 'StudentEnrollment',

    // Status codes for mass user enrollment
    USER_ENROLLMENT_COUNT_TOO_LOW: 'USER_ENROLLMENT_COUNT_TOO_LOW',
    USER_ENROLLMENT_COUNT_TOO_HIGH: 'USER_ENROLLMENT_COUNT_TOO_HIGH',
    USER_REGISTERING: 200,
    USER_REGISTRATION_FAILED: 201,
    USER_ENROLLING: 202,
    USER_ENROLLMENT_FAILED: 203,

    USER_LOADING: 'USER_LOADING',

    ACCOUNT_ACTIVATE: 'ACCOUNT_ACTIVATE',
    COURSE_ACTIVATE: 'COURSE_ACTIVATE',

    QUIZ_LOAD_MORE: 'QUIZ_LOAD_MORE',
    QUIZ_ACTIVATE: 'QUIZ_ACTIVATE',

    RECIPE_ENROLL_STUDENTS: '/recipes/enroll_students',
    RECIPE_ENROLL_STUDENTS_PROGRESS: '/recipes/enroll_students/progress',
    RECIPE_LOAD_STUDENTS: '/recipes/load_students',
    RECIPE_TAKE_QUIZ: '/recipes/take_quiz',

    ROUTE_GO_TO_QUIZ: 'ROUTE_GO_TO_QUIZ',

    QUIZ_TAKING_SET: 'QUIZ_TAKING_SET',
    QUIZ_TAKING_SET_RESPONSE_RATIO: 'QUIZ_TAKING_SET_RESPONSE_RATIO',
    QUIZ_TAKING_SET_RESPONSE_COUNT: 'QUIZ_TAKING_SET_RESPONSE_COUNT',
    QUIZ_TAKING_TAKE: 'QUIZ_TAKING_TAKE',
    QUIZ_TAKING_ADD_ANSWER: 'QUIZ_TAKING_ADD_ANSWER',
    QUIZ_TAKING_ADD_ANSWER_TO_VARIANT: 'QUIZ_TAKING_ADD_ANSWER_TO_VARIANT',
    QUIZ_TAKING_ADD_VARIANT: 'QUIZ_TAKING_ADD_VARIANT',
    QUIZ_TAKING_REMOVE_VARIANT: 'QUIZ_TAKING_REMOVE_VARIANT',

    QUIZ_TAKING_STARTED: 'QUIZ_TAKING_STARTED',
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
      'short_answer_question'
    ],

    QUESTIONS_WITH_ANSWER_SETS: [
      'fill_in_multiple_blanks_question',
      'multiple_dropdowns_question',
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

    VARIANT_HELP_TOOLTIP: [
      'Variants are combinations of answers that students will respond with.',
      'You can have as many variants as needed to cover all possible answers.'
    ].join(' '),

    MANUAL_RESPONSE_DISTRIBUTION_TOOLTIP: [
      'This option allows you to specify the ratio of',
      'responses each answer should receive *almost* exactly.'
    ].join(' '),

    DEFAULT_ID_PREFIX: 'quizard',
    STUDENT_EMAIL_DOMAIN: 'quizard.com',
    STUDENT_PASSWORD: 'quizard_student_password',

    STATUS_IDLE: 'idle',
    STATUS_BUSY: 'busy',
  };
});