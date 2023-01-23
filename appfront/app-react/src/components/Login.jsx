import React from 'react';
import {useNavigate} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate()
    const theme = createTheme();
    //const baseUrl = 'https://apinvisualwsv2.azurewebsites.net'+'/User/search';
    const baseUrl = 'https://localhost:7230'+'/User/search';
    let usuarioSeleccionado = {
        user_id: 1,
        usuario: '',
        password: '',
        company_id: 1,
        person_id: 1,
        search: 'test',
        created_by: 2,
        updated_by: 2,
        user_status: true,
        updated_date: '2022-06-01T11:08:06',
        created_date: '2022-06-01T11:08:06'
    };
  
    const Login = async (data) => {
        await axios.post(baseUrl, usuarioSeleccionado)
        .then(response => {
            var usuarioRespuesta = response.data
            if(usuarioRespuesta.usuario != null)
            {
                console.log("Inicio exitoso!!!");
                navigate('/home');
              
            }
            else
            console.log("Usuario incorrecto :(")
            ;
        })
        .catch(error => {
            console.log(error);
        })
}
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        usuarioSeleccionado.usuario = data.get('usuario');
        usuarioSeleccionado.password = data.get('password');
        Login(usuarioSeleccionado);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login v1
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="usuario"
                            label="Email Address"
                            name="usuario"
                            autoComplete="usuario"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Recordarme"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Ingresar
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    ¿Olvido su contraseña?
                                </Link>
                            </Grid>
                            <Grid item>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

