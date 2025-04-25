"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const { register, loading, error } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			alert("两次输入的密码不一致");
			return;
		}
		try {
			await register(username, password, email, phone);
		} catch (err) {
			console.error("Registration failed:", err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Card className="w-[400px]">
				<CardHeader>
					<CardTitle>注册</CardTitle>
					<CardDescription>创建您的账号</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="username" className="text-sm font-medium">
								用户名
							</label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="email" className="text-sm font-medium">
								邮箱
							</label>
							<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<label htmlFor="phone" className="text-sm font-medium">
								手机号（选填）
							</label>
							<Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
						</div>
						<div className="space-y-2">
							<label htmlFor="password" className="text-sm font-medium">
								密码
							</label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="confirmPassword" className="text-sm font-medium">
								确认密码
							</label>
							<Input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>
						{error && <p className="text-red-500 text-sm">{error}</p>}
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "注册中..." : "注册"}
						</Button>
						<div className="text-sm text-center">
							<span className="text-gray-500">已有账号？</span>
							<Link href="/auth/login" className="text-blue-500 hover:underline ml-1">
								立即登录
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
