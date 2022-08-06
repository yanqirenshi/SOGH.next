import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from './slices/counterSlice.js';

export default function PageRepositories () {
    const count = useSelector(state => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div>

          <div>
            <button aria-label="Increment value"
                    onClick={() => dispatch(increment())}>
              +
            </button>

            <span>{count}</span>

            <button aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}>
              -
            </button>
          </div>

        </div>
    );
}
