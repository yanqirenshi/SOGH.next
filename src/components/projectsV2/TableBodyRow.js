import React from 'react';
import moment from 'moment';

import Cell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import S from '@mui/material/Typography';
import Button from '@mui/material/Button';

import LinkSogh from '../common/LinkSogh.js';
import Description from '../common/Description.js';
import CellLinkGithub from '../common/TableCellLinkGithub.js';
import CellTimestamps from '../common/TableCellTimestamps.js';
import CellTermPlanResult from '../common/TableCellTermPlanResult.js';

export default function TableBodyRow (props) {
    const project = props.project;
    const actions = props.actions;
    const is_opened = props.opened;
    const onChange = props.onChange;

    const plan = project.plan();
    const result = project.result();

    const priority = getPriority(project.priority());

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <CellLinkGithub data={project}/>

          <Cell sx={{whiteSpace: 'nowrap'}}>
            {project.type()}
          </Cell>

          <Cell>
            <S sx={{
                color: 'rgba(0, 0, 0, 0.87)',
                textDecorationStyle: 'dotted',
                textDecorationColor: '#ddd',
                cursor: 'pointer',

            }}
               onClick={()=> actions.title.click(project.id())}>
              {project.title()}
            </S>
            {/* <Description value={obj.shortDescription()}/> */}
          </Cell>

          {/* <Cell> */}
          {/*   {obj.public() ? '○' : '--'} */}
          {/* </Cell> */}

          <Cell sx={{whiteSpace: 'nowrap'}} title={priority.label}>
            {`${priority.label_short} (${priority.code})`}
          </Cell>

          <Cell sx={{whiteSpace: 'nowrap'}}>
            {project.maneger()}
          </Cell>

          {/* <Cell sx={{whiteSpace: 'nowrap'}}> */}
          {/*   {obj.release()} */}
          {/* </Cell> */}

          <Cell sx={{whiteSpace: 'nowrap'}} title={plan.start}>
            {dt(plan.start)}
          </Cell>

          <Cell sx={{whiteSpace: 'nowrap'}} title={plan.end}>
            {dt(plan.end)}
          </Cell>

          <Cell sx={{whiteSpace: 'nowrap'}} title={result.start}>
            {dt(result.start)}
          </Cell>

          <Cell sx={{whiteSpace: 'nowrap'}} title={result.end}>
            {dt(result.end)}
          </Cell>

          {/* <CellTermPlanResult plan={obj.plan()} */}
          {/*                     result={obj.result()}/> */}

          {/* <CellTimestamps create={obj.createdAt()} */}
          {/*                 update={obj.updatedAt()}/> */}

          <Cell sx={{p:0.1}}>
            <Button variant="text"
                    sx={{p:0.2}}
                    onClick={()=> onChange(project.id())}>
              {is_opened  && "閉じる"}
              {!is_opened && "開く"}
            </Button>
          </Cell>
        </TableRow>
    );
}

function dt (v) {
    if (!v)
        return '?';

    return moment(v).format('MM-DD');
}

function getPriority (v) {
    const table = {
        's': { code: 's', label: '緊急', label_short: '緊', },
        'h': { code: 'h', label: '高い', label_short: '高', },
        'n': { code: 'n', label: '普通', label_short: '普', },
        'l': { code: 'l', label: '低い', label_short: '低', },
        '?': { code: '?', label: 'なぞ', label_short: '謎', },
    };

    return table[v] || {
        code: v,
        label: 'なぞ',
        label_short: '謎',
    };
}
