/* global use, db */
use('a4-playground');
db.getCollection('aposDocs').findOne({
  type: '@apostrophecms/home-page',
  aposMode: 'draft'
});
