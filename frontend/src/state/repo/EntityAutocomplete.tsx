import {FC, HTMLAttributes, useMemo, useState} from "react";
import {isUuid, uuidRegex} from "../../uuid.ts";
import {Autocomplete, Box, TextField} from "@mui/material";
import {BaseTextFieldProps} from "@mui/material/TextField/TextField";
import {NIL} from "uuid";
import {useQueryClient} from "@tanstack/react-query";
import {UseText} from "./repo.tsx";
import {UseSearchQuery} from "./searchQuery.ts";

export function createEntityAutocomplete(args: {
  useText: UseText;
  useSearchQuery: UseSearchQuery;
}) {
  const {
    useText,
    useSearchQuery,
  } = args;

  const EntityAutocompleteRenderOption: FC<{
    option: string;
    optionProps: HTMLAttributes<HTMLLIElement>;
  }> = props => {
    const isUuid = uuidRegex.test(props.option);
    const entityText = useText(isUuid ? props.option : null);

    return <Box
      component="li"
      {...props.optionProps}
    >
      {isUuid ? entityText : <i>{props.option}</i>}
    </Box>
  }

  const EntityAutocomplete: FC<BaseTextFieldProps & {
    value: string | null
    onChange: (entityId: string | null) => void;
    allowCustomInput?: boolean;
  }> = props => {
    const {allowCustomInput} = props;

    const value = props.value === NIL || !props.value ? null : props.value
    const queryClient = useQueryClient();
    useText(value && isUuid(value) ? value : null);
    const [inputValue, setInputValue] = useState('');
    const searchQuery = useSearchQuery({
      searchText: inputValue,
      limit: 100,
      offset: 0,
    });

    const options = useMemo(() => {
      let options = searchQuery.data?.items ?? [];
      options = [...options];

      if (allowCustomInput && inputValue) {
        options = [inputValue, ...options];
      }

      if (value && options.indexOf(value) < 0) {
        options.push(value);
      }

      return options;
    }, [searchQuery.data?.items, inputValue, allowCustomInput, value])

    return <Autocomplete
      value={value}
      options={options}
      onChange={(_event, value) => props.onChange(value)}
      inputValue={inputValue}
      getOptionKey={id => id}
      getOptionLabel={value => {
        if (isUuid(value)) {
          return useText.fromQueryClient(queryClient, value) ?? '';
        }

        if (allowCustomInput) return value;

        return '';
      }}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderOption={(props, option) => {
        const {key, ...optionProps} = props;
        return <EntityAutocompleteRenderOption key={key} optionProps={optionProps} option={option}/>
      }}
      renderInput={(params) => {

        return <TextField
          sx={props.sx}
          {...params}
          label={props.label}
          margin={props.margin}
          fullWidth={props.fullWidth}
          helperText={props.helperText}
        />;
      }}
    />
  }

  return EntityAutocomplete;
}
