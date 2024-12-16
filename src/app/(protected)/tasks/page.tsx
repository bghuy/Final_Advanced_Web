'use client';

import { useEffect } from 'react';
import { Navbar } from "@/components/navbar/Navbar";
import { TaskTable } from "@/app/(protected)/tasks/components/TaskTable";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from 'next/link';

export default function TaskManagerPage() {
  const { fetchProfile, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        await fetchProfile();
      } catch (error) {
        console.error('Failed to initialize:', error);
        router.push('/auth/login');
      }
    };

    init();
  }, [fetchProfile, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-semibold">User</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-10 h-screen px-2">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <Link href="/tasks/calendar">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar View
            </Button>
          </Link>
        </div>
        <TaskTable />
      </div>
    </div>
  );
}

