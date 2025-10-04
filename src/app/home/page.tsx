'use client';
import { Box, Burger, Button, Center, Drawer, Text, Title } from '@mantine/core';
import React, { useState } from 'react';
import { useUser } from "@auth0/nextjs-auth0"
import { IconLayoutSidebarLeftExpand } from "@tabler/icons-react"

export default function Home() {
    const { user, isLoading } = useUser();
    const [sideBarStatus, setSideBarStatus] = useState(false);

    return (
        <Box style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <Burger opened={sideBarStatus}
                onClick={() => setSideBarStatus((o) => !o)}
                size="sm"
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 1000,
                }}>
            </Burger>
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
                        padding: 24,
                        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                    },
                }}
            >
                {/* User Info */}
                <Box>
                    {isLoading && <Title order={4}>Loading...</Title>}
                    {user && <Center>
                        <Box>
                            <Title order={4}>Welcome, {user.name?.substring(0, user.name.indexOf("@"))}</Title>
                            <Text size="sm" color="dimmed">
                                {user.email}
                            </Text>
                        </Box>
                    </Center>}
                </Box>

                {/* Course Session */}
                <Box mt="xl">
                    <Title order={5}>Current Course</Title>
                    <Text>Course Name</Text>
                    <Text size="sm" color="dimmed">
                        Progress: 50%
                    </Text>
                </Box>

                {/* Log Out Button */}
                <Button component="a" href='/auth/logout?returnTo=http://localhost:3000/welcome' color="red" mt="xl" fullWidth>
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