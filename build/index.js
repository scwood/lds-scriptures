'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var sendVolume = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
    var volume, books;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _sqlite2.default.get('SELECT * FROM volumes WHERE uri=?', req.params.volume);

          case 3:
            volume = _context.sent;

            if (volume) {
              _context.next = 7;
              break;
            }

            res.status(404).send({ error: 'Volume not found.' });
            return _context.abrupt('return');

          case 7:
            _context.next = 9;
            return _sqlite2.default.all('SELECT * FROM books WHERE volumeId=?', volume.id);

          case 9:
            books = _context.sent;

            volume.books = books;
            res.send({ data: { volume: volume } });
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context['catch'](0);

            next(_context.t0);

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 14]]);
  }));

  return function sendVolume(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var sendBook = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res, next) {
    var volume, book, chapters;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _sqlite2.default.get('SELECT * FROM volumes WHERE uri=?', req.params.volume);

          case 3:
            volume = _context2.sent;

            if (volume) {
              _context2.next = 7;
              break;
            }

            res.status(404).send({ error: 'Volume not found.' });
            return _context2.abrupt('return');

          case 7:
            _context2.next = 9;
            return _sqlite2.default.get('SELECT * FROM books WHERE uri=? AND volumeId=?', [req.params.book, volume.id]);

          case 9:
            book = _context2.sent;

            if (!book) {
              res.status(404).send({ error: 'Book not vound in volume.' });
            }
            volume.book = book;
            _context2.next = 14;
            return _sqlite2.default.all('SELECT * FROM chapters WHERE bookId=?', book.id);

          case 14:
            chapters = _context2.sent;

            volume.book.chapters = chapters;
            res.send({ data: { volume: volume } });
            _context2.next = 22;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2['catch'](0);

            next(_context2.t0);

          case 22:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 19]]);
  }));

  return function sendBook(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var sendChapter = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res, next) {
    var volume, book, chapter, verses;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _sqlite2.default.get('SELECT * FROM volumes WHERE URI=?', [req.params.volume]);

          case 3:
            volume = _context3.sent;

            if (volume) {
              _context3.next = 7;
              break;
            }

            res.status(404).send({ error: 'Volume not found.' });
            return _context3.abrupt('return');

          case 7:
            _context3.next = 9;
            return _sqlite2.default.get('SELECT * FROM books WHERE uri=? AND volumeId=?', [req.params.book, volume.id]);

          case 9:
            book = _context3.sent;

            if (book) {
              _context3.next = 13;
              break;
            }

            res.status(404).send({ error: 'Book not found in volume.' });
            return _context3.abrupt('return');

          case 13:
            volume.book = book;
            _context3.next = 16;
            return _sqlite2.default.get('SELECT * FROM chapters WHERE chapterNumber=? AND bookId=?', [req.params.chapter, book.id]);

          case 16:
            chapter = _context3.sent;

            if (chapter) {
              _context3.next = 20;
              break;
            }

            res.status(404).send({ error: 'Chapter does not exist.' });
            return _context3.abrupt('return');

          case 20:
            volume.book.chapter = chapter;
            _context3.next = 23;
            return _sqlite2.default.all('SELECT * FROM verses WHERE chapterId=?', chapter.id);

          case 23:
            verses = _context3.sent;

            volume.book.chapter.verses = verses;
            res.send({ data: { volume: volume } });
            _context3.next = 31;
            break;

          case 28:
            _context3.prev = 28;
            _context3.t0 = _context3['catch'](0);

            next(_context3.t0);

          case 31:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 28]]);
  }));

  return function sendChapter(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.get('/:volume', sendVolume);
app.get('/:volume/:book', sendBook);
app.get('/:volume/:book/:chapter', sendChapter);
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send({ error: 'Internal server error.' });
  next();
});

_sqlite2.default.open('scriptures.db').then(function () {
  return app.listen(process.env.PORT || 3000);
});