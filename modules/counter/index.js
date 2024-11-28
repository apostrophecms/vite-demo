export default {
  async init(self) {
    // Create a custom mongodb collection to store counter data
    self.db = await self.apos.db.collection('counterData');
    await self.db.createIndex({ type: 1 });

    // A nunjucks filter to convert an object to a `data-*` attribute value
    self.apos.template.addFilter({
      toAttributeValue: self.toAttributeValue
    });
  },

  // Define server side async components
  components(self) {
    return {
      // This component is generating the markup used for mounting every counter
      // app. It also serializes the data to be used in the client-side app and
      // assigns it to the `data-` attributes of the root element.
      // The client side code then reads and deserializes this data and
      // sends it to the respective `App.xxx` component via `props`.
      // See the component template `./views/counterApp.html`.
      // The component accespts the following arguments:
      // - framework: The framework used in the app
      // - widget: The current widget data object
      // - page: The current page data object
      // - options: The widget options as defined in the current page schema
      async counterApp(req, {
        framework, widget, page, options
      }) {
        const counter = (await self.apos.modules.counter
          .getWidgetCounter(widget._id)) ?? {};
        return {
          framework,
          widget,
          page,
          options,
          counter
        };
      }
    };
  },
  methods(self) {
    return {
      // Get counter data from the database, used in the async server component.
      // See `modules/asset/index.js`
      async getWidgetCounter(id) {
        return self.db.findOne({ _id: id });
      },
      // A helper to convert an object to an HTML element attribute
      toAttributeValue(obj) {
        if (typeof obj === 'undefined' || obj === null) {
          obj = '';
        }
        const json = JSON.stringify(obj);
        return self.apos.template.safe(
          self.apos.util.escapeHtml(json, { single: true })
        );
      }
    };
  },
  apiRoutes(self) {
    return {
      post: {
        // A custom API route to update the counter data per widget.
        // The route path is automatically prefixed with `/api/v1/`,
        // the module name and the lowercase, slugified method name.
        // POST /api/v1/counter/count
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
