import { MenuItem, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguageContext } from 'src/contexts/LanguageContext';

export type MapStyle = {
  [key in "es-US" | "zh-CN" | "zh-TW"]: { label: "English" | "中文(繁)" | "中文(简)"; value: "en" | "tw" | "cn"; };
};

export const laguageMap = {
  "es-US": { label: "English", value: "en" },
  "zh-TW": { label: "中文(繁)", value: "tw" },
  "zh-CN": { label: "中文(简)", value: "cn" },
}

function LanguageBox() {

  const { state, dispatch } = useLanguageContext();

  const { register, setValue, getValues,
    watch, reset, formState: { errors } } = useForm(
      {
        defaultValues: {
          language: "zh-TW",
        }
      });

  const handleLanguageChange = (event) => {
    dispatch(event.target.value);
    setValue("language", event.target.value, { shouldValidate: true });
  };

  useEffect(() => { }, [watch()]);

  return (

    <TextField
      name="language"
      select
      value={getValues("language")}
      {...register("language", {
        required: "Required field"
      })}
      onChange={handleLanguageChange}
      size="small"
    >
      {Object.keys(laguageMap).map((key) => (
        <MenuItem key={key} value={key}>
          {laguageMap[key].label}
        </MenuItem>
      ))
      }
    </TextField>

  );
}

export default LanguageBox;
