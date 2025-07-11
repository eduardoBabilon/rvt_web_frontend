import { SignInButtonAD } from '@/components/login/SignInButtonAD';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Text3 } from '../@shared/Texts';

export function LoginBox() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#e9e9e9',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Grid container justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            marginX: '40px',
            width: '350px',
            alignSelf: 'center',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <Text3 className="flex flex-col justify-center items-center text-center">
            <span>Bem-vindo!</span>
            <span>Entre com sua conta Mills.</span>
          </Text3>

          <SignInButtonAD />
        </Paper>
      </Grid>
    </Box>
  );
}
