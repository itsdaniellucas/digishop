import { createMuiTheme } from '@material-ui/core/styles';
import { deepPurple, cyan } from '@material-ui/core/colors';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[800],
    },
    secondary: {
      main: cyan[300],
    },
  },
});

export default theme;
