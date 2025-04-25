# 组件文档

## 概述

本文档描述了Moodshaker应用程序中的主要组件及其用法。

## 表单组件

### FormInput

通用输入框组件，支持图标和错误提示。

\`\`\`tsx
import { FormInput } from '@/components/ui/FormElements';
import { User } from 'lucide-react';

<FormInput
  icon={User}
  id="username"
  label="用户名"
  placeholder="请输入用户名"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error={errors.username}
  required
/>
\`\`\`

### PasswordInput

密码输入框组件，支持显示/隐藏密码切换。

\`\`\`tsx
import { PasswordInput } from '@/components/ui/FormElements';

<PasswordInput
  id="password"
  label="密码"
  placeholder="请输入密码"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={errors.password}
  required
/>
\`\`\`

### LoadingButton

带加载状态的按钮组件。

\`\`\`tsx
import { LoadingButton } from '@/components/ui/FormElements';
import { ArrowRight } from 'lucide-react';

<LoadingButton
  loading={isLoading}
  loadingText="提交中..."
  icon={<ArrowRight className="h-4 w-4" />}
  onClick={handleSubmit}
>
  提交
</LoadingButton>
\`\`\`

## 图片组件

### ImageWithFallback

带备用图像的图片组件，当主图像加载失败时显示备用图像。

\`\`\`tsx
import ImageWithFallback from '@/components/ui/ImageWithFallback';

<ImageWithFallback
  src="/cocktail-image.jpg"
  fallbackSrc="/placeholder.svg"
  alt="鸡尾酒图片"
  fallbackAlt="占位图片"
  width={300}
  height={200}
/>
\`\`\`

## 布局组件

### Header

页面顶部导航栏组件。

\`\`\`tsx
import Header from '@/components/layout/Header';

<Header />
\`\`\`

### Footer

页面底部组件。

\`\`\`tsx
import Footer from '@/components/layout/Footer';

<Footer />
\`\`\`

## 功能组件

### LoadingSpinner

加载中动画组件。

\`\`\`tsx
import LoadingSpinner from '@/components/LoadingSpinner';

<LoadingSpinner text="加载中..." colorClass="border-amber-500" />
\`\`\`

### ThemeToggle

主题切换按钮组件。

\`\`\`tsx
import ThemeToggle from '@/components/ThemeToggle';

<ThemeToggle />
\`\`\`

### LanguageSelector

语言选择器组件。

\`\`\`tsx
import LanguageSelector from '@/components/LanguageSelector';

<LanguageSelector />
\`\`\`

## 上下文提供者

### CocktailProvider

鸡尾酒上下文提供者，管理鸡尾酒推荐相关的状态和操作。

\`\`\`tsx
import { CocktailProvider } from '@/context/CocktailContext';

<CocktailProvider>
  <App />
</CocktailProvider>
\`\`\`

### ThemeProvider

主题上下文提供者，管理应用的主题状态。

\`\`\`tsx
import { ThemeProvider } from '@/context/ThemeContext';

<ThemeProvider>
  <App />
</ThemeProvider>
\`\`\`

### UserProvider

用户上下文提供者，管理用户认证和信息。

\`\`\`tsx
import { UserProvider } from '@/context/UserContext';

<UserProvider>
  <App />
</UserProvider>
\`\`\`

### LanguageProvider

语言上下文提供者，管理应用的多语言支持。

\`\`\`tsx
import { LanguageProvider } from '@/context/LanguageContext';

<LanguageProvider>
  <App />
</LanguageProvider>
\`\`\`

### ErrorProvider

错误上下文提供者，管理应用的错误处理和通知。

\`\`\`tsx
import { ErrorProvider } from '@/context/ErrorContext';

<ErrorProvider>
  <App />
</ErrorProvider>
