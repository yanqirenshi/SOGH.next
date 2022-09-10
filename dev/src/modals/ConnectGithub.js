import React from 'react';

import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

export default function ConnectGithub (props) {
    const [token, setToken] = React.useState('');

    const callbacks = props.callbacks;
    const close = props.close;

    const changeToken = (e)=> setToken(e.target.value);

    const clickConnect = ()=> callbacks.github.auth(
        token,
        { success: ()=> close() },
    );

    return (
        <Modal open={true}
               onClose={close}
               aria-labelledby="modal-modal-title"
               aria-describedby="modal-modal-description">
          <Card sx={style}>
            <CardMedia component="img"
                       height="140"
                       image="https://avatars.githubusercontent.com/u/583231?v=4"
                       alt="github" />

            <CardContent>
              <Typography gutterBottom component="div">
                Github Parsonal Token を入力して Connect を押してください。
              </Typography>

              <TextField id="outlined-basic"
                         sx={{width:'100%'}}
                         label="Token"
                         variant="outlined"
                         value={token}
                         onChange={changeToken} />
            </CardContent>

            <CardActions sx={{display:'flex', justifyContent: 'space-around'}}>
              <Button size="small" onClick={close}>
                Cancel
              </Button>

              <Button size="small" onClick={clickConnect}
                      disabled={token.trim().length===0}>
                Connect
              </Button>
            </CardActions>
          </Card>
        </Modal>
    );
}
