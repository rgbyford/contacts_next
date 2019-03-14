import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import { styleToolbar } from './SharedStyles';

const styleAnchor = {
  margin: '50px 50px 10px auto'
};

function Header() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={9} xs={8} style={{ paddingTop: '20px', textAlign: 'center' }}>
            <a href="/load" target="_self" style={styleAnchor}>
              Load
            </a>
            <a href="/search" target="_self" style={styleAnchor}>
              Search
            </a>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

export default Header;
