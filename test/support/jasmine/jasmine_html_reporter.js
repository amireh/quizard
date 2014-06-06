var createDom = jasmine.HtmlReporterHelpers.createDom;

function withInspect() {
  return window.location.search.match(/inspect/);
}

function searchWithInspect() {
  var params = jasmine.HtmlReporter.parameters(window.document);
  var removed = false;
  var i = 0;

  while (!removed && i < params.length) {
    if (params[i].match(/inspect=/)) {
      params.splice(i, 1);
      removed = true;
    }
    i++;
  }

  if (!removed) {
    params.push("inspect=true");
  }

  return params.join("&");
}

require([ 'jquery' ], function() {
  function createInspectOption() {
    var el = createDom('span', { className: 'inspector' },
      createDom('label', { className: 'label', 'for': 'inspect' }, 'Inspect',
      createDom('input', { id: 'inspect', type: 'checkbox' })));

    $('.exceptions').append(el);

    $(el).find('[type="checkbox"]').prop('checked', withInspect());
    $(el).on('change', function() {
      window.location.search = searchWithInspect();
    });
  };

  setTimeout(function() {
    if (jasmine.getEnv().reporter.subReporters_.length) {
      createInspectOption();
    }
  }, 500);
});

jasmine.inspecting = withInspect();