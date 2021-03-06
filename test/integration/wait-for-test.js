suite('scope', function() {
  var client = marionette.client();

  suite('sync waitFor', function() {
    test('should not yield in sync code', function() {
      var tries = 0;
      var succeed = 10;

      var i = 1;
      // short signature
      client.waitFor(function() {
        return (++tries === succeed);
      });

      assert.strictEqual(tries, 10);
    });

    test('should eventually timeout', function() {
      var timeout = 450;
      var start = Date.now();
      var err;
      try {
        client.waitFor(function() {
          return false;
        }, { timeout: timeout });
      } catch (e) {
        err = e;
      }

      assert.ok(err);
      assert.operator(Date.now() - start, '>=', timeout);
    });
  });

  suite('async wait for calls', function() {
    test('should throw an error when given', function(done) {
      var err = new Error('xfoo');
      function sendError(done) {
        done(err, 1);
      }

      client.waitFor(sendError, function(givenErr) {
        assert.strictEqual(givenErr, err);
        done();
      });
    });

    test('should fire when async condition is met', function(done) {
      var tries = 0;
      var success = 3;
      client.waitFor(function(done) {
        setTimeout(done, 5, null, ++tries === success);
      }, done);
    });
  });
});

