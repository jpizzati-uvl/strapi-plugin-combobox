# 🌟 Strapi Plugin - Combobox

A custom field plugin for Strapi that provides a combobox component allowing users to type or select from a list of predefined options.

## 🎬 Preview

![Documentation Image](https://iili.io/FT5SnSf.gif)

## 🚀 Features

- 🔍 Type to search through options
- ✨ Autocomplete functionality
- 🆕 Optional ability to create new options on the fly
- 🧩 Seamless integration with Strapi's design system
- ✅ Custom validation support
- 🌐 Internationalization ready

## 📦 Installation

```bash
# Using npm
npm install strapi-plugin-combobox

# Using yarn
yarn add strapi-plugin-combobox
```

## ⚙️ Configuration

### 🔧 Basic Settings

| Option                    | Type    | Default | Description                                        |
| ------------------------- | ------- | ------- | -------------------------------------------------- |
| `defaultOptions`          | string  | -       | List of options (format: "Label:Value" or "Value") |
| `enableCreateableOptions` | boolean | false   | Allow users to create new options                  |

📝 Example options format:

```
Option A Label:option-a-value
Option B Label:option-b-value
Option C Label:option-c-value
Simple Option
Another Simple Option
```

### 🛠️ Advanced Settings

| Option             | Type   | Default | Description                               |
| ------------------ | ------ | ------- | ----------------------------------------- |
| `customValidation` | string | -       | Custom regex pattern for value validation |

🧪 Example validation patterns:

- 🔢 Numbers only: `/^\d*\.?\d+$/`
- 📧 Email format: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- 🔡 Alphanumeric: `/^[a-zA-Z0-9]+$/`

## 📚 Usage

1. 🧱 After installation, the plugin will be available as a custom field type in your Content-Types Builder.
2. ➕ Add a new field and select "Combobox" as the field type.
3. ⚙️ Configure the field options:
   - 📋 Add your default options (required)
   - 🆓 Enable createable options if you want users to add custom values
   - 🧩 Add custom validation regex if needed

### 🧾 Option Format

Options can be specified in two formats:

1. **📝 Label:Value format** – Display a user-friendly label while storing a different value

   ```
   Display Name:internal-value
   Product A:product-a
   ```

2. **🔁 Simple format** – Use the same value for both display and storage

   ```
   Apple
   Banana
   Orange
   ```

## ✅ Validation

The plugin includes built-in validation to ensure:

- 📌 At least one option is provided
- 🧷 Each option follows the correct format
- 🧪 Custom regex validation can be applied to the selected/created values

## 🤝 Contributing

We welcome contributions! You can help by:

1. 🐛 Creating issues for bugs or feature requests
2. 📥 Submitting pull requests for improvements
3. 💬 Providing feedback and suggestions

## 📄 License

MIT License – © Jorge Pizzati
