import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: "component-docs",
    plugin: "component-docs",
    type: "string",
    inputSize: {
      default: 12,
      isResizable: false
    }
  });
};

export default register;
