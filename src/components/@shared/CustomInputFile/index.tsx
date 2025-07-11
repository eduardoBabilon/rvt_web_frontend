import { InputBaseComponentProps, TextField } from '@mui/material';  // Importando o MUI Button
import { useState } from "react";
import { useFormContext } from "react-hook-form";

interface InputFIleProps {
    id: string;
    inputProps: InputBaseComponentProps | undefined;
    label: string | undefined;
    linkLabel: string | undefined;
    type: string | undefined;
    defaultValue: string | undefined;
}

export default function CustomInputFile({id, inputProps, label, type, defaultValue, linkLabel}: InputFIleProps) {
  const { setValue} = useFormContext();
  const reader = new FileReader();
  const [fileName, setFileName] = useState('')


  return (
    <>
        <TextField 
            type="file"
            inputProps={inputProps}
            id={id}
            onChange={(e)=>{
                const target = e.target as HTMLInputElement;
                let file = target.files![0]
                setFileName(file.name)
                reader.readAsDataURL(file);
                if(type){
                    setValue(type, file.type.split('/')[1])
                }
                setValue('tipoFoto', file.type.split('/')[1])
                reader.onload = () => {
                    const result = reader.result as string; 
                    const base64String = result.split(',')[1];
                    setValue(id, base64String); // Armazena no estado
                };

                reader.onerror = (error) => {
                    console.error("Erro ao converter para Base64:", error);
                };
            }}
            hidden
        />

        <label htmlFor={id}>
            <div className='cursor-pointer duration-200 hover:bg-[#f69a62] active:bg-[#f37021] flex items-center justify-center gap-2 p-3 mt-5 h-10 bg-brand-primary text-white rounded-md text-sm shadow-md uppercase '>
                {label ? label : 'Upload Arquivo'}
            </div>
        </label>
        
        {
            fileName?
                <div>{fileName}</div>
            :
                <a className='text-[#f37021]' href={defaultValue}>{defaultValue ? linkLabel : ''}</a>
        }
        
    </>
        
  );
}
