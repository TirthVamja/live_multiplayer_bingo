import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import CONFIG from '../config';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();




function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://bingo-live.surge.sh/">
        Bingo Live
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



export default function SignInSide(props) {
  const [textData, setTextData] = React.useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      token: data.get('token'),
    });
    handleGetIn(event);
  };

  const handleGenerateToken = async (event) => {
    let data = await fetch(`${CONFIG}/generate_token`);
    console.log("fetched");
    let parsedData = await data.json()
    props.generateTokenState({token:parsedData.token, my_turn:0, navigator:navigate, click_enable:true}); 
    navigate("/BingoPage");
  };

  const handleGetIn = async (event) => {
    let data = await fetch(`${CONFIG}/set_player?token=${textData}`);
    console.log("fetched");
    let parsedData = await data.json()
    if(data.status===200){
      let my_turn = parsedData.my_turn
      console.log("from component did mount",my_turn);
      props.generateTokenState({token:textData, my_turn:parsedData.my_turn, navigator:navigate, click_enable:false});
      navigate("/BingoPage");
    }
    else if(data.status===201){
      console.log("Game is already started...");
    }
    else{
      console.log("Recheck the token");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item sx={{display:'flex', alignItems: 'center'}} xs={12} sm={8} md={5} component={Paper} elevation={6} square >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Join / Generate
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="token"
                label="Enter Token"
                name="token"
                autoFocus
                onChange={(e)=>{setTextData(e.target.value);}}
              />
              <Button
                onClick={handleGetIn}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Join
              </Button>
              <Button
                onClick={handleGenerateToken}
                variant="contained"
                sx={{ mt: 3, mb: 2 , ml: 2}}
              >
              Generate Token
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}