'use client';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  NavLink,
  Text,
  Title,
} from '@mantine/core';
import { useUser } from '@auth0/nextjs-auth0';
import {
  IconBooks,
  IconChevronRight,
  IconHome,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';
import { useState } from 'react';

const navList = [
  { href: '/home', label: 'Home', icon: <IconHome size={18} stroke={1.5} /> },
  { href: '/course', label: 'Course',icon: <IconBooks size={18} stroke={1.5} /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const [sideBarStatus, setSideBarStatus] = useState<boolean>(false);

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar Toggle */}
      <ActionIcon
        onClick={() => setSideBarStatus((o) => !o)}
        size="xl"
        variant="subtle"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 100,
        }}
      >
        <IconLayoutSidebarLeftExpand size={28} />
      </ActionIcon>

      {/* Sidebar Drawer */}
      <Drawer
        opened={sideBarStatus}
        onClose={() => setSideBarStatus(false)}
        withCloseButton={false}
        size={280}
        styles={{
          content: {
            background: 'white',
            boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
          },
          body: {
            padding: 'var(--mantine-spacing-lg)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
          root: { zIndex: 200 },
        }}
      >
        {/* User Info */}
        <Box>
          {isLoading && <Text>Loading...</Text>}
          {user && (
            <Box mb="lg">
              <Flex align="center" gap="md">
                <Avatar color="blue" radius="xl" size="lg">
                  {user.name?.[0]}
                </Avatar>
                <Box style={{ flex: 1 }}>
                  <Text fw={600} size="sm">
                    {user.name?.substring(0, user.name.indexOf('@'))}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          <Divider my="md" />

          {/* Navigation */}
          <Box>
            {navList.map((item, key) => (
              <NavLink
                key={key}
                href={item.href}
                label={item.label}
                leftSection={item.icon}
                rightSection={<IconChevronRight size={14} stroke={1.5} />}
                styles={{
                  root: {
                    borderRadius: 'var(--mantine-radius-md)',
                    marginBottom: '4px',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Log Out Button */}
        <Button
          component="a"
          href="/auth/logout"
          variant="light"
          color="red"
          fullWidth
        >
          Log Out
        </Button>
      </Drawer>

      {/* Main Content */}
      <Box style={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}
