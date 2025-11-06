import React, {forwardRef} from 'react';
import {TextField, TextFieldProps, TextFieldRef} from 'react-native-ui-lib';

type InputViewProps = Partial<TextFieldProps>;

const InputView = forwardRef<TextFieldRef, InputViewProps>(
  (
    {
      label,
      placeholder,
      value,
      onChangeText,
      secureTextEntry,
      ...props
    }: InputViewProps,
    inputRef,
  ) => (
    <TextField
      ref={inputRef}
      // eslint-disable-next-line react-native/no-inline-styles
      containerStyle={{
        borderBottomWidth: 1,
        borderColor: 'grey',
        paddingBottom: 4,
      }}
      floatingPlaceholder
      label={label}
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  ),
);

export default InputView;
