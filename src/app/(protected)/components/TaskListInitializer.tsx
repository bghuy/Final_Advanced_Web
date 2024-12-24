'use client'

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTaskList } from '../../../../actions/Task/getTaskList';
import { ISODateString } from '@/types/ISODateString';
export function TaskListInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeTaskList = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)).toISOString() as ISODateString;
        const endOfMonth = new Date(Date.UTC(
            now.getUTCFullYear(), 
            now.getUTCMonth() + 1,
            0,
            23, 59, 59
          )).toISOString() as ISODateString;
        const taskList = await getTaskList(startOfMonth, endOfMonth)
        console.log(taskList,"taskList");
      } catch (error) {
        console.log('Error initializing user profile:', error);
      }
    };

    initializeTaskList();
  }, [dispatch]);

  return null;
}

