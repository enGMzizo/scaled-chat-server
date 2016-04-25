/*
  Short-Organized version of npm express-socket.io-session ,
  All right reseved to https://github.com/oskosk/express-socket.io-session
*/
var cookieParser = require('cookie-parser');
var crc = require('crc').crc32;

module.exports = function(session) {
  return function(socket, next) {
    var req = socket.handshake;
    var res = {
      end : function() {}
    };

    var originalHash, savedHash;
    var originalId;  
    var _onevent = socket.onevent;

    socket.onevent = function() {
      var _args = arguments;  
      originalHash = savedHash = hash(req.session);
      originalId = req.sessionID;
      _onevent.apply(socket, _args);
      if (shouldSave(req)) {
        req.session.save()
      }
    };

    cookieParser()(req, res, function(err) {
      if (err) {
        return next(err);
      }
      session(req, res, function(req, res) {
        next();
      });
    });
    
    function hash(sess) {
      return crc(JSON.stringify(sess, function(key, val) {
        if (key !== 'cookie') {
          return val;
        }
      }));
    }

    function isModified(sess) {
      return originalId !== sess.id || originalHash !== hash(sess);
    }

    function isSaved(sess) {
      return originalId === sess.id && savedHash === hash(sess);
    }

    function shouldDestroy(req) {
      return req.sessionID && unsetDestroy && req.session == null;
    }

    function shouldSave(req) {
      if (typeof req.sessionID !== 'string') {
        return false;
      }

      return !isSaved(req.session)
    }
  };
};