import { CircularProgress, Modal } from '@mui/material';

interface LodingProp {
  isOpen: boolean,
}

export default function SuspenseLoader(props: LodingProp) {
  const { isOpen } = props;

  return (
    <Modal open={isOpen} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <CircularProgress
        disableShrink
        size={64}
        thickness={3}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          outline: 'none',
        }} />
    </Modal>
  );
}