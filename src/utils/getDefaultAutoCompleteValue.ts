import { useFormContext } from "react-hook-form";

type defaultValueType={
    label: string;
    value: any;
}

type CustomIconProps = {
  id: string;
  value: any;
  valueList: Array<defaultValueType>;
  setValue: (id: string, value: any) => void;
};

export function getDefaultAutoCompleteValue({id, value, valueList, setValue}: CustomIconProps){
    let myValue: defaultValueType | null = null

    valueList.map(item=>{
        if(item.value === value){
            myValue = item
        }
    })
    setValue(id, value) 
    return myValue
}