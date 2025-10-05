import { Box, Button, Center, Text, Title } from '@mantine/core';
import React from 'react';

export default function LogIn() {
    return (
        <Center style={{
            height: '100vh', display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // center all children horizontally
            gap: 8,               // optional spacing between lines
            textAlign: 'center', overflow: 'visible'
        }}
            p={6}>

            <Title style={{ zIndex: 1 }} order={1} fw={500} fz={{ base: 24, xs: 32, sm: 40, md: 48, lg: 64 }}>Signin</Title>
        </Center>
    );
}