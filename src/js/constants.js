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

    SESSION_CREATE: 'SESSION_CREATE',
    SESSION_DESTROY: 'SESSION_DESTROY',

    USER_CREATE: 'USER_CREATE',
    USER_LOAD_ALL: 'USER_LOAD_ALL',
    // Event triggered when mass-enrollment is about to begin
    USER_MASS_ENROLLMENT_STARTED: 'USER_MASS_ENROLLMENT_STARTED',
    USER_MASS_ENROLL: 'USER_MASS_ENROLL',
    USER_MIN_ENROLL: 1,
    USER_MAX_ENROLL: 5000,
    USER_STUDENT_ENROLLMENT: 'StudentEnrollment',

    // Status codes for mass user enrollment
    USER_ENROLLMENT_COUNT_TOO_LOW: 205,
    USER_ENROLLMENT_COUNT_TOO_HIGH: 206,
    USER_REGISTERING: 200,
    USER_REGISTRATION_FAILED: 201,
    USER_ENROLLING: 202,
    USER_ENROLLMENT_FAILED: 203,

    ACCOUNT_ACTIVATE: 'ACCOUNT_ACTIVATE',
    COURSE_ACTIVATE: 'COURSE_ACTIVATE',

    QUIZ_LOAD_MORE: 'QUIZ_LOAD_MORE',
    QUIZ_ACTIVATE: 'QUIZ_ACTIVATE',

    RECIPE_ENROLL_STUDENTS: '/recipes/enroll_students',
    RECIPE_ENROLL_STUDENTS_PROGRESS: '/recipes/enroll_students/progress',
    RECIPE_TAKE_QUIZ: '/recipes/take_quiz',

    ROUTE_GO_TO_QUIZ: 'ROUTE_GO_TO_QUIZ',

    QUIZ_TAKING_SET: 'QUIZ_TAKING_SET',
    QUIZ_TAKING_SET_RESPONSE_RATIO: 'QUIZ_TAKING_SET_RESPONSE_RATIO',
    QUIZ_TAKING_TAKE: 'QUIZ_TAKING_TAKE',
    QUIZ_TAKING_ADD_ANSWER: 'QUIZ_TAKING_ADD_ANSWER',
    QUIZ_TAKING_ADD_ANSWER_TO_VARIANT: 'QUIZ_TAKING_ADD_ANSWER_TO_VARIANT',
    QUIZ_TAKING_ADD_VARIANT: 'QUIZ_TAKING_ADD_VARIANT',
    QUIZ_TAKING_REMOVE_VARIANT: 'QUIZ_TAKING_REMOVE_VARIANT',

    QUIZ_TAKING_STATUS_IDLE: 106,

    // Preparing the submission.
    QUIZ_TAKING_STATUS_PREPARING: 100,
    QUIZ_TAKING_STATUS_PREPARATION_FAILED: 101,

    // Answering it using the QuizTaker.
    QUIZ_TAKING_STATUS_ANSWERING: 102,
    QUIZ_TAKING_STATUS_ANSWERING_FAILED: 103,

    // Turning it in.
    QUIZ_TAKING_STATUS_TURNING_IN: 104,
    QUIZ_TAKING_STATUS_TURNING_IN_FAILED: 105,

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