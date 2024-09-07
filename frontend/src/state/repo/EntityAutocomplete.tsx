import {FC, HTMLAttributes, useMemo, useState} from "react";
import {isUuid, uuidRegex} from "../../uuid.ts";
import {Autocomplete, Box, TextField} from "@mui/material";
import {BaseTextFieldProps} from "@mui/material/TextField/TextField";
import {NIL} from "uuid";
import {useQueryClient} from "@tanstack/react-query";
import {UseEntityText, UseSearchQuery} from "./repo.tsx";

export function createEntityAutocomplete(args: {
  useEntityText: UseEntityText;
  useSearchQuery: UseSearchQuery;
}) {
  const {
    useEntityText,
    useSearchQuery,
  } = args;

  const EntityAutocompleteRenderOption: FC<{
    option: string;
    optionProps: HTMLAttributes<HTMLLIElement>;
  }> = props => {
    const isUuid = uuidRegex.test(props.option);
    const entityText = useEntityText(isUuid ? props.option : null);

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
    useEntityText(value && isUuid(value) ? value : null);
    const [inputValue, setInputValue] = useState('');
    const searchQuery = useSearchQuery({
      searchText: inputValue,
      limit: 100,
      offset: 0,
    });

    const options = useMemo(() => {
      const options = searchQuery.data?.items ?? [];
      if (allowCustomInput && inputValue) {
        return [inputValue, ...options];
      } else {
        return options;
      }
    }, [searchQuery.data?.items, inputValue, allowCustomInput])

    return <Autocomplete
      value={value}
      onChange={(_event, value) => props.onChange(value)}
      inputValue={inputValue}
      getOptionKey={id => id}
      getOptionLabel={value => {
        if (isUuid(value)) {
          return useEntityText.fromQueryClient(queryClient, value) ?? '';
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
        />;
      }}
      options={options}
    />
  }

  return EntityAutocomplete;
}
