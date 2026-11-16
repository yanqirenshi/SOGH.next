import React from 'react';

import Link from '@mui/material/Link';

import { reviewerName, reviewerUrl } from '../reviewer.js';

// レビュアー (User・Team・Mannequin・Bot のモデル) の名前を、リンクにして出す。
// (data は、モデル。ほかの value/*.js は、JSON を受け取る)
export default function Reviewer (props) {
    const data = props.data;

    if (!data) return null;

    return (
        <Link href={reviewerUrl(data) || undefined}>
          {reviewerName(data)}
        </Link>
    );
}
