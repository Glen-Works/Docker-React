import { styled, TextareaAutosize } from '@mui/material';


const TextArea = styled(TextareaAutosize)(
  ({ theme }) => ({
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '10px',
    margin: 0,
    padding: '16px 14px',
    fontSize: '14px',
    fontFamily: '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    fontWeight: 400,
    lineHeight: '1.4375em',
  }));

export default TextArea;




