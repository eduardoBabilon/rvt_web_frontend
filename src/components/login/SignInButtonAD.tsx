import { useAuthContext } from '@/contexts/Auth';
import { Button } from '@mui/material';

export const SignInButtonAD = () => {
  const { loginWithAD } = useAuthContext();

  return (
    <Button
      onClick={loginWithAD}
      variant="contained"
      style={{ backgroundColor: '#F37021', width: '100%' }}
    >
      LOGIN
    </Button>
  );
};
