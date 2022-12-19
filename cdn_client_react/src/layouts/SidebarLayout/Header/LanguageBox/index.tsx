import { MenuItem, TextField } from '@mui/material';
import { useLanguageContext } from 'src/contexts/LanguageContext';
import { initialLanguageState, setCookieLanguageType } from 'src/stores/reducer/languageReducer';

export type MapStyle = {
  [key in "es-US" | "zh-CN" | "zh-TW"]: { label: "English" | "中文(繁)" | "中文(简)"; value: "en" | "tw" | "cn"; };
};

export const laguageMap = {
  "es-US": { label: "English", value: "en" },
  "zh-TW": { label: "中文(繁)", value: "tw" },
  "zh-CN": { label: "中文(简)", value: "cn" },
}

function LanguageBox() {

  const { dispatch } = useLanguageContext();

  const handleLanguageChange = (event) => {
    dispatch(event.target.value);
    setCookieLanguageType(event.target.value);
  };

  return (

    <TextField
      name="language"
      select
      value={initialLanguageState()}
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
