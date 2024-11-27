export default {

  init(self) {
    // A nunjucks filter to convert an object to an attribute value
    self.apos.template.addFilter({
      toAttributeValue: self.toAttributeValue
    });
  },

  components(self) {
    return {
      // This component is generating the rooot element used for mounting the counter
      // app. It also serializes the data to be used in the client-side app and
      // assigns it to the `data-` attributes of the root element.
      // The client side code then reads and deserializes this data and
      // sends it to the respective `APP.xxx` component via `props`.
      // See the component template `./views/counterApp.html`.
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
  }
};
