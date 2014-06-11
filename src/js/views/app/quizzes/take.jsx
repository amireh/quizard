/** @jsx React.DOM */
define([ 'react', 'actions/quizzes' ], function(React, QuizActions) {
  var TakeQuiz = React.createClass({
    mixins: [ React.addons.LinkedStateMixin ],

    getInitialState: function() {
      return {
        quizId: null
      };
    },

    getDefaultProps: function() {
      return {
        quizzes: []
      };
    },

    render: function() {
      return(
        <div>
          Enter a quiz id or load available quizzes to choose from.

          <p>
            <input
              className="form-input"
              type="text"
              placeholder="Quiz id"
              valueLink={this.linkState('quizId')} />
            {' '}
            <button className="btn btn-success" onClick={this.onLoadQuiz}>
              <i className="icon-checkmark" />
            </button>
          </p>

          <hr />

          <ul>
            {this.props.quizzes.map(this.renderQuiz)}
          </ul>

          {this.props.hasMoreQuizzes && this.renderPaginator()}
        </div>
      );
    },

    renderQuiz: function(quiz) {
      return <li key={quiz.id}>{quiz.name}</li>;
    },

    renderPaginator: function() {
      return (
        <footer className="actions">
          <button className="btn" onClick={this.onLoadMore}>
            Load more
          </button>
        </footer>
      );
    },

    onLoadMore: function() {
      QuizActions.loadMore();
    },

    onLoadQuiz: function(e) {
      e.preventDefault();

      QuizActions.activate(this.state.quizId);
    }
  });

  return TakeQuiz;
});