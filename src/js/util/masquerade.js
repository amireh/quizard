define(function() {
  /**
   * Masquerade as a different user on a given URL.
   *
   * @param {String} url
   * @param {String} [userId='']
   *
   * @return {String}
   *         The URL with ?as_user_id= appended if userId is present.
   */
  return function masquerade(url, userId) {
    userId = ''+ (userId || '');

    return url + (userId.length ? '?as_user_id=' + userId : '');
  };
});