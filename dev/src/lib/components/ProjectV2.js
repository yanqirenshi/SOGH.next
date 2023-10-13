import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

import Title from './ProjectV2/Title.js';
import Fields from './ProjectV2/Fields.js';
import ReadmeAttributes from './ProjectV2/ReadmeAttributes.js';
import Link from './common/Link.js';

import Tabs from './ProjectV2/Tabs.js';

import Description from './ProjectV2/Description.js';
import GanttChart from './ProjectV2/GanttChart.js';
import Items from './ProjectV2/Items.js';
import Metrix from './ProjectV2/Metrix.js';
import Part from './ProjectV2/Part.js';
import Points from './ProjectV2/Points.js';

export default function ProjectV2 (props) {
    const [tabs, setTabs] = React.useState({
        selected: 'metrix',
        list: [
            { code: 'metrix',      label: 'Metrix' },
            { code: 'items',       label: 'Items' },
            { code: 'gantt-chart', label: 'Gantt Chart' },
            { code: 'part',        label: 'PART' },
            { code: 'points',      label: 'Points' },
            { code: 'description', label: 'Description' },
        ],
    });

    const project = props.project;

    if (!project)
        return null;

    const changeTab = ()=> {
        };

    // console.log(project.owner());
    return (
        <Box sx={{pt:2, pb: 22}}>

          <Container maxWidth="xl">
            <Title project={project}/>
          </Container>

          <Container maxWidth="lg">

            <Box sx={{mt:3}}>
              <S variant="h6">Attributes</S>
              <ReadmeAttributes project={project}/>
            </Box>

            <Box sx={{mt:3}}>
              <S variant="h6">Fields</S>
              <Fields project={project}/>
            </Box>

            <Box sx={{mt:8}}>
              <Tabs data={tabs} onChange={new_tabs=>setTabs(new_tabs)}/>
            </Box>

            {'description'===tabs.selected && <Description/>}
            {'gantt-chart'===tabs.selected && <GanttChart/>}
            {'items'===tabs.selected && <Items/>}
            {'metrix'===tabs.selected && <Metrix/>}
            {'part'===tabs.selected && <Part/>}
            {'points'===tabs.selected && <Points/>}
          </Container>

        </Box>
    );
}
