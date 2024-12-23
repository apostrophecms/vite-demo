export default {
  extend: '@apostrophecms/page-type',
  options: {
    label: 'Counter Apps Page'
  },
  fields: {
    add: {
      main: {
        type: 'area',
        options: {
          widgets: {
            'counter-vue': {
              example: 'options from the counter-page schema'
            },
            'counter-svelte': {
              example: 'options from the counter-page schema'
            },
            'counter-react': {
              example: 'options from the counter-page schema'
            }
          }
        }
      }
    },
    group: {
      basics: {
        label: 'Basics',
        fields: [
          'title',
          'main'
        ]
      }
    }
  }
};
