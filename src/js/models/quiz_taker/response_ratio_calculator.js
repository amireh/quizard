define(function() {
  var get = function(answer) { return answer.responseRatio; };
  var set = function(answer, ratio) { answer.responseRatio = ratio; };
  var distribute = function(pool, overflow) {
    var chunk, remainder;

    if (pool.length === 0 || overflow === 0) {
      return pool;
    }

    chunk = Math.max(Math.floor(overflow / pool.length), 1);
    remainder = overflow;

    pool.forEach(function(item) {
      var amount, deductibleChunk;

      if (remainder === 0) {
        return;
      }

      amount = get(item);
      deductibleChunk = Math.min(amount, chunk);

      set(item, amount - deductibleChunk);
      remainder -= deductibleChunk;
    });

    return distribute(pool.filter(function(item) {
      return get(item) > 0;
    }), remainder, get, set);
  };

  return function setResponseRatio(answerId, answerPool, ratio) {
    var answer, ratioTally, overflow;
    var filter = function(answer) { return answer.id !== answerId; };

    answer = answerPool.filter(function(answer) {
      return answer.id === answerId;
    })[0];

    set(answer, Math.min(Math.abs(parseInt(ratio, 10)), 100));

    // Test for overflow, in case there is any, we need to distribute it
    // over the remainder of the pool by deducting an equal amount from each
    ratioTally = answerPool.reduce(function(sum, answer) {
      return sum + get(answer);
    }, 0);

    overflow = ratioTally - 100;

    if (overflow > 0) {
      distribute(answerPool.filter(filter), overflow);
    }
    else if (overflow < 0) {
      var otherAnswers = answerPool.filter(filter);
      var remainder = Math.abs(overflow);
      var chunk = Math.floor(remainder / otherAnswers.length);

      otherAnswers.forEach(function(answer) {
        set(answer, get(answer) + chunk);
        remainder -= chunk;
      });

      if (remainder > 0) {
        set(otherAnswers[0], get(otherAnswers[0]) + remainder);
      }
    }
  };
});