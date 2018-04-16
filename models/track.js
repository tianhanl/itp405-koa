const bookshelf = require('./../database/bookshelf');

const Track = bookshelf.Model.extend({
  tableName: 'tracks',
  idAttribute: 'TrackId'
});

module.exports = Track;
