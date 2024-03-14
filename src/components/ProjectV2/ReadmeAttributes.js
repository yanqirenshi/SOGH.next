import React from 'react';

import Box from '@mui/material/Box';

import Priority from './ReadmeAttributes/Priority.js';
import Term from './ReadmeAttributes/Term.js';

export default function ReadmeAttributes (props) {
    const project = props.project;
    const actions = props.actions;
    const values = props.values;
    const onChange = props.onChange;

    const changePriority = (priority)=> onChange('priority', priority);
    const changePlan     = (term)=> onChange('plan', term);
    const changeResult   = (term)=> onChange('result', term);

    return (
        <Box sx={{display:'flex', flexWrap: 'wrap', justifyContent:'center'}}>

          <Box>
            <Priority project={project}
                      value={values.priority}
                      onChange={changePriority}
                      actions={actions}/>
          </Box>

          <Box sx={{ml:6}}>
            <Term project={project}
                  type="plan"
                  value={values.plan}
                  onChange={changePlan}
                  actions={actions}/>
          </Box>

          <Box sx={{ml:6}}>
            <Term project={project}
                  type="result"
                  value={values.result}
                  onChange={changeResult}
                  actions={actions}/>
          </Box>

        </Box>
    );
}
