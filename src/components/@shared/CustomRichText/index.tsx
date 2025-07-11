import { useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';
import { MenuButtonBold, MenuButtonBulletedList, MenuButtonCodeBlock, MenuButtonEditLink, MenuButtonHighlightColor, MenuButtonHighlightToggle, MenuButtonItalic, MenuControlsContainer, MenuDivider, MenuSelectHeading, RichTextContent, RichTextEditorProvider} from 'mui-tiptap';
import { Button, Divider } from '@mui/material';  // Importando o MUI Button
import { useEffect, useState } from "react";
import { Input } from "../Input";
import { useFormContext } from "react-hook-form";

export default function CustomRichTextEditor({defaultValue, id, label} : {defaultValue: string, id: string, label: string}) {
  const { setValue, getValues} = useFormContext();

  const textValue = getValues(id) ? getValues(id) : defaultValue ? defaultValue : '<p>Insira sua descrição</p>'

  
  useEffect(()=>{ 
      setValue(id, textValue)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: textValue,
    onUpdate:({editor})=>{setValue(id, editor.getHTML())}
  });

  return (
    <div className="border rounded-md group border-transparent focus-within:border-none">
      <div className="border rounded-md focus-within:border-2 focus-within:border-orange-500">
        <RichTextEditorProvider editor={editor}>
          <div className="mt-2 mb-2 ml-2 focus-within:text-orange-500">
            {/* Controles do editor */}
            <MenuControlsContainer>

            <label 
              htmlFor={id} 
              className="font-light text-[#646981] mr-10 leading-4 transition-colors duration-100 group-focus-within:text-orange-500"
            >
              {label}
            </label>
              <MenuSelectHeading />
              <MenuDivider />
              <MenuButtonBold />
              <MenuButtonItalic />
              <MenuButtonBulletedList/>
              
              {/* Adicione mais controles aqui */}
            </MenuControlsContainer>
          </div>
          <Divider />
          <div className="p-4 overflow-x-auto overflow-y-auto h-[150px] w-[480px] break-words">
            {/* Conteúdo do editor */}
            <RichTextContent/>
          </div>
        </RichTextEditorProvider>
      </div>
    </div>
  );
}
