"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { userService } from "@/services/userService";
import { User } from "@/services/userService";

export default function UsersPage() {
	const { requireAdmin } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	useEffect(() => {
		if (requireAdmin()) {
			fetchUsers();
		}
	}, []);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const response = await userService.getAllUsers();
			setUsers(response.data);
		} catch (err) {
			setError("获取用户列表失败");
			console.error("Fetch users failed:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async (username: string) => {
		try {
			await userService.deleteUser(username);
			setUsers(users.filter((user) => user.username !== username));
			setIsDeleteDialogOpen(false);
		} catch (err) {
			setError("删除用户失败");
			console.error("Delete user failed:", err);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(user.phone && user.phone.includes(searchTerm))
	);

	if (loading) {
		return <div>加载中...</div>;
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="container mx-auto py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">用户管理</h1>
				<div className="flex items-center space-x-4">
					<Input
						placeholder="搜索用户..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-64"
					/>
				</div>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>用户名</TableHead>
						<TableHead>邮箱</TableHead>
						<TableHead>手机号</TableHead>
						<TableHead>状态</TableHead>
						<TableHead>角色</TableHead>
						<TableHead>操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredUsers.map((user) => (
						<TableRow key={user.username}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{user.phone || "-"}</TableCell>
							<TableCell>{user.status === 1 ? "正常" : "禁用"}</TableCell>
							<TableCell>{user.role === "admin" ? "管理员" : "普通用户"}</TableCell>
							<TableCell>
								<Dialog open={isDeleteDialogOpen && selectedUser?.username === user.username}>
									<DialogTrigger asChild>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => {
												setSelectedUser(user);
												setIsDeleteDialogOpen(true);
											}}
										>
											删除
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>确认删除</DialogTitle>
											<DialogDescription>您确定要删除用户 {user.username} 吗？此操作不可撤销。</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
												取消
											</Button>
											<Button variant="destructive" onClick={() => handleDeleteUser(user.username)}>
												确认删除
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
