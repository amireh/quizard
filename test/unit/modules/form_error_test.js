define([ 'pixy', 'rsvp', 'modules/form_error' ], function(Pixy, RSVP, FormError) {
  describe('Modules::FormError', function() {
    var $form, apiError, subject;
    var generateForm = function() {
      return $('<form><input name="name" type="text" /></form>')
        .appendTo(document.body);
    };

    it('shows locates fields that have an error', function() {
      $form = generateForm();

      apiError = {
        fieldErrors: {
          name: {
            message: 'We need your name.'
          }
        }
      };

      subject = new FormError($form, apiError, { autoShow: false });
      expect(subject.formFields.length).toEqual(1);
    });

    describe('#show', function() {
      afterEach(function() {
        if ($form) {
          $form.remove();
        }
      });

      it('shows with a field error', function() {
        $form = generateForm();

        apiError = {
          fieldErrors: {
            name: {
              message: 'We need your name.'
            }
          }
        };

        subject = new FormError($form, apiError, { autoShow: false });
        subject.show();
        expect($form.find('input').is('.invalid')).toBeTruthy();
        expect($('body').text().match('We need your name.')).toBeTruthy();

        subject.clear();
        expect($('.qtip').length).toEqual(0);
      });
    });
  });
});