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
        id: 'combobox.label',
        defaultMessage: 'Combobox',
      },
      intlDescription: {
        id: 'combobox.description',
        defaultMessage: 'Type or select from a list of options',
      },
      components: {
        Input: async () => import('./components/Input'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: `${PLUGIN_ID}.section.basic-settings`,
              defaultMessage: "Basic Settings",
            },
            items:[
              {
                required: true,
                name: 'options.defaultOptions',
                type: 'textarea',
                placeholder: {
                  id: `${PLUGIN_ID}.defaultOptions.placeholder`,
                  defaultMessage: "Option A Label:Option A Value\nOption B Label:Option B Value\nOption C Label:Option C Value\nOption D Label:Option D Value",
                },
                intlLabel: {
                  id: `${PLUGIN_ID}.defaultOptions`,
                  defaultMessage: 'Default options (Label:Value or Value)',
                },
                description: {
                  id: `${PLUGIN_ID}.defaultOptions.description`,
                  defaultMessage: 'These values will be used to populate the combobox options. One per line.',
                },
              },
              {
                name: 'options.enableCreateableOptions',
                type: 'checkbox',
                intlLabel: {
                  id: `${PLUGIN_ID}.enableCreateableOptions`,
                  defaultMessage: 'Enable createable options?',
                },
                description: {
                  id: `${PLUGIN_ID}.enableCreateableOptions.description`,
                  defaultMessage: 'If enabled, custom options can be created',
                },
              }
            ]
          }
        ],
        advanced: [
          {
            sectionTitle: {
              id: `${PLUGIN_ID}.section.advanced-settings`,
              defaultMessage: "Advanced Settings",
            },
            items: [
              {
                name: 'options.customValidation',
                type: 'text',
                placeholder: {
                  id: `${PLUGIN_ID}.customValidation.placeholder`,
                  defaultMessage: "/^\d*\.?\d+$/",
                },
                intlLabel: {
                  id: `${PLUGIN_ID}.customValidation`,
                  defaultMessage: 'Custom regex',
                },
                description: {
                  id: `${PLUGIN_ID}.customColorsPresets.description`,
                  defaultMessage: 'This value will be used to validate combobox options.',
                },
              }
            ]
          }
        ],
        validator: () => {
          const hasDuplicateLines = (lines: string[]) => {
            const uniqueLines = new Set(lines);
            return lines.length !== uniqueLines.size;
          };

          const validateComboboxOptions = (value: string | undefined) => {
            if (!value) return true;
            
            const lines = value.split('\n');
            const lineRegex = /^(?:[^:]+:[^:]+|[^:]+)$/;
            
            if (lines.some(line => !line || line.trim() === '')) return false;
            if (!lines.every(line => lineRegex.test(line.trim()))) return false;
            if (hasDuplicateLines(lines.map(line => line.trim()))) return false;

            return true;
          };

          const validateRegexPattern = (value: string | undefined) => {
            if (!value) return true;
            
            try {
              new RegExp(value);
              return true;
            } catch {
              return false;
            }
          };

          const errorMessages = {
            required: 'This field is required',
            badOptionsFormat: 'Each line must be in format "Label:Value" or just "Value" (no empty lines or duplicates allowed)',
            badRegexFormat: 'Must be a valid regular expression',
          };

          const createValidation = (
            fieldName: string,
            isRequired: boolean,
            validator: (value: string | undefined) => boolean,
            errorMessage: string
          ) => {
            const baseSchema = isRequired ? yup.string().required(errorMessages.required) : yup.string().optional();
            
            return baseSchema.test(fieldName, {
              id: `error.${fieldName}`,
              defaultMessage: errorMessage,
            }, validator);
          };
           
          return {
            defaultOptions: createValidation('defaultOptions', true, validateComboboxOptions, errorMessages.badOptionsFormat),
            customValidation: createValidation('customValidation', false, validateRegexPattern, errorMessages.badRegexFormat),
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