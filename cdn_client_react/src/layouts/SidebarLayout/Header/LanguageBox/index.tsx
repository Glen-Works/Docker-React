import { MenuItem, SxProps, TextField, Theme } from '@mui/material';
import { useLanguageContext } from 'src/contexts/LanguageContext';
import { initialLanguageState, LanguageType, setCookieLanguageType } from 'src/stores/reducer/languageReducer';

type MapStyle = {
  [key in LanguageType]: { label: "English" | "中文(繁)" | "中文(简)"; value: "en" | "tw" | "cn"; };
};

export const laguageMap: MapStyle = {
  "es-US": { label: "English", value: "en" },
  "zh-TW": { label: "中文(繁)", value: "tw" },
  "zh-CN": { label: "中文(简)", value: "cn" },
}

interface LanguageBoxProp {
  sx?: SxProps<Theme>;
}


function LanguageBox(props: LanguageBoxProp) {
  const { sx } = props;
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
      sx={sx}
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
