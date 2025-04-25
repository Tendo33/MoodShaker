"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
	const { theme } = useTheme();
	const { user, isAuthenticated, logout } = useAuth();
	const [headerClass, setHeaderClass] = useState(
		theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
	);

	useEffect(() => {
		setHeaderClass(theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200");
	}, [theme]);

	return (
		<header className={`sticky top-0 z-10 border-b ${headerClass}`}>
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2 font-bold text-xl">
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center">
						<span className="text-white text-sm">🍹</span>
					</div>
					<span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">MoodShaker</span>
				</Link>
				<div className="flex items-center gap-4">
					{isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
								<Avatar className="h-8 w-8">
									<AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
									<AvatarFallback className="bg-gradient-to-r from-amber-500 to-pink-500 text-white">
										{user?.username ? user.username[0].toUpperCase() : "U"}
									</AvatarFallback>
								</Avatar>
								<span className="hidden md:inline-block text-sm font-medium">{user?.username}</span>
								<ChevronDown className="h-4 w-4 opacity-50" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuItem asChild>
									<Link href="/profile" className="cursor-pointer">
										个人中心
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
									退出登录
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Link
							href="/auth/login"
							className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white font-medium hover:from-amber-600 hover:to-pink-600 transition-all duration-300"
						>
							<LogIn className="h-4 w-4" />
							<span>登录</span>
						</Link>
					)}
					<LanguageSelector />
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
