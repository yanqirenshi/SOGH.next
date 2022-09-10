import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

import Avatar from '@mui/material/Avatar';

export default (props)=> {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">

            <TableHead>
              <TableRow>
                <TableCell>Owner</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Pushed</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((id) => {
                  const obj = sogh.repository(id);
                  const owner = obj.owner();

                  return (
                      <TableRow key={id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <div style={{display:'flex', alignItems: 'center'}}>
                            <Avatar src={owner.avatarUrl} />
                            <Link href={owner.url} style={{marginLeft:11}}>
                              {owner.login}
                            </Link>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Link href={obj.url()}>
                            {obj.name()}
                          </Link>
                        </TableCell>
                        <TableCell>{obj.pushedAt()}</TableCell>
                      </TableRow>
                  );
              })}
            </TableBody>

          </Table>
        </TableContainer>
    );
}
