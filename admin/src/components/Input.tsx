import React, { useState } from 'react';
import {
  Field,
  Flex,
  ComboboxOption,
  Combobox
} from '@strapi/design-system';

interface Option  {
  label: string;
  value: string;
}

const OPTIONS_SEPARATOR = "\n";
const VALUE_SEPARATOR = ':';

const findObjByProp = (selectedProp:string, initialOptions:Option[], prop: 'label' | 'value') => {
  return initialOptions.find((option) => option[prop] === selectedProp);
}
const getInitialOptions = (value: string | null, initialOptions: Option[]) : Option[] => {
  if (!value || initialOptions.find((option) => option.label === value || option.value === value)) { return initialOptions }

  return [{ value, label: value }, ...initialOptions];
};
const isLabeledOption = (newValue:string) => newValue.includes(VALUE_SEPARATOR);
const validateOption = (newValue:string, regex?: string) => {
  const defaultValidation = !!newValue && newValue?.trim().length > 0
  let isValid = defaultValidation

  if(regex){
    const regExp = new RegExp(regex);

    isValid = defaultValidation && regExp.test(newValue) 
  } 

  return isValid;
}
interface InputProps {
  attribute: {
    type: string;
    customField: string;
    options: {
      required?: boolean;
      defaultOptions: string;
      customValidation?: string;
      enableCreateableOptions?: boolean;
    };
  };
  description?: { id: string; defaultMessage: string };
  disabled?: boolean;
  intlLabel?: { id: string; defaultMessage: string };
  name: string;
  onChange: (e: { target: { name: string; type: string; value: string } }) => void;
  initialValue?: string;
  required?: boolean;
  value?: string;
  error?: string;
  hint?:string
  label?:string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, value = '', attribute, ...props }, ref) => {
    const { customValidation, enableCreateableOptions } = attribute?.options;
    const sanitizedOptions = attribute?.options.defaultOptions.split(OPTIONS_SEPARATOR).map(defaultOpt => {
      let sanitizedOption;

      if(isLabeledOption(defaultOpt)){
        const [sanitizedLabel, sanitizedValue] = defaultOpt.split(VALUE_SEPARATOR)
        sanitizedOption = { label: sanitizedLabel.trim(), value: sanitizedValue.trim() }
      } else {
        const sanitizedDefaultOpt = defaultOpt.trim();
        
        sanitizedOption = {
          label: sanitizedDefaultOpt,
          value: sanitizedDefaultOpt
        }
      }

      return sanitizedOption;
    })

    const [isValidOption, setIsValidOption] = useState(true);
    const [comboboxOptions, setComboboxOptions] = useState(getInitialOptions(value, sanitizedOptions))
    const [selectedOption, setSelectedOption] = useState(findObjByProp(value, comboboxOptions, 'value'))

    const onChange = (newValue:string) => {
      const valueToSave = findObjByProp(newValue, comboboxOptions, 'label')

      setSelectedOption(valueToSave)

      props.onChange({
        target: {
          name,
          type: "json",
          value: valueToSave?.value || newValue,
        },
      });
    }

    return (
      <Field.Root
        id={name}
        name={name}
        required={props.required}
        error={props.error}
        hint={props?.hint}
      >
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label>{props.label}</Field.Label>
          
          <Combobox
            ref={ref}
            autoComplete='off'
            autocomplete={{ type: "none" }}
            placeholder="Choose here"
            aria-label="Select or create option"
            value={selectedOption?.label}
            onChange={onChange}
            creatable={enableCreateableOptions && isValidOption}
            onTextValueChange={(newValue:string) => setIsValidOption(validateOption(newValue, customValidation))}
            onCreateOption={(newValue:string) => {
              if (newValue) {
                const sanitizedValue = newValue.trim();

                setComboboxOptions([{ value: sanitizedValue, label: sanitizedValue }, ...comboboxOptions]);
              }
            }}
            size="L"
            clearLabel="Clear option"
            createMessage={isValidOption ? (newValue: string) => `Set "${newValue}"` : undefined}
          >
            {comboboxOptions.map((comboboxOption: Option) => (
              <ComboboxOption key={comboboxOption.label} value={comboboxOption.label}>
                {comboboxOption.label}
              </ComboboxOption>
            ))}
          </Combobox>

          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    );
  }
);

Input.displayName = 'ComboboxInput';

export default Input;
