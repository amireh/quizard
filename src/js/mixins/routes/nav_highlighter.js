define(function(require) {
  return {
    enter: function() {
      if (this.navLink) {
        this.update({ navLink: this.navLink });
      }
    }
  }
});