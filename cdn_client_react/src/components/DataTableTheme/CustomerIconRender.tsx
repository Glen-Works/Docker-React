import { IconButton, Tooltip, useTheme } from '@mui/material';
import { FC, ReactElement, ReactNode } from 'react';

interface ColumnIconProp {
  title: string,
  color: string,
  background: string,
  children: ReactNode,
  handleClickOpen: () => void,
}
interface ColumnTooltipProp {
  title: string,
  children: ReactElement,
}

// theme.palette.error.main

export const ColumnIconButton: FC<ColumnIconProp> = (props) => {
  const theme = useTheme();
  const { title, color, background, children, handleClickOpen } = props;

  return (
    <Tooltip title={title} arrow>
      <IconButton
        sx={{
          '&:hover': {
            background: background
          },
          color: color
        }}
        color="inherit"
        size="small"
        onClick={handleClickOpen}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

export const ColumnTooltip: FC<ColumnTooltipProp> = (props) => {
  const { title, children } = props;

  return (
    <>
      <Tooltip title={title} arrow>
        {children}
      </Tooltip>
    </>
  );
}
