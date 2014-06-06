define([ 'ext/pixy', 'rsvp', 'modules/form_error' ], function(Pixy, RSVP, FormError) {
  describe('Modules::FormError', function() {
    var view, apiError, subject;
    var generateView = function() {
      var view = new (Pixy.Object.extend({
        $: function(selector) {
          return this.$el.find(selector);
        },

        render: function() {
          this.$el = $(this.template());
          return RSVP.resolve(this.$el);
        },

        remove: function() {
          this.$el.remove();
          return RSVP.resolve();
        },

        template: _.template('<form><input name="name" type="text" /></form>')
      }));

      view.render();
      view.$el.appendTo('#content');

      return view;
    };

    it('shows locates fields that have an error', function() {
      view = generateView();

      apiError = {
        fieldErrors: {
          name: {
            message: 'We need your name.'
          }
        }
      };

      subject = new FormError(view, apiError, { autoShow: false });
      expect(subject.fieldErrors.length).toEqual(1);
    });

    describe('#show', function() {
      afterEach(function() {
        view && view.remove();
      });

      it('shows with a field error', function() {
        view = generateView()

        apiError = {
          fieldErrors: {
            name: {
              message: 'We need your name.'
            }
          }
        };

        subject = new FormError(view, apiError, { autoShow: false });
        subject.show();
        expect(view.$('input').is('.invalid')).toBeTruthy();
        expect($('body').text().match('We need your name.')).toBeTruthy();

        subject.clear();
        expect($('.qtip').length).toEqual(0);
      });
    });
  });
});