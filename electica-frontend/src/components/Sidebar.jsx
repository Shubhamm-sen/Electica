import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from './ui/sidebar';
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconPlus,
    IconUsers,
    IconLogout,
    IconSun,
    IconMoon,
    IconChartBar
} from "@tabler/icons-react";
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function AppSidebar() {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Create Poll",
            href: "/create-poll",
            icon: (
                <IconPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Community Polls",
            href: "/polls",
            icon: (
                <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];

    return (
        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {open ? <Logo /> : <LogoIcon />}
                    <div className="mt-8 flex flex-col gap-2">
                        {links.map((link, idx) => (
                            <SidebarLink key={idx} link={link} />
                        ))}

                        <div
                            onClick={toggleTheme}
                            className="cursor-pointer"
                        >
                            <SidebarLink
                                link={{
                                    label: theme === 'dark' ? "Light Mode" : "Dark Mode",
                                    href: "#",
                                    icon: theme === 'dark' ? (
                                        <IconSun className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                                    ) : (
                                        <IconMoon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                                    )
                                }}
                            />
                        </div>

                        <div
                            onClick={handleLogout}
                            className="cursor-pointer"
                        >
                            <SidebarLink
                                link={{
                                    label: "Logout",
                                    href: "#",
                                    icon: <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <SidebarLink
                        link={{
                            label: user?.username || "User",
                            href: "/profile",
                            icon: (
                                <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                                    {user?.username?.[0]?.toUpperCase() || "U"}
                                </div>
                            ),
                        }}
                    />
                </div>
            </SidebarBody>
        </Sidebar>
    );
}

export const Logo = () => {
    return (
        <Link
            to="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <IconChartBar className="h-6 w-6 text-indigo-500 flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                Electica
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            to="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <IconChartBar className="h-6 w-6 text-indigo-500 flex-shrink-0" />
        </Link>
    );
};

export default AppSidebar;
