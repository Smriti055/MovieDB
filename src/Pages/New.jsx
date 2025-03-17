import React, { useState } from 'react'

function New() {
    const [count, setCount] = useState(0);

    const submit = ()=>{
        setCount(count + 1)
    }

    const decreaseCounter = ()=>{
        setCount(count - 1);
    }

  return (
    <div>
        <button onClick={submit}> Counter {count}</button>
        <button onClick={decreaseCounter}>Decrease</button>
    </div>
  )
}

export default New