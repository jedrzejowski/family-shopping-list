import {useMutation, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query';
import * as model from '../model.ts';
import {useFamilyId} from './family.ts';
import {ProviderContext as SnackbarContext, useSnackbar} from 'notistack';
import {Autocomplete, Box, IconButton, TextField} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useLoadingShroud} from "../LoadingShroud.tsx";
import {FC, HTMLAttributes, useState} from "react";
import {BaseTextFieldProps} from "@mui/material/TextField/TextField";
import {SearchQuery} from "../model.ts";

function successSnackbar({enqueueSnackbar, closeSnackbar}: SnackbarContext) {
  enqueueSnackbar({
    message: 'Zapisano',
    variant: 'success',
    action: key => <>
      <IconButton
        aria-label="close"
        color="inherit"
        sx={{p: 0.5}}
        onClick={() => closeSnackbar(key)}
      >
        <CloseIcon/>
      </IconButton>
    </>
  });

}

function errorSnackbar({enqueueSnackbar, closeSnackbar}: SnackbarContext) {
  enqueueSnackbar({
    message: 'Wystąpił błąd',
    variant: 'error',
    action: key => <>
      <IconButton
        aria-label="close"
        color="inherit"
        sx={{p: 0.5}}
        onClick={() => closeSnackbar(key)}
      >
        <CloseIcon/>
      </IconButton>
    </>
  });

}

export interface UseSearchQuery<Props extends object = object> {
  (args: SearchQuery & Props): UseQueryResult<model.SearchResult<string>, unknown>;
}

export function createRepo<T>(name: string, args: {
  idField: keyof T;
  entityToText: (entity: T) => string;
}) {
  const {idField, entityToText} = args;

  const useSearchQuery: UseSearchQuery = (args) => {
    const familyId = useFamilyId();

    return useQuery({
      queryKey: ['_createRepo/search', name, args],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.set('limit', args.limit.toString());
        params.set('offset', args.offset.toString());
        if (args.searchText) params.set('searchText', args.searchText);


        const response = await fetch(`/api/${name}?` + params.toString(), {
          headers: {
            'x-family-id': familyId,
          }
        });

        if (response.status !== 200) {
          throw response;
        }

        return await response.json();
      },
    });
  }

  function useGetEntity(id: string | null | undefined) {
    const familyId = useFamilyId();

    return useQuery<T>({
      queryKey: ['_createRepo', name, id],
      enabled: typeof id === 'string',
      queryFn: async () => {
        const response = await fetch(`/api/${name}/${id}`, {
          headers: {
            'x-family-id': familyId,
          }
        });

        if (response.status !== 200) {
          throw response;
        }

        return await response.json();
      }
    });
  }

  function useUpdateEntityMutation() {
    const familyId = useFamilyId();
    const queryClient = useQueryClient();
    const snackbar = useSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const id = entity[idField];
        const response = await fetch(`/api/${name}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-family-id': familyId,
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) {
          throw response;
        }

        return entity[idField] as string;
      },
      onMutate() {
        loadingShroud(true);
      },
      onError() {
        errorSnackbar(snackbar)
      },
      onSuccess(data) {
        successSnackbar(snackbar);

        queryClient.invalidateQueries({
          queryKey: ['_createRepo', name, data],
          exact: true,
        });
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }

  function useCreateEntityMutation() {
    const familyId = useFamilyId();
    const queryClient = useQueryClient();
    const snackbar = useSnackbar();
    const loadingShroud = useLoadingShroud();

    return useMutation({
      mutationFn: async (entity: T): Promise<string> => {
        const response = await fetch(`/api/${name}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-family-id': familyId,
          },
          body: JSON.stringify(entity),
        });

        if (!response.ok) {
          throw response;
        }

        const repo = await response.json();
        return repo[idField] as string;
      },
      onMutate() {
        loadingShroud(true);
      },
      onError() {
        errorSnackbar(snackbar)
      },
      onSuccess(data) {
        successSnackbar(snackbar);

        queryClient.invalidateQueries({
          queryKey: ['_createRepo', name, data],
          exact: true,
        });
      },
      onSettled() {
        loadingShroud(false);
      }
    });
  }

  const EntityAutocompleteRenderOption: FC<{
    entityId: string;
    optionProps: HTMLAttributes<HTMLLIElement>;
  }> = props => {
    const getQuery = useGetEntity(props.entityId)

    return <Box
      component="li"
      {...props.optionProps}
    >
      {getQuery.data ? entityToText(getQuery.data) : 'Loading'}
    </Box>
  }

  const EntityAutocomplete: FC<BaseTextFieldProps & {
    value: string | null
    onChange: (entityId: string | null) => void;
  }> = props => {
    const [inputValue, setInputValue] = useState('');
    const searchQuery = useSearchQuery({
      searchText: inputValue,
      limit: 100,
      offset: 0,
    });

    return <Autocomplete
      value={props.value}
      onChange={(_event, value) => props.onChange(value)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      renderOption={(props, option) => {
        const {key, ...optionProps} = props;
        return <EntityAutocompleteRenderOption key={key} optionProps={optionProps} entityId={option}/>
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
      options={searchQuery.data?.items ?? []}
    />
  }

  return {
    useSearchQuery,
    useGetEntity,
    useUpdateEntityMutation,
    useCreateEntityMutation,
    EntityAutocomplete
  };
}
