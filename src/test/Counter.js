"use client";
import { useTestStore } from '@/store/testStore';

export function Counter(){
    const {count, increase, decrease } = useTestStore();

    return <>
        <div className="p-4">
            <h1 className='text-xl'>Counter : {count}</h1>
            <button className='border bg-green-500 p-4 m-4' onClick={increase}>+</button>
            <button className='border bg-red-500 p-4 m-4' onClick={decrease}>-</button>
        </div>
    </>
}