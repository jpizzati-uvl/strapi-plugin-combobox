import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: "combobox",
    plugin: "combobox",
    type: "string",
    inputSize: {
      default: 12,
      isResizable: true
    }
  });
};

export default register;
