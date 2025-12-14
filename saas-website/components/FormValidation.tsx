'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  validateOnChange?: boolean;
}

export interface ValidationState {
  isValid: boolean;
  error: string | null;
  touched: boolean;
}

export interface UseFieldValidationOptions {
  rules: ValidationRule;
  initialValue?: string;
  validateOnMount?: boolean;
}

export function useFieldValidation({
  rules,
  initialValue = '',
  validateOnMount = false,
}: UseFieldValidationOptions) {
  const [value, setValue] = useState(initialValue);
  const [validation, setValidation] = useState<ValidationState>({
    isValid: true,
    error: null,
    touched: false,
  });

  const validate = (valueToValidate: string): string | null => {
    // Required validation
    if (rules.required && (!valueToValidate || valueToValidate.trim() === '')) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!valueToValidate && !rules.required) {
      return null;
    }

    // Min length validation
    if (rules.minLength && valueToValidate.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && valueToValidate.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(valueToValidate)) {
      return 'Invalid format';
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(valueToValidate);
    }

    return null;
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    
    if (rules.validateOnChange || validation.touched) {
      const error = validate(newValue);
      setValidation({
        isValid: error === null,
        error,
        touched: true,
      });
    }
  };

  const handleBlur = () => {
    const error = validate(value);
    setValidation({
      isValid: error === null,
      error,
      touched: true,
    });
  };

  const reset = () => {
    setValue(initialValue);
    setValidation({
      isValid: true,
      error: null,
      touched: false,
    });
  };

  useEffect(() => {
    if (validateOnMount) {
      const error = validate(value);
      setValidation({
        isValid: error === null,
        error,
        touched: true,
      });
    }
  }, []);

  return {
    value,
    validation,
    handleChange,
    handleBlur,
    reset,
    setValue,
  };
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  rules?: ValidationRule;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation: ValidationState;
  helpText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  className,
  rules,
  value,
  onChange,
  onBlur,
  validation,
  helpText,
  showCharCount = false,
  maxLength,
}: FormFieldProps) {
  const inputId = `field-${name}`;
  const errorId = `error-${name}`;
  const helpTextId = `help-${name}`;

  return (
    <div className={clsx('space-y-2', className)}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={validation.touched && !validation.isValid}
        aria-describedby={clsx(
          validation.touched && !validation.isValid && errorId,
          helpText && helpTextId
        )}
        className={clsx(
          'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
          validation.touched && !validation.isValid
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-neutral-300',
          disabled && 'opacity-60'
        )}
      />
      
      {showCharCount && maxLength && (
        <div className="text-right">
          <span className={clsx(
            'text-xs',
            value.length > maxLength * 0.9 ? 'text-amber-600' : 'text-neutral-500'
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      
      {helpText && (
        <p id={helpTextId} className="text-sm text-neutral-500">
          {helpText}
        </p>
      )}
      
      {validation.touched && !validation.isValid && validation.error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {validation.error}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  rules?: ValidationRule;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation: ValidationState;
  helpText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export function TextAreaField({
  label,
  name,
  placeholder,
  required = false,
  disabled = false,
  className,
  rows = 4,
  rules,
  value,
  onChange,
  onBlur,
  validation,
  helpText,
  showCharCount = false,
  maxLength,
}: TextAreaFieldProps) {
  const inputId = `field-${name}`;
  const errorId = `error-${name}`;
  const helpTextId = `help-${name}`;

  return (
    <div className={clsx('space-y-2', className)}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={validation.touched && !validation.isValid}
        aria-describedby={clsx(
          validation.touched && !validation.isValid && errorId,
          helpText && helpTextId,
          showCharCount && maxLength && 'char-count'
        )}
        className={clsx(
          'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-neutral-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
          'resize-vertical',
          validation.touched && !validation.isValid
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-neutral-300',
          disabled && 'opacity-60'
        )}
      />
      
      {showCharCount && maxLength && (
        <div className="flex justify-between items-center">
          {helpText && (
            <p id={helpTextId} className="text-sm text-neutral-500">
              {helpText}
            </p>
          )}
          <span className={clsx(
            'text-xs',
            value.length > maxLength * 0.9 ? 'text-amber-600' : 'text-neutral-500'
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      
      {!showCharCount && helpText && !maxLength && (
        <p id={helpTextId} className="text-sm text-neutral-500">
          {helpText}
        </p>
      )}
      
      {validation.touched && !validation.isValid && validation.error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {validation.error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  rules?: ValidationRule;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation: ValidationState;
  helpText?: string;
}

export function SelectField({
  label,
  name,
  options,
  required = false,
  disabled = false,
  placeholder,
  className,
  rules,
  value,
  onChange,
  onBlur,
  validation,
  helpText,
}: SelectFieldProps) {
  const inputId = `field-${name}`;
  const errorId = `error-${name}`;
  const helpTextId = `help-${name}`;

  return (
    <div className={clsx('space-y-2', className)}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>
      
      <select
        id={inputId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-invalid={validation.touched && !validation.isValid}
        aria-describedby={clsx(
          validation.touched && !validation.isValid && errorId,
          helpText && helpTextId
        )}
        className={clsx(
          'block w-full px-3 py-2 border rounded-md shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed',
          validation.touched && !validation.isValid
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-neutral-300',
          disabled && 'opacity-60'
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {helpText && (
        <p id={helpTextId} className="text-sm text-neutral-500">
          {helpText}
        </p>
      )}
      
      {validation.touched && !validation.isValid && validation.error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {validation.error}
        </p>
      )}
    </div>
  );
}

// Predefined validation rules
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Please enter a valid name (letters and spaces only)',
  },
  institute: {
    minLength: 2,
    maxLength: 100,
  },
  students: {
    pattern: /^[1-9]\d*$/,
    message: 'Please enter a valid number of students',
  },
  required: {
    required: true,
    message: 'This field is required',
  },
};