export default {
  async init(self) {
    // Create a custom mongodb collection to store counter data
    self.db = await self.apos.db.collection('counterData');
    await self.db.createIndex({ type: 1 });
  },
  methods(self) {
    return {
      // Get counter data from the database, used in the async server component.
      // See `modules/asset/index.js`
      async getWidgetCounter(id) {
        return self.db.findOne({ _id: id });
      }
    };
  },
  apiRoutes(self) {
    return {
      post: {
        // A custom API route to update the counter data per widget.
        // POST /api/v1/counter-page/count
        async count(req) {
          const {
            count, id, type
          } = req.body;

          if (!id) {
            throw self.apos.error('invalid', 'Missing widget ID', {
              invalid: [ 'id' ]
            });
          }
          // Test and showcase frontend error handling
          if (count % 9 === 0) {
            throw self.apos.error('invalid', {
              message: 'I don\'t like numbers that divide by 9 so I\'m rejecting it!',
              invalid: [ 'id' ]
            });
          }
          self.db.updateOne({ _id: id }, {
            $set: {
              count,
              type
            }
          }, { upsert: true });

          return {
            ok: true,
            count,
            type
          };
        }
      }
    };
  }
};
