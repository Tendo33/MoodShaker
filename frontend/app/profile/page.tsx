"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
	const { user, loading, error, updateUser, updateAvatar, resetPassword, logout } = useAuth();
	const [email, setEmail] = useState(user?.email || "");
	const [phone, setPhone] = useState(user?.phone || "");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await updateUser({ email, phone });
		} catch (err) {
			console.error("Update profile failed:", err);
		}
	};

	const handleUpdatePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			alert("两次输入的新密码不一致");
			return;
		}
		try {
			await resetPassword(oldPassword, newPassword);
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			console.error("Update password failed:", err);
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// 这里应该先上传文件到服务器，获取URL后再更新头像
			// 为了演示，我们假设已经获取到了URL
			const avatarUrl = URL.createObjectURL(file);
			try {
				await updateAvatar(avatarUrl);
			} catch (err) {
				console.error("Update avatar failed:", err);
			}
		}
	};

	if (loading) {
		return <div>加载中...</div>;
	}

	if (!user) {
		return <div>请先登录</div>;
	}

	return (
		<div className="container mx-auto py-8">
			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle>个人中心</CardTitle>
					<CardDescription>管理您的个人信息</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-4 mb-6">
						<Avatar className="h-20 w-20">
							<AvatarImage src={user.avatar} alt={user.username} />
							<AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="text-lg font-medium">{user.username}</h3>
							<p className="text-sm text-gray-500">{user.email}</p>
						</div>
						<div className="ml-auto">
							<input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatar-upload" />
							<label htmlFor="avatar-upload">
								<Button variant="outline" asChild>
									<span>更换头像</span>
								</Button>
							</label>
						</div>
					</div>

					<Tabs defaultValue="profile">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="profile">个人信息</TabsTrigger>
							<TabsTrigger value="password">修改密码</TabsTrigger>
						</TabsList>
						<TabsContent value="profile">
							<form onSubmit={handleUpdateProfile} className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="email" className="text-sm font-medium">
										邮箱
									</label>
									<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
								</div>
								<div className="space-y-2">
									<label htmlFor="phone" className="text-sm font-medium">
										手机号
									</label>
									<Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
								</div>
								<Button type="submit">保存修改</Button>
							</form>
						</TabsContent>
						<TabsContent value="password">
							<form onSubmit={handleUpdatePassword} className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="oldPassword" className="text-sm font-medium">
										当前密码
									</label>
									<Input
										id="oldPassword"
										type="password"
										value={oldPassword}
										onChange={(e) => setOldPassword(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="newPassword" className="text-sm font-medium">
										新密码
									</label>
									<Input
										id="newPassword"
										type="password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="confirmPassword" className="text-sm font-medium">
										确认新密码
									</label>
									<Input
										id="confirmPassword"
										type="password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>
								<Button type="submit">修改密码</Button>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter>
					<Button variant="destructive" onClick={logout}>
						退出登录
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
