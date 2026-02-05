import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/Sidebar';
import { cn } from '../lib/utils';

const AuthLayout = () => {
    return (
        <div className={cn(
            "flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 w-full h-screen overflow-hidden"
        )}>
            <AppSidebar />

            <main className="flex flex-1 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
                <div className="flex flex-col gap-2 flex-1 w-full h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
