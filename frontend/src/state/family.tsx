import {createContext, FC, ReactNode, useContext, useMemo, useState} from 'react';
import {Box, Button, TextField} from "@mui/material";
import {uuidRegex} from "../regex.ts";

type CtxValue = ReturnType<typeof useState<string | null>>;

const STORAGE_KEY = 'FAMILY_ID'

const Context = createContext<CtxValue>([null, () => {
}]);

let initialFamilyId = localStorage.getItem(STORAGE_KEY);
if (initialFamilyId && !uuidRegex.test(initialFamilyId)) initialFamilyId = null;

export const FamilyIdProvider: FC<{ children: ReactNode }> = props => {
  const [familyId, setFamilyId] = useState<string | null>(initialFamilyId);
  const [inputFamilyId, setInputFamilyId] = useState<string>('');

  const value = useMemo(() => {

    if (familyId) {
      localStorage.setItem(STORAGE_KEY, familyId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    return [familyId, setFamilyId] as CtxValue;
  }, [familyId]);

  if (!familyId) {

    return <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextField
        label="FamilyId"
        value={inputFamilyId}
        onChange={event => setInputFamilyId(event.target.value)}
      />

      <Button
        variant="outlined"
        onClick={() => {
          if (uuidRegex.test(inputFamilyId)) setFamilyId(inputFamilyId);
        }}
      >
        OK
      </Button>
    </Box>
  }

  return <Context.Provider value={value}>
    {props.children}
  </Context.Provider>
};

export function useFamilyId(): string {
  const familyId = useContext(Context)[0]
  if (!familyId) throw new Error('familyId must be provided');
  return familyId;
}
