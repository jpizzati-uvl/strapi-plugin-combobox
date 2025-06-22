import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import {PluginIcon} from './components/PluginIcon';
import * as yup from 'yup';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      name: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
    });

    app.customFields.register({
      name: PLUGIN_ID,
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: PluginIcon,
      intlLabel: {
        id: 'component-docs.label',
        defaultMessage: 'Documentation link',
      },
      intlDescription: {
        id: 'component-docs.description',
        defaultMessage: 'Add a link to component documentation',
      },
      components: {
        Input: async () => import('./components/Input'),
      },
      options: {
        base: [
          {
            name: 'options.url',
            type: 'text',
            intlLabel: {
              id: 'component-docs.url',
              defaultMessage: 'URL',
            },
            description: {
              id: 'component-docs.url.description',
              defaultMessage: 'The href to create the link',
            },
          },
          {
            name: 'options.disableIframe', 
            type: 'checkbox',
            intlLabel: {
              id: 'component-docs.disableIframe',
              defaultMessage: 'Disable Iframe?',
            },
            description: {
              id: 'component-docs.required.disableIframe',
              defaultMessage: 'Disables iframe modal and opens the link in a new tab',
            },
          },
        ],
        advanced: [
          {
            name: 'private',
            type: 'checkbox',
            disabled: true,
            intlLabel: {
              id: 'component-docs.private',
              defaultMessage: 'Private field',
            },
            description: {
              id: 'component-docs.private.description',
              defaultMessage: 'This field will not show up in the API response',
            },
          },
        ],
        validator: (args: any) => {
          // Extract options from the modifiedData
          const { url: configUrl } = args[2].modifiedData.options || {};
          
          const errorMessages = {
            required: 'This field is required',
            invalidUrl: 'The URL must be a valid URL format.'
          };
          
          const validateUrl = (url: string | undefined): boolean => {
            if (!url || url.trim() === '') return false;
            
            // Basic URL validation
            try {
              const urlPattern = /^(https?:\/\/|\/)/i;
              return urlPattern.test(url.trim());
            } catch (e) {
              return false;
            }
          };
          
          // Create validation function similar to the reference pattern
          const createValidation = (fieldValue: string | undefined) => {
            const baseSchema = yup.string().required(errorMessages.required);

            return baseSchema.test('url', {
              id: 'error.url',
              defaultMessage: errorMessages.invalidUrl,
            }, validateUrl);
          };
          
          // Return validation result
          return {
            url: createValidation(configUrl),
          };
        },
      },
    })
  },



  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(
            `./translations/${locale}.json`
          );
          return {
            data: data || {},
            locale,
          };
        } catch (error) {
          return {
            data: {},
            locale,
          };
        }
      })
    );
  },
};