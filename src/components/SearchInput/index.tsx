import { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction, useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { TextField } from '@mui/material';

type Props = {
  onChange: (searchTerm: string) => void;
  label?: string;
  setProposalId?: Dispatch<SetStateAction<string>>;
};

export function SearchInput({ onChange, label, setProposalId }: Props) {
  const [shrink, setShrink] = useState(false);
  const [myId, setMyId] = useState<string>('')

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;
    // onChange(searchTerm);
    setMyId(searchTerm)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>){
    if(event.key === 'Enter'){  
      setProposalId!(myId)
    }
  }

  return (
    <TextField
      sx={{
        '& .MuiInputLabel-root:not(.MuiInputLabel-shrink)': {
          transform: 'translate(41px, 17px)',
        },
        width: '100%',
      }}
      onChange={handleSearch}
      onKeyUp={handleKeyDown}
      onFocus={() => setShrink(true)}
      onBlur={(e) => {
        !e.target.value && setShrink(false);
      }}
      label={label}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <svg onClick={()=>setProposalId!(myId)} className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-orange-600 cursor-pointer active:text-orange-400" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: shrink,
      }}
    />
  );
}
