import { Link as RouterLink} from "react-router-dom"
import { AppBar, Toolbar, Button } from '@mui/material';

export function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" variant="outlined" style={{ marginRight: '10px' }} component={RouterLink} to="/">Cafes</Button>
        <Button color="inherit" variant="outlined" component={RouterLink} to="/employees">Employees</Button>
      </Toolbar>
    </AppBar>
  );
}