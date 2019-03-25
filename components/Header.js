import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import { styleToolbar } from './SharedStyles';
import styled from 'styled-components';

const Button = styled.button`
  &:hover {
    background:teal;
  }
`;

const styles = {
  styleButton: {
    margin: '50px 50px 10px auto',
    fontWeight: '800',
    padding: '5px',
    border: '#1565C0',
    borderStyle: 'solid',
    borderRadius: '10%',
    backgroundColor: '#EA9A40',
    color: 'black'
  }
};

function Header() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={9} xs={8} style={{ paddingTop: '20px', textAlign: 'center' }}>
          <Button as='a' href='/load' style={styles.styleButton}>Load</Button>
          <Button as='a' href='/search' style={styles.styleButton}>Search</Button>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

export default Header;
