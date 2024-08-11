import * as React from 'react';
import { useNavigate } from "react-router-dom";
import CONFIG from '../config';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function SignInSide(props) {
  const [textData, setTextData] = React.useState("");
  const navigate = useNavigate();
  return;
}