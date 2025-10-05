'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Burger,
  Button,
  Center,
  Divider,
  Drawer,
  Flex,
  NavLink,
  Text,
  Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import {
  IconChevronRight,
  IconHome,
  IconLayoutSidebarLeftExpand,
} from '@tabler/icons-react';

export default function Home() {
  const { user, isLoading } = useUser();
  const [sideBarStatus, setSideBarStatus] = useState(false);

  const navList = [
    {
      href: '/home',
      label: 'Home',
    },
  ];

  return (
    <Box style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <ActionIcon
        onClick={() => setSideBarStatus((o) => !o)}
        size="xl"
        variant="default"
        style={{
          position: 'absolute',
          top: 11,
          left: 11,
          zIndex: 0,
          border: 'none',
        }}
      >
        <IconLayoutSidebarLeftExpand size={36}></IconLayoutSidebarLeftExpand>
      </ActionIcon>
      <Drawer
        opened={sideBarStatus}
        onClose={() => setSideBarStatus(false)}
        withCloseButton={false}
        size={280} // Mantine’s built-in width control
        styles={{
          content: {
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          },
          body: {
            padding: 'var(--mantine-spacing-md)', // Apply padding to body
            height: '100%', // Make body fill the drawer
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
          root: { zIndex: 1 },
        }}
      >
        {/* User Info */}
        <Box>
          {isLoading && <Title order={4}>Loading...</Title>}
          {user && (
            <Box>
              <Box>
                <Flex style={{ alignItems: 'center', gap: 8 }}>
                  <Badge size="xl" color="red" circle>
                    {user.name?.[0]}
                  </Badge>
                  <div>
                    <Title order={5}>
                      {user.name?.substring(0, user.name.indexOf('@'))}
                    </Title>
                    <Text size="sm" color="dimmed">
                      {user.email}
                    </Text>
                  </div>
                </Flex>
              </Box>
            </Box>
          )}
          <Divider my={'md'}></Divider>
          {/* Course Session */}
          <Box>
            {navList.map((item, key) => (
              <NavLink
                key={key}
                href={item.href}
                label={item.label}
                leftSection={<IconHome size={16} stroke={1.5} />}
                rightSection={
                  <IconChevronRight
                    size={12}
                    stroke={1.5}
                    className="mantine-rotate-rtl"
                  />
                }
                pl={0}
                pr={0}
              ></NavLink>
            ))}
          </Box>
        </Box>
        {/* Log Out Button */}
        <Button
          component="a"
          href="/auth/logout?returnTo=http://localhost:3000"
          color="red"
          mt="xl"
          fullWidth
        >
          Log Out
        </Button>
      </Drawer>

      {/* Main Content */}
      <Box style={{ flex: 1, padding: 32 }}>
        {/* Add your main content here */}
        <Center style={{ height: '100%' }}>
          <Title>Home Page</Title>
        </Center>
      </Box>
    </Box>
  );
}
