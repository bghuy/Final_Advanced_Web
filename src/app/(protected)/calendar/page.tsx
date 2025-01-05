'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Calendar } from './components/Calendar';
import { Task } from '@/types/task';
import { GetALLTask } from '@/services/task';
export type SetTasks = Dispatch<SetStateAction<Task[]>>;
export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(()=>{
    GetALLTask()
    .then(data => {
      console.log(data,"data");
      setTasks(data)
    })
  },[])
  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-4xl font-bold mb-8 text-center text-primary">Task Calendar</h1> */}
      <Calendar tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

