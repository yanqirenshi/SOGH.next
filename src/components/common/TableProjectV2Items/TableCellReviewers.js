import * as React from 'react';

import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';

import { reviewersOf, reviewerName, reviewerAvatarUrl, reviewerInitial } from '../reviewer.js';

// Team で avatarUrl が null のときは、src を渡さず、子に名前の頭文字を渡す。
// (MUI の Avatar は、src が無いと、alt の頭文字ではなく、人の形の絵を出すため。名前も無いときは、その絵のまま)
export default function TableCellReviewers (props) {
    const item = props.item;

    return (
        <TableCell>
          {reviewersOf(item).map(reviewer=> {
              const src = reviewerAvatarUrl(reviewer);

              return (
                  <Avatar key={reviewer.id()}
                          alt={reviewerName(reviewer) || undefined}
                          src={src || undefined}
                          sx={{ width: 24, height: 24, display: 'inline-block', ml:0.5, mr:0.5 }}>
                    {src ? null : reviewerInitial(reviewer)}
                  </Avatar>
              );
          })}
        </TableCell>
    );
}
