import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Title from './ProjectV2/Title.js';
import Fields from './ProjectV2/Fields.js';
import ReadmeAttributes from './ProjectV2/ReadmeAttributes.js';

import Tabs from './ProjectV2/Tabs.js';

import Description from './ProjectV2/Description.js';
import GanttChart from './ProjectV2/GanttChart.js';
import Items from './ProjectV2/Items.js';
import Metrix from './ProjectV2/Metrix.js';
import Part from './ProjectV2/Part.js';
import Points from './ProjectV2/Points.js';

export default function ProjectV2 (props) {
    const project = props.project;
    const items = props.items;

    const [tabs, setTabs] = React.useState({
        selected: 'items',
        list: [
            { code: 'metrix',      label: 'Metrix' },
            { code: 'items',       label: 'Items' },
            { code: 'gantt-chart', label: 'Gantt Chart' },
            { code: 'part',        label: 'PART' },
            { code: 'points',      label: 'Points' },
            { code: 'description', label: 'Description' },
            { code: 'fields',      label: 'Fields' },
        ],
    });

    if (!project)
        return null;

    return (
        <Box>

          <Container maxWidth="xl">
            <Title project={project}/>
          </Container>

          <Container maxWidth="lg">

            <Box sx={{mt:3}}>
              <ReadmeAttributes project={project}/>
            </Box>

            <Box sx={{mt:6}}>
              <Tabs data={tabs} onChange={new_tabs=>setTabs(new_tabs)}/>
            </Box>

            {'description'===tabs.selected && <Description/>}
            {'gantt-chart'===tabs.selected && <GanttChart/>}

            {'items'===tabs.selected &&
             <Box sx={{pt:4}}>
               <Items items={items}/>
             </Box>}

            {'metrix'===tabs.selected && <Metrix/>}
            {'part'===tabs.selected && <Part/>}
            {'points'===tabs.selected && <Points/>}
            {'fields'===tabs.selected &&
             <Box sx={{pt:4}}>
               <Fields project={project}/>
             </Box>}
          </Container>

        </Box>
    );
}
