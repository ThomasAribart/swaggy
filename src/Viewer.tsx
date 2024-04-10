import { Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Viewer = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Stack direction="row">
      <Button
        variant="contained"
        onClick={() =>
          navigate(
            `/editor${
              window.location.hash !== '#' ? window.location.hash : ''
            }`,
          )
        }
      >
        Edit
      </Button>
    </Stack>
  );
};

export default Viewer;
