import React from 'react';


const style ={
    height: 'auto',
};

export default function SideMenu (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <div style={style}>
          {Menu('Issue')}
          {Menu('Part')}
          {Menu('Project')}
          {Menu('Milestone')}
        </div>
    );
}

function Menu (label) {
    const style = {
        margin: 8,
        padding: 11,
        background: '#eee',
    };

    return (
        <div style={style}>
          {label}
        </div>
    );
}
